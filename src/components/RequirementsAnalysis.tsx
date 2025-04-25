
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Course, MissingRequirements } from '@/models/types';
import { defaultRequirements } from '@/utils/courseDataProcessor';
import { Plus } from 'lucide-react';

interface RequirementsAnalysisProps {
  missingRequirements: MissingRequirements | null;
  completedCourses: Set<string>;
  allCourses: Course[];
  onAddCompleted?: (courseId: string) => void;
}

const RequirementsAnalysis: React.FC<RequirementsAnalysisProps> = ({
  missingRequirements,
  completedCourses,
  allCourses,
  onAddCompleted
}) => {
  if (!missingRequirements) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-nyu-purple">Requirements Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <p className="text-muted-foreground">Select completed courses to see your progress</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const total = defaultRequirements.required_courses.length;
  const completed = total - missingRequirements.required_courses.length;
  const progressPercentage = Math.round((completed / total) * 100);
  
  const getCourseStatus = (courseId: string): { status: string; color: string } => {
    const course = allCourses.find(c => c.course_id === courseId);
    
    if (!course) {
      return { status: 'Unknown', color: 'text-gray-400' };
    }
    
    if (course.enrolled < course.capacity) {
      return { status: 'OPEN', color: 'text-green-500' };
    } else {
      return { status: 'CLOSED', color: 'text-red-500' };
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-nyu-purple">Requirements Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">Overall Progress</h3>
            <Progress value={progressPercentage} className="h-2" />
            <p className="text-sm mt-1">
              {completed}/{total} required courses completed ({progressPercentage}%)
            </p>
          </div>
          
          <ScrollArea className="h-[400px] pr-4">
            <Accordion type="single" collapsible className="w-full">
              {Object.entries(missingRequirements.by_category || {}).map(([category, reqs]) => (
                <AccordionItem key={category} value={category}>
                  <AccordionTrigger className="hover:text-nyu-purple">
                    {category}
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="text-sm space-y-3 pl-1">
                      <p><strong>Credits Required:</strong> {reqs.credits_required}</p>
                      {reqs.notes && (
                        <p><strong>Notes:</strong> {reqs.notes}</p>
                      )}
                      
                      <div>
                        <h4 className="font-medium mb-2">Missing Courses:</h4>
                        <ul className="space-y-2">
                          {Array.from(reqs.missing).map(courseId => {
                            const { status, color } = getCourseStatus(courseId);
                            const isCompleted = completedCourses.has(courseId);
                            
                            return (
                              <li key={courseId} className="flex items-center justify-between gap-2">
                                <span>{courseId}</span>
                                <div className="flex items-center gap-2">
                                  <span className={color}>{status}</span>
                                  {!isCompleted && onAddCompleted && (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => onAddCompleted(courseId)}
                                      className="h-7 px-2"
                                    >
                                      <Plus className="h-4 w-4 mr-1" />
                                      Add
                                    </Button>
                                  )}
                                </div>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
};

export default RequirementsAnalysis;
