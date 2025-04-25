import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Recommendation } from '@/models/types';
import { Loader2 } from 'lucide-react';

interface CourseRecommendationsProps {
  recommendations: Recommendation[];
  interests: string;
  setInterests: (value: string) => void;
  onGetRecommendations: () => void;
  onAddCourse: (courseId: string) => void;
}

const CourseRecommendations: React.FC<CourseRecommendationsProps> = ({
  recommendations,
  interests,
  setInterests,
  onGetRecommendations,
  onAddCourse
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleGetRecommendations = async () => {
    console.log("[CourseRecommendations] Button clicked. Interests:", interests);
    setIsLoading(true);
    try {
      await onGetRecommendations();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-nyu-purple">Course Recommendations</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label htmlFor="interests" className="block text-sm font-medium mb-1">
              Your academic interests and career goals
            </label>
            <Textarea
              id="interests"
              placeholder="E.g., finance, data analysis, marketing, entrepreneurship..."
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
              className="resize-none"
            />
          </div>
          
          <Button 
            onClick={handleGetRecommendations}
            disabled={!interests.trim() || isLoading}
            className="w-full bg-nyu-purple hover:bg-opacity-90"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Getting Recommendations...
              </>
            ) : (
              'Get Recommendations'
            )}
          </Button>
          
          {recommendations.length > 0 && (
            <ScrollArea className="h-[300px] mt-4">
              <div className="space-y-4">
                {recommendations.map((rec) => (
                  <div 
                    key={rec.course.course_id}
                    className="bg-gray-50 rounded-md p-3"
                  >
                    <h4 className="font-medium">{rec.course.course_id}: {rec.course.course_name}</h4>
                    <p className="text-sm text-nyu-purple mt-1">⭐ {rec.reason}</p>
                    <div className="text-sm text-muted-foreground mt-1">
                      <p>Schedule: {rec.course.meets}</p>
                      {rec.course.instructor && <p>Instructor: {rec.course.instructor}</p>}
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-2 border-nyu-purple text-nyu-purple hover:bg-nyu-light-purple hover:bg-opacity-10"
                      onClick={() => onAddCourse(rec.course.course_id)}
                    >
                      Add Course
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
          
          {recommendations.length === 0 && interests.trim() && !isLoading && (
            <p className="text-center py-4 text-muted-foreground">
              Enter your interests and click "Get Recommendations" to see courses that match your interests.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseRecommendations;
