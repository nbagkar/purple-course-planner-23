import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Course } from '@/models/types';

interface CourseListProps {
  courses: Course[];
  selectedCourses: Set<string>;
  onSelectCourse: (uniqueKey: string, isChecked: boolean) => void;
  onAddSelected: () => void;
}

const CourseList: React.FC<CourseListProps> = ({
  courses,
  selectedCourses,
  onSelectCourse,
  onAddSelected
}) => {
  if (courses.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-nyu-purple">Available Courses</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No courses available. Please select a department.</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-nyu-purple">Available Courses</CardTitle>
        <Button 
          onClick={onAddSelected} 
          disabled={selectedCourses.size === 0}
          className="bg-nyu-purple hover:bg-opacity-90"
        >
          Add Selected
        </Button>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {courses.map((course) => {
              const isSelected = selectedCourses.has(course.unique_key);
              const isClosed = course.stat === 'Closed';
              return (
                <div 
                  key={course.unique_key}
                  className={`flex items-start space-x-3 p-3 rounded-md transition-colors ${isClosed ? 'opacity-50 bg-gray-100' : 'hover:bg-gray-50'}`}
                >
                  <Checkbox 
                    id={course.unique_key}
                    checked={isSelected}
                    disabled={isClosed}
                    onCheckedChange={(checked) => onSelectCourse(course.unique_key, !!checked)}
                  />
                  <div className={`${isClosed ? 'cursor-not-allowed' : ''}`}>
                    <label 
                      htmlFor={course.unique_key}
                      className={`font-medium ${isClosed ? 'text-gray-500' : 'cursor-pointer'}`}
                    >
                      {course.course_id}: {course.course_name}
                    </label>
                    <div className={`text-sm text-muted-foreground mt-1 ${isClosed ? 'text-gray-400' : ''}`}>
                      <p>Credits: {course.credits} | Schedule: {course.meets}</p>
                      {course.instructor && <p>Instructor: {course.instructor}</p>}
                      {course.location && <p>Location: {course.location}</p>}
                      <p>
                        Enrollment: {course.enrolled}/{course.capacity} 
                        <span className={`ml-2 font-semibold ${isClosed ? 'text-red-600' : 'text-green-600'}`}>
                          {course.stat}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default CourseList;
