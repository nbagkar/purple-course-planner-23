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
  const [selectedCourseIds, setSelectedCourseIds] = useState<Set<string>>(new Set());
  const [plannedCourses, setPlannedCourses] = useState<Course[]>([]);
  const [coursesSelected, setCoursesSelected] = useState<Set<string>>(new Set());
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
    setSelectedCourseIds(new Set());
  };

  const handleDepartmentChange = (department: string) => {
    setSelectedDepartment(department);
    const filteredCourses = getDepartmentCourses(courses, department);
    setDepartmentCourses(filteredCourses);
    setSelectedCourseIds(new Set());
  };

  const handleSelectCourse = (courseId: string, isChecked: boolean) => {
    const newSelectedCourses = new Set(selectedCourseIds);
    if (isChecked) {
      newSelectedCourses.add(courseId);
    } else {
      newSelectedCourses.delete(courseId);
    }
    setSelectedCourseIds(newSelectedCourses);
  };

  const handleAddSelected = () => {
    if (selectedCourseIds.size === 0) return;
    
    const newPlannedCourses = [...plannedCourses];
    const newCoursesSelected = new Set(coursesSelected);
    
    selectedCourseIds.forEach(courseId => {
      if (!coursesSelected.has(courseId)) {
        const course = getCourseById(courses, courseId);
        if (course) {
          newPlannedCourses.push(course);
          newCoursesSelected.add(courseId);
        }
      }
    });
    
    setPlannedCourses(newPlannedCourses);
    setCoursesSelected(newCoursesSelected);
    setSelectedCourseIds(new Set());
    
    toast.success(`Added ${selectedCourseIds.size} course(s) to your plan`);
  };

  const handleRemoveCourse = (courseId: string) => {
    const newPlannedCourses = plannedCourses.filter(course => course.course_id !== courseId);
    const newCoursesSelected = new Set(coursesSelected);
    newCoursesSelected.delete(courseId);
    
    setPlannedCourses(newPlannedCourses);
    setCoursesSelected(newCoursesSelected);
    
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

  const handleGetRecommendations = () => {
    if (!interests.trim()) {
      toast.error('Please enter your interests first');
      return;
    }
    
    if (courses.length === 0) {
      toast.error('Please upload course data first');
      return;
    }
    
    const recs = getRecommendedCourses(courses, interests, completedCourses);
    setRecommendations(recs);
    
    if (recs.length === 0) {
      toast.info('No matching courses found. Try different interest keywords.');
    } else {
      toast.success(`Found ${recs.length} recommended courses`);
    }
  };

  const handleAddRecommendedCourse = (courseId: string) => {
    if (coursesSelected.has(courseId)) {
      toast.info('This course is already in your plan');
      return;
    }
    
    const course = getCourseById(courses, courseId);
    if (course) {
      setPlannedCourses([...plannedCourses, course]);
      setCoursesSelected(new Set(coursesSelected).add(courseId));
      toast.success('Course added to your plan');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <CourseUploader onCoursesLoaded={handleCoursesLoaded} />
            </div>
            
            <div className="md:col-span-2">
              <Tabs defaultValue="completed" className="w-full">
                <TabsList className="grid grid-cols-2 w-full">
                  <TabsTrigger value="completed">Completed Courses</TabsTrigger>
                  <TabsTrigger value="interests">Your Interests</TabsTrigger>
                </TabsList>
                
                <TabsContent value="completed">
                  <Card>
                    <CardContent className="pt-6">
                      <label className="block text-sm font-medium mb-1">
                        Enter your completed courses (comma-separated course IDs)
                      </label>
                      <Textarea 
                        placeholder="E.g., ECON-UB 1, MATH-UB 121, CORE-UA 400"
                        onChange={(e) => handleCompletedCoursesChange(e.target.value)}
                        className="resize-none"
                      />
                      <p className="text-xs text-muted-foreground mt-2">
                        This will be used to analyze your degree requirements and suggest courses.
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="interests">
                  <CourseRecommendations
                    recommendations={recommendations}
                    interests={interests}
                    setInterests={setInterests}
                    onGetRecommendations={handleGetRecommendations}
                    onAddCourse={handleAddRecommendedCourse}
                  />
                </TabsContent>
              </Tabs>
            </div>
          </div>
          
          <Separator />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="space-y-6">
              <DepartmentSelector 
                departments={departments}
                selectedDepartment={selectedDepartment}
                onDepartmentChange={handleDepartmentChange}
                disabled={departments.length === 0}
              />
              
              <RequirementsAnalysis
                missingRequirements={missingRequirements}
                completedCourses={completedCourses}
                allCourses={courses}
              />
            </div>
            
            <div className="lg:col-span-2 space-y-6">
              <CourseList
                courses={departmentCourses}
                selectedCourses={selectedCourseIds}
                onSelectCourse={handleSelectCourse}
                onAddSelected={handleAddSelected}
              />
              
              <SelectedCourses
                selectedCourses={plannedCourses}
                onRemoveCourse={handleRemoveCourse}
              />
            </div>
          </div>
        </div>
      </main>
      
      <footer className="mt-12 py-6 bg-gray-100 border-t">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500">
          <p>NYU Course Planner - A tool for NYU students to plan their academic journey</p>
          <p className="mt-1">© {new Date().getFullYear()} New York University</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
