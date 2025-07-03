
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { MapPin, Clock, Heart, Users, Search, Filter, Play } from 'lucide-react';
import { CourseMap } from './CourseMap';
import { CourseDetail } from './CourseDetail';
import { LocationFilter } from './LocationFilter';
import { useCourses } from '../../contexts/CourseContext';

export const CourseExplorer = () => {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('전체');
  const [selectedDifficulty, setSelectedDifficulty] = useState('전체');
  const { courses } = useCourses();

  const filteredCourses = courses.filter(course => {
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">러닝 코스 둘러보기</h2>
          <p className="text-gray-600">다양한 러닝 코스를 탐색하고 새로운 경험을 시작해보세요</p>
        </div>

        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="코스명이나 지역으로 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <LocationFilter 
            currentLocation={selectedLocation}
            onLocationChange={setSelectedLocation}
          />
        </div>

        <div className="flex gap-2">
          <Filter className="w-4 h-4 mt-1 text-gray-500" />
          <div className="flex gap-2">
            {['전체', '초급', '중급', '고급'].map((difficulty) => (
              <Button
                key={difficulty}
                variant={selectedDifficulty === difficulty ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedDifficulty(difficulty)}
              >
                {difficulty}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-4 max-h-[600px] overflow-y-auto">
          {filteredCourses.map((course) => (
            <Card 
              key={course.id}
              className="cursor-pointer hover:shadow-lg transition-all duration-200 border-l-4 border-l-blue-500"
              onClick={() => setSelectedCourse(course)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg font-semibold text-gray-800">
                    {course.name}
                  </CardTitle>
                  <Badge variant={course.difficulty === '초급' ? 'default' : course.difficulty === '중급' ? 'secondary' : 'destructive'}>
                    {course.difficulty}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4" />
                  {course.location}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-600">{course.distance}km</div>
                    <div className="text-xs text-gray-600">거리</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">{course.estimatedTime}</div>
                    <div className="text-xs text-gray-600">예상 시간</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Heart className="w-4 h-4" />
                      {course.likes}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {course.completedCount}
                    </span>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline"
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
                  <div className="flex flex-wrap gap-1 mt-2">
                    {course.tags.slice(0, 3).map((tag: string, index: number) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="lg:sticky lg:top-24">
        <CourseMap 
          courses={filteredCourses} 
          onCourseSelect={setSelectedCourse}
        />
      </div>

      <Dialog open={!!selectedCourse} onOpenChange={() => setSelectedCourse(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
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
