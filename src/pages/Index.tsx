import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

import Header from '@/components/Header';
import CourseUploader from '@/components/CourseUploader';
import DepartmentSelector from '@/components/DepartmentSelector';
import CourseList from '@/components/CourseList';
import SelectedCourses from '@/components/SelectedCourses';
import RequirementsAnalysis from '@/components/RequirementsAnalysis';
import CourseRecommendations from '@/components/CourseRecommendations';

import { Course, Recommendation, MissingRequirements } from '@/models/types';
import {
  getDepartments,
  getDepartmentCourses,
  getCourseById,
  getRecommendedCourses,
  getMissingRequirements
} from '@/utils/courseDataProcessor';

const Index = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [departments, setDepartments] = useState<string[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const [departmentCourses, setDepartmentCourses] = useState<Course[]>([]);
  const [selectedCourseKeys, setSelectedCourseKeys] = useState<Set<string>>(new Set());
  const [plannedCourses, setPlannedCourses] = useState<Course[]>([]);
  const [plannedCourseKeys, setPlannedCourseKeys] = useState<Set<string>>(new Set());
  const [completedCourses, setCompletedCourses] = useState<Set<string>>(new Set());
  const [missingRequirements, setMissingRequirements] = useState<MissingRequirements | null>(null);
  const [interests, setInterests] = useState<string>('');
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);

  const handleCoursesLoaded = (loadedCourses: Course[]) => {
    setCourses(loadedCourses);
    const depts = getDepartments(loadedCourses);
    setDepartments(depts);
    
    setSelectedDepartment('');
    setDepartmentCourses([]);
    setSelectedCourseKeys(new Set());
  };

  const handleDepartmentChange = (department: string) => {
    setSelectedDepartment(department);
    const filteredCourses = getDepartmentCourses(courses, department);
    setDepartmentCourses(filteredCourses);
    setSelectedCourseKeys(new Set());
  };

  const handleSelectCourse = (uniqueKey: string, isChecked: boolean) => {
    const newSelectedKeys = new Set(selectedCourseKeys);
    if (isChecked) {
      newSelectedKeys.add(uniqueKey);
    } else {
      newSelectedKeys.delete(uniqueKey);
    }
    setSelectedCourseKeys(newSelectedKeys);
  };

  const handleAddSelected = () => {
    if (selectedCourseKeys.size === 0) return;
    
    const newPlannedCourses = [...plannedCourses];
    const newPlannedKeys = new Set(plannedCourseKeys);
    let addedCount = 0;

    selectedCourseKeys.forEach(uniqueKey => {
      if (!newPlannedKeys.has(uniqueKey)) {
        const course = departmentCourses.find(c => c.unique_key === uniqueKey);
        if (course) {
          newPlannedCourses.push(course);
          newPlannedKeys.add(uniqueKey);
          addedCount++;
        }
      }
    });
    
    setPlannedCourses(newPlannedCourses);
    setPlannedCourseKeys(newPlannedKeys);
    setSelectedCourseKeys(new Set());
    
    if (addedCount > 0) {
      toast.success(`Added ${addedCount} course(s) to your plan`);
    }
  };

  const handleRemoveCourse = (uniqueKey: string) => {
    const newPlannedCourses = plannedCourses.filter(course => course.unique_key !== uniqueKey);
    const newPlannedKeys = new Set(plannedCourseKeys);
    newPlannedKeys.delete(uniqueKey);
    
    setPlannedCourses(newPlannedCourses);
    setPlannedCourseKeys(newPlannedKeys);
    
    toast.success('Course removed from your plan');
  };

  const handleCompletedCoursesChange = (completedCoursesStr: string) => {
    const coursesSet = new Set<string>(
      completedCoursesStr.split(',')
        .map(course => course.trim())
        .filter(course => course.length > 0)
    );
    
    setCompletedCourses(coursesSet);
    
    if (coursesSet.size > 0) {
      const missing = getMissingRequirements(coursesSet);
      setMissingRequirements(missing);
    } else {
      setMissingRequirements(null);
    }
  };

  const handleGetRecommendations = async () => {
    console.log("[Index] Handling GetRecommendations. Interests:", interests, "Courses loaded:", courses.length);
    if (!interests.trim()) {
      toast.error('Please enter your interests first');
      return;
    }
    
    if (courses.length === 0) {
      toast.error('Please upload course data first');
      return;
    }
    
    try {
      console.log("[Index] Calling getRecommendedCourses...");
      const recs = await getRecommendedCourses(courses, interests, completedCourses);
      console.log("[Index] Received recommendations:", recs);
      setRecommendations(recs);
      
      if (recs.length === 0) {
        toast.info('No matching courses found. Try different interest keywords.');
      } else {
        toast.success(`Found ${recs.length} recommended courses`);
      }
    } catch (error) {
      console.error('Error getting recommendations:', error);
      toast.error('Failed to get course recommendations. Please try again.');
    }
  };

  const handleAddRecommendedCourse = (courseId: string) => {
    const courseToAdd = courses.find(c => c.course_id === courseId && c.stat !== 'Closed');

    if (!courseToAdd) {
      toast.error("Could not find an open section for the recommended course.");
      return;
    }
    
    if (plannedCourseKeys.has(courseToAdd.unique_key)) {
      toast.info('This course section is already in your plan');
      return;
    }
    
    setPlannedCourses([...plannedCourses, courseToAdd]);
    setPlannedCourseKeys(new Set(plannedCourseKeys).add(courseToAdd.unique_key));
    toast.success('Course added to your plan');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-100">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <Card className="border-2 border-nyu-purple/20 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="pt-6">
                  <CourseUploader onCoursesLoaded={handleCoursesLoaded} />
                </CardContent>
              </Card>
            </div>
            
            <div className="md:col-span-2">
              <Card className="border-2 border-nyu-purple/20 shadow-lg">
                <CardContent className="p-0">
                  <Tabs defaultValue="completed" className="w-full">
                    <TabsList className="w-full grid grid-cols-2 bg-nyu-purple rounded-t-lg h-12">
                      <TabsTrigger 
                        value="completed" 
                        className="data-[state=active]:bg-white data-[state=active]:text-nyu-purple text-white hover:text-white/90 transition-colors"
                      >
                        Completed Courses
                      </TabsTrigger>
                      <TabsTrigger 
                        value="interests" 
                        className="data-[state=active]:bg-white data-[state=active]:text-nyu-purple text-white hover:text-white/90 transition-colors"
                      >
                        Your Interests
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="completed" className="p-6">
                      <div className="space-y-4">
                        <label className="block text-sm font-medium text-gray-700">
                          Enter your completed courses (comma-separated course IDs)
                        </label>
                        <Textarea 
                          placeholder="E.g., ECON-UB 1, MATH-UB 121, CORE-UA 400"
                          onChange={(e) => handleCompletedCoursesChange(e.target.value)}
                          className="resize-none border-nyu-purple/20 focus:border-nyu-purple focus:ring-nyu-purple"
                        />
                        <p className="text-xs text-muted-foreground">
                          This will be used to analyze your degree requirements and suggest courses.
                        </p>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="interests" className="p-6">
                      <CourseRecommendations
                        recommendations={recommendations}
                        interests={interests}
                        setInterests={setInterests}
                        onGetRecommendations={handleGetRecommendations}
                        onAddCourse={handleAddRecommendedCourse}
                      />
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <Separator className="bg-nyu-purple/20" />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="space-y-6">
              <Card className="border-2 border-nyu-purple/20 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-6">
                  <DepartmentSelector 
                    departments={departments}
                    selectedDepartment={selectedDepartment}
                    onDepartmentChange={handleDepartmentChange}
                    disabled={departments.length === 0}
                  />
                </CardContent>
              </Card>
              
              <Card className="border-2 border-nyu-purple/20 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-6">
                  <RequirementsAnalysis
                    missingRequirements={missingRequirements}
                    completedCourses={completedCourses}
                    allCourses={courses}
                  />
                </CardContent>
              </Card>
            </div>
            
            <div className="lg:col-span-2 space-y-6">
              <Card className="border-2 border-nyu-purple/20 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-6">
                  <CourseList
                    courses={departmentCourses}
                    selectedCourses={selectedCourseKeys}
                    onSelectCourse={handleSelectCourse}
                    onAddSelected={handleAddSelected}
                  />
                </CardContent>
              </Card>
              
              <Card className="border-2 border-nyu-purple/20 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-6">
                  <SelectedCourses
                    selectedCourses={plannedCourses}
                    onRemoveCourse={handleRemoveCourse}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="mt-12 py-6 bg-gradient-to-r from-nyu-purple/5 to-nyu-silver/5 border-t border-nyu-purple/10">
        <div className="container mx-auto px-4 text-center text-sm text-gray-600">
          <p>NYU Course Planner - A tool for NYU students to plan their academic journey</p>
          <p className="mt-1">© {new Date().getFullYear()} New York University</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
