
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { X, MapPin, Clock, TrendingUp, User, Calendar, Heart, Play, Users } from 'lucide-react';

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
          <div className="flex items-center gap-1 text-blue-600">
            <Users className="w-4 h-4" />
            <span className="text-sm">{course.completedCount}명 완주</span>
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

        {/* 경로 지도 표시 영역 */}
        <Separator />
        <div>
          <h3 className="font-semibold mb-3 text-gray-800">코스 경로</h3>
          <div className="bg-gray-100 rounded-lg p-4 h-48 flex items-center justify-center">
            <div className="text-center space-y-2">
              <MapPin className="w-8 h-8 text-blue-500 mx-auto" />
              <div className="text-sm text-gray-600">
                <div className="font-medium">총 {course.routeCoordinates?.length || 0}개 지점</div>
                <div className="text-xs mt-1">
                  시작: {course.routeCoordinates?.[0]?.[1].toFixed(4)}, {course.routeCoordinates?.[0]?.[0].toFixed(4)}
                </div>
                <div className="text-xs">
                  종료: {course.routeCoordinates?.[course.routeCoordinates.length-1]?.[1].toFixed(4)}, {course.routeCoordinates?.[course.routeCoordinates.length-1]?.[0].toFixed(4)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 고도 정보 추가 */}
        {course.elevationProfile && (
          <>
            <Separator />
            <div>
              <h3 className="font-semibold mb-3 text-gray-800">고도 정보</h3>
              <div className="grid grid-cols-3 gap-2 text-center text-sm">
                <div>
                  <div className="text-lg font-bold text-green-600">
                    {Math.max(...course.elevationProfile)}m
                  </div>
                  <div className="text-xs text-gray-600">최고 고도</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-blue-600">
                    {Math.min(...course.elevationProfile)}m
                  </div>
                  <div className="text-xs text-gray-600">최저 고도</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-purple-600">
                    {Math.max(...course.elevationProfile) - Math.min(...course.elevationProfile)}m
                  </div>
                  <div className="text-xs text-gray-600">고도차</div>
                </div>
              </div>
            </div>
          </>
        )}

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
            {course.region && (
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-gray-600">
                  <MapPin className="w-4 h-4" />
                  지역
                </span>
                <span className="font-medium">{course.region} {course.district}</span>
              </div>
            )}
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
