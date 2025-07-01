
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { X, MapPin, Clock, TrendingUp, User, Calendar, Heart, Play } from 'lucide-react';

export const CourseDetail = ({ course, onClose }) => {
  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <CardTitle className="text-xl font-bold text-gray-800">
            {course.name}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <MapPin className="w-4 h-4" />
          {course.location}
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-y-auto space-y-4">
        <div className="flex items-center gap-4">
          <Badge variant="secondary" className="bg-green-100 text-green-700">
            {course.difficulty}
          </Badge>
          <div className="flex items-center gap-1 text-red-500">
            <Heart className="w-4 h-4 fill-current" />
            <span className="text-sm">{course.likes}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              거리
            </div>
            <div className="text-2xl font-bold text-blue-600">{course.distance}km</div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <TrendingUp className="w-4 h-4" />
              예상 시간
            </div>
            <div className="text-2xl font-bold text-green-600">{course.estimatedTime}</div>
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="font-semibold mb-2 text-gray-800">코스 설명</h3>
          <p className="text-gray-700 leading-relaxed">{course.description}</p>
        </div>

        <Separator />

        <div className="space-y-3">
          <h3 className="font-semibold text-gray-800">코스 정보</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-gray-600">
                <User className="w-4 h-4" />
                작성자
              </span>
              <span className="font-medium">{course.author}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-gray-600">
                <Calendar className="w-4 h-4" />
                생성일
              </span>
              <span className="font-medium">
                {new Date(course.createdAt).toLocaleDateString('ko-KR')}
              </span>
            </div>
          </div>
        </div>

        {course.tags && (
          <>
            <Separator />
            <div>
              <h3 className="font-semibold mb-2 text-gray-800">태그</h3>
              <div className="flex flex-wrap gap-2">
                {course.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    #{tag}
                  </Badge>
                ))}
              </div>
            </div>
          </>
        )}
      </CardContent>

      <div className="p-4 border-t">
        <Button className="w-full bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600">
          <Play className="w-4 h-4 mr-2" />
          이 코스로 러닝 시작
        </Button>
      </div>
    </Card>
  );
};
