
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { MapPin, Clock, Heart, Users, Search, Filter, Play, Star, Target } from 'lucide-react';
import { ImprovedCourseMap } from './ImprovedCourseMap';
import { CourseDetail } from './CourseDetail';
import { LocationFilter } from './LocationFilter';
import { useCourses } from '../../contexts/CourseContext';
import { mockCourses } from '../../data/mockData';

export const CourseRecommendation = () => {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('전체');
  const [selectedDifficulty, setSelectedDifficulty] = useState('전체');
  const { courses } = useCourses();

  // Context에서 가져온 courses가 비어있으면 mockCourses 사용
  const displayCourses = courses.length > 0 ? courses : mockCourses;

  // 필터링 로직
  const filteredCourses = displayCourses.filter(course => {
    const matchesSearch = course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = selectedLocation === '전체' || course.location.includes(selectedLocation);
    const matchesDifficulty = selectedDifficulty === '전체' || course.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesLocation && matchesDifficulty;
  });

  const handleStartRunning = (course: any) => {
    const event = new CustomEvent('startRunningWithCourse', { detail: course });
    window.dispatchEvent(event);
    setSelectedCourse(null);
  };

  // 추천 코스 (상위 3개)
  const recommendedCourses = filteredCourses
    .sort((a, b) => (b.likes + b.completedCount) - (a.likes + a.completedCount))
    .slice(0, 3);

  return (
    <div className="space-y-6">
      {/* 추천 섹션 */}
      <div className="bg-gradient-to-r from-blue-500 to-green-500 rounded-3xl p-6 text-white">
        <div className="flex items-center gap-2 mb-4">
          <Target className="w-6 h-6" />
          <h2 className="text-2xl font-bold">오늘의 추천 코스</h2>
        </div>
        <p className="opacity-90 mb-4">인기있고 완주율이 높은 코스들을 추천해드려요</p>
        
        <div className="grid gap-3">
          {recommendedCourses.map((course, index) => (
            <div 
              key={course.id}
              className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 cursor-pointer hover:bg-white/30 transition-all"
              onClick={() => setSelectedCourse(course)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-white/30 rounded-full w-8 h-8 flex items-center justify-center">
                    <span className="text-white font-bold">{index + 1}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold">{course.name}</h3>
                    <div className="flex items-center gap-2 text-sm opacity-90">
                      <MapPin className="w-3 h-3" />
                      {course.location} • {course.distance}km
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="w-4 h-4 fill-yellow-300 text-yellow-300" />
                    <span>{course.likes}</span>
                  </div>
                  <Button 
                    size="sm" 
                    variant="secondary"
                    className="rounded-full bg-white/30 hover:bg-white/50 text-white border-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStartRunning(course);
                    }}
                  >
                    <Play className="w-3 h-3 mr-1" />
                    시작
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 검색 및 필터 */}
      <div className="space-y-4">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="코스명이나 지역으로 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 rounded-2xl border-gray-200 h-12"
            />
          </div>
          <LocationFilter 
            currentLocation={selectedLocation}
            onLocationChange={setSelectedLocation}
          />
        </div>

        <div className="flex items-center gap-3">
          <Filter className="w-4 h-4 text-gray-500" />
          <div className="flex gap-2 overflow-x-auto pb-2">
            {['전체', '초급', '중급', '고급'].map((difficulty) => (
              <Button
                key={difficulty}
                variant={selectedDifficulty === difficulty ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedDifficulty(difficulty)}
                className="rounded-full min-w-fit"
              >
                {difficulty}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* 지도와 코스 리스트 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-800">모든 코스 ({filteredCourses.length}개)</h3>
          
          <div className="space-y-3 max-h-[500px] overflow-y-auto">
            {filteredCourses.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-2">검색 결과가 없습니다</p>
                <p className="text-sm text-gray-400">다른 조건으로 검색해보세요.</p>
              </div>
            ) : (
              filteredCourses.map((course) => (
                <Card 
                  key={course.id}
                  className="cursor-pointer hover:shadow-lg transition-all duration-200 border-0 shadow-md rounded-2xl bg-white"
                  onClick={() => setSelectedCourse(course)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg text-gray-800 mb-1">
                          {course.name}
                        </h4>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                          <MapPin className="w-3 h-3" />
                          {course.location}
                        </div>
                      </div>
                      <Badge 
                        variant={course.difficulty === '초급' ? 'default' : 
                               course.difficulty === '중급' ? 'secondary' : 'destructive'}
                        className="rounded-full"
                      >
                        {course.difficulty}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-3 mb-3">
                      <div className="text-center bg-blue-50 rounded-xl p-2">
                        <div className="text-sm font-bold text-blue-600">{course.distance}km</div>
                        <div className="text-xs text-gray-600">거리</div>
                      </div>
                      <div className="text-center bg-green-50 rounded-xl p-2">
                        <div className="text-sm font-bold text-green-600">{course.estimatedTime}</div>
                        <div className="text-xs text-gray-600">시간</div>
                      </div>
                      <div className="text-center bg-purple-50 rounded-xl p-2">
                        <div className="text-sm font-bold text-purple-600">{course.likes}</div>
                        <div className="text-xs text-gray-600">좋아요</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Heart className="w-3 h-3" />
                          {course.likes}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {course.completedCount}
                        </span>
                      </div>
                      <Button 
                        size="sm" 
                        className="rounded-full bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStartRunning(course);
                        }}
                      >
                        <Play className="w-3 h-3 mr-1" />
                        시작
                      </Button>
                    </div>
                    
                    {course.tags && course.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {course.tags.slice(0, 3).map((tag: string, index: number) => (
                          <Badge key={index} variant="outline" className="text-xs rounded-full">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>

        <div className="lg:sticky lg:top-24">
          <ImprovedCourseMap 
            courses={filteredCourses} 
            onCourseSelect={setSelectedCourse}
          />
        </div>
      </div>

      <Dialog open={!!selectedCourse} onOpenChange={() => setSelectedCourse(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl">
          {selectedCourse && (
            <CourseDetail 
              course={selectedCourse} 
              onStartRunning={handleStartRunning}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
