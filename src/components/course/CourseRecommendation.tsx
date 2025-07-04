import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { MapPin, Clock, Heart, Users, Search, Filter, Play, Star, Target, Zap } from 'lucide-react';
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
    <div className="h-full overflow-y-auto bg-gray-50">
      {/* 상단 인사말 섹션 */}
      <div className="bg-gradient-to-br from-blue-500 via-blue-600 to-green-500 px-6 py-8 text-white">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">안녕하세요! 👋</h1>
          <p className="text-blue-100 text-sm">오늘도 건강한 러닝을 시작해보세요</p>
        </div>

        {/* 검색 바 */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            placeholder="코스명이나 지역으로 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 bg-white/20 backdrop-blur-sm border-white/30 text-white placeholder:text-white/70 h-14 rounded-2xl"
          />
        </div>
      </div>

      <div className="px-6 -mt-4 space-y-6">
        {/* 빠른 필터 */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-3xl">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Filter className="w-4 h-4 text-gray-600" />
              <span className="font-medium text-gray-700">빠른 필터</span>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {['전체', '초급', '중급', '고급'].map((difficulty) => (
                <Button
                  key={difficulty}
                  variant={selectedDifficulty === difficulty ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedDifficulty(difficulty)}
                  className="rounded-full min-w-fit bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600"
                >
                  {difficulty}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 오늘의 추천 */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-red-500 rounded-xl flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">오늘의 추천</h2>
          </div>
          
          <div className="space-y-3">
            {recommendedCourses.slice(0, 2).map((course, index) => (
              <Card 
                key={course.id}
                className="cursor-pointer hover:shadow-xl transition-all duration-300 border-0 shadow-md rounded-3xl bg-white transform hover:-translate-y-1"
                onClick={() => setSelectedCourse(course)}
              >
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-green-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-lg">{index + 1}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-bold text-lg text-gray-800 truncate">{course.name}</h3>
                        <Badge 
                          variant={course.difficulty === '초급' ? 'default' : 
                                 course.difficulty === '중급' ? 'secondary' : 'destructive'}
                          className="rounded-full ml-2"
                        >
                          {course.difficulty}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                        <MapPin className="w-4 h-4" />
                        <span className="truncate">{course.location}</span>
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
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium text-gray-700">{course.likes}</span>
                        </div>
                        <Button 
                          size="sm" 
                          className="rounded-full bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 px-6"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStartRunning(course);
                          }}
                        >
                          <Play className="w-4 h-4 mr-1" />
                          시작하기
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* 지도 섹션 */}
        <div>
          <h3 className="text-lg font-bold text-gray-800 mb-4">코스 지도</h3>
          <Card className="border-0 shadow-lg rounded-3xl overflow-hidden">
            <div className="h-64">
              <ImprovedCourseMap 
                courses={filteredCourses} 
                onCourseSelect={setSelectedCourse}
              />
            </div>
          </Card>
        </div>

        {/* 모든 코스 리스트 */}
        <div className="pb-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-800">모든 코스</h3>
            <Badge variant="outline" className="rounded-full">
              {filteredCourses.length}개
            </Badge>
          </div>
          
          <div className="space-y-3">
            {filteredCourses.length === 0 ? (
              <Card className="border-0 shadow-md rounded-3xl">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 mb-2">검색 결과가 없습니다</p>
                  <p className="text-sm text-gray-400">다른 조건으로 검색해보세요.</p>
                </CardContent>
              </Card>
            ) : (
              filteredCourses.map((course) => (
                <Card 
                  key={course.id}
                  className="cursor-pointer hover:shadow-xl transition-all duration-300 border-0 shadow-md rounded-3xl bg-white transform hover:-translate-y-1"
                  onClick={() => setSelectedCourse(course)}
                >
                  <CardContent className="p-5">
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
      </div>

      <Dialog open={!!selectedCourse} onOpenChange={() => setSelectedCourse(null)}>
        <DialogContent className="max-w-[95vw] max-h-[90vh] overflow-y-auto rounded-3xl mx-4">
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
