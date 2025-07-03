
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { MapPin, Clock, Calendar, Thermometer, Cloud, Heart, Activity, Play } from 'lucide-react';
import { SimpleMap } from './SimpleMap';
import { useToast } from '@/hooks/use-toast';

interface CourseDetailProps {
  course: any;
  onStartRunning?: (course: any) => void;
}

export const CourseDetail: React.FC<CourseDetailProps> = ({ course, onStartRunning }) => {
  const { toast } = useToast();

  const handleStartRunning = () => {
    if (onStartRunning) {
      onStartRunning(course);
      toast({
        title: "러닝 시작!",
        description: `${course.name} 코스로 러닝을 시작합니다.`,
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          {course.name}
        </h2>
        <div className="flex items-center gap-2 text-gray-600">
          <MapPin className="w-4 h-4" />
          {course.location}
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{course.distance}km</div>
          <div className="text-sm text-gray-600">거리</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{course.estimatedTime}</div>
          <div className="text-sm text-gray-600">예상 시간</div>
        </div>
        <div className="text-center">
          <Badge variant={course.difficulty === '쉬움' ? 'default' : course.difficulty === '보통' ? 'secondary' : 'destructive'}>
            {course.difficulty}
          </Badge>
          <div className="text-sm text-gray-600 mt-1">난이도</div>
        </div>
      </div>

      <Button 
        onClick={handleStartRunning}
        className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-semibold py-3"
      >
        <Play className="w-5 h-5 mr-2" />
        이 코스로 러닝 시작하기
      </Button>

      <Separator />

      <div>
        <h3 className="font-semibold mb-3 text-gray-800">코스 경로</h3>
        <div className="h-48 bg-slate-50 rounded-lg overflow-hidden">
          <SimpleMap courses={[course]} onCourseSelect={() => {}} />
        </div>
      </div>

      <Separator />

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-800">코스 정보</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-gray-600">
                <Heart className="w-4 h-4" />
                좋아요
              </span>
              <span className="font-medium">{course.likes}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-gray-600">
                <Activity className="w-4 h-4" />
                완주자
              </span>
              <span className="font-medium">{course.completedCount}명</span>
            </div>
          </div>
        </div>
        
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-800">특징</h3>
          <div className="flex flex-wrap gap-1">
            {course.tags?.map((tag: string, index: number) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {course.description && (
        <>
          <Separator />
          <div>
            <h3 className="font-semibold mb-2 text-gray-800">코스 설명</h3>
            <p className="text-gray-700 leading-relaxed bg-gray-50 p-3 rounded-lg">
              {course.description}
            </p>
          </div>
        </>
      )}
    </div>
  );
};
