
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CourseMap } from './CourseMap';
import { CourseDetail } from './CourseDetail';
import { Heart, MapPin, Clock, TrendingUp, Calendar } from 'lucide-react';
import { mockCourses } from '../../data/mockData';

export const CourseExplorer = () => {
  const [courses, setCourses] = useState(mockCourses);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [sortBy, setSortBy] = useState('popular');

  const sortedCourses = [...courses].sort((a, b) => {
    if (sortBy === 'popular') {
      return b.likes - a.likes;
    } else {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  const handleLike = (courseId: string) => {
    setCourses(courses.map(course => 
      course.id === courseId 
        ? { ...course, likes: course.likes + 1, isLiked: !course.isLiked }
        : course
    ));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">러닝 코스</h2>
          <Tabs value={sortBy} onValueChange={setSortBy}>
            <TabsList>
              <TabsTrigger value="popular" className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                인기순
              </TabsTrigger>
              <TabsTrigger value="recent" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                최신순
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="space-y-4 max-h-[600px] overflow-y-auto">
          {sortedCourses.map((course) => (
            <Card 
              key={course.id} 
              className="cursor-pointer hover:shadow-lg transition-all duration-200 border-l-4 border-l-blue-500"
              onClick={() => setSelectedCourse(course)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg font-semibold text-gray-800">
                      {course.name}
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      {course.location}
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                    {course.difficulty}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {course.distance}km
                    </span>
                    <span>예상 {course.estimatedTime}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLike(course.id);
                    }}
                    className={`flex items-center gap-1 ${course.isLiked ? 'text-red-500' : 'text-gray-500'}`}
                  >
                    <Heart className={`w-4 h-4 ${course.isLiked ? 'fill-current' : ''}`} />
                    {course.likes}
                  </Button>
                </div>
                <p className="text-sm text-gray-700 line-clamp-2">{course.description}</p>
                <div className="mt-3 text-xs text-gray-500">
                  by {course.author} • {new Date(course.createdAt).toLocaleDateString('ko-KR')}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="lg:sticky lg:top-24">
        {selectedCourse ? (
          <CourseDetail 
            course={selectedCourse} 
            onClose={() => setSelectedCourse(null)} 
          />
        ) : (
          <CourseMap courses={courses} onCourseSelect={setSelectedCourse} />
        )}
      </div>
    </div>
  );
};
