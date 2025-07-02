
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Route } from 'lucide-react';
import { SimpleMap } from './SimpleMap';

export const CourseMap = ({ courses, onCourseSelect }) => {
  return (
    <Card className="h-[600px]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Route className="w-5 h-5 text-blue-500" />
          코스 경로 지도
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 h-[calc(100%-80px)]">
        <SimpleMap courses={courses} onCourseSelect={onCourseSelect} />
      </CardContent>
    </Card>
  );
};
