
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { Course } from '@/models/types';

interface SelectedCoursesProps {
  selectedCourses: Course[];
  onRemoveCourse: (courseId: string) => void;
}

const SelectedCourses: React.FC<SelectedCoursesProps> = ({
  selectedCourses,
  onRemoveCourse,
}) => {
  const totalCredits = selectedCourses.reduce((sum, course) => sum + course.credits, 0);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-nyu-purple">Selected Courses</CardTitle>
      </CardHeader>
      <CardContent>
        {selectedCourses.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <p>No courses selected yet</p>
            <p className="text-sm mt-2">Select courses from the available courses list</p>
          </div>
        ) : (
          <ScrollArea className="h-[300px]">
            <div className="space-y-3">
              {selectedCourses.map((course) => (
                <div 
                  key={course.course_id}
                  className="bg-gray-50 rounded-md p-3 relative"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{course.course_id}: {course.course_name}</h4>
                      <div className="text-sm text-muted-foreground mt-1">
                        <p>Credits: {course.credits} | {course.meets}</p>
                        {course.instructor && <p>Instructor: {course.instructor}</p>}
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0" 
                      onClick={() => onRemoveCourse(course.course_id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <div>
          <Badge variant="outline" className="bg-nyu-purple text-white">
            Total Credits: {totalCredits}
          </Badge>
        </div>
        <div className="text-sm text-muted-foreground">
          Need 128 credits to graduate
        </div>
      </CardFooter>
    </Card>
  );
};

export default SelectedCourses;
