
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Navigation, Heart, Users, Play, Target, Filter, Search } from 'lucide-react';

interface ImprovedCourseMapProps {
  courses: any[];
  onCourseSelect: (course: any) => void;
}

export const ImprovedCourseMap: React.FC<ImprovedCourseMapProps> = ({ courses, onCourseSelect }) => {
  const [hoveredCourse, setHoveredCourse] = useState<any>(null);
  const [selectedRouteType, setSelectedRouteType] = useState('전체');

  // 서울 지역 실제 좌표를 SVG 좌표로 변환하는 함수
  const coordToSVG = (lng: number, lat: number) => {
    // 서울 중심 좌표 (126.9784, 37.5666)를 기준으로 변환
    const centerLng = 126.9784;
    const centerLat = 37.5666;
    const scale = 8000; // 스케일 조정
    
    const x = 300 + (lng - centerLng) * scale;
    const y = 200 - (lat - centerLat) * scale;
    
    return { x: Math.max(20, Math.min(580, x)), y: Math.max(20, Math.min(380, y)) };
  };

  const routeColors = {
    '초급': '#10B981',
    '중급': '#F59E0B', 
    '고급': '#EF4444'
  };

  const filteredCourses = selectedRouteType === '전체' 
    ? courses 
    : courses.filter(course => course.difficulty === selectedRouteType);

  return (
    <Card className="h-[600px] overflow-hidden rounded-3xl shadow-xl bg-white border-0">
      <CardHeader className="pb-4 bg-gradient-to-r from-blue-50 to-green-50">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg font-bold text-gray-800">
            <Navigation className="w-5 h-5 text-blue-500" />
            러닝 코스 지도
          </CardTitle>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <div className="flex gap-1">
              {['전체', '초급', '중급', '고급'].map((type) => (
                <Button
                  key={type}
                  variant={selectedRouteType === type ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedRouteType(type)}
                  className="text-xs rounded-full px-3 py-1 h-7"
                >
                  {type}
                </Button>
              ))}
            </div>
          </div>
        </div>
        <div className="text-sm text-gray-600">
          {filteredCourses.length}개의 코스가 있습니다
        </div>
      </CardHeader>
      
      <CardContent className="p-0 h-[calc(100%-120px)] relative">
        <div className="w-full h-full bg-gradient-to-br from-slate-50 to-blue-50 relative overflow-hidden">
          {/* 지도 배경 SVG */}
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 600 400"
            className="absolute inset-0"
          >
            {/* 배경 정의 */}
            <defs>
              <pattern id="mapGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e2e8f0" strokeWidth="1" opacity="0.3"/>
              </pattern>
              
              <linearGradient id="riverGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#60a5fa" />
                <stop offset="50%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#1e40af" />
              </linearGradient>
              
              <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                <feDropShadow dx="2" dy="2" stdDeviation="3" floodColor="#00000020"/>
              </filter>
            </defs>
            
            {/* 배경 */}
            <rect width="100%" height="100%" fill="#f8fafc" />
            <rect width="100%" height="100%" fill="url(#mapGrid)" />
            
            {/* 한강 표현 - 실제 지형과 유사하게 */}
            <path
              d="M 80 220 Q 150 200 220 210 Q 290 220 360 215 Q 430 210 500 220 Q 520 225 540 230"
              stroke="url(#riverGradient)"
              strokeWidth="16"
              fill="none"
              opacity="0.8"
            />
            
            {/* 주요 랜드마크 */}
            <g>
              {/* 남산 */}
              <circle cx="300" cy="180" r="8" fill="#16a34a" opacity="0.6" />
              <text x="312" y="185" className="text-xs fill-green-700 font-medium">남산</text>
              
              {/* 여의도 */}
              <rect x="220" y="205" width="40" height="15" fill="#94a3b8" opacity="0.5" rx="3" />
              <text x="225" y="203" className="text-xs fill-gray-600 font-medium">여의도</text>
              
              {/* 잠실 */}
              <circle cx="450" cy="190" r="12" fill="#f59e0b" opacity="0.4" />
              <text x="420" y="178" className="text-xs fill-orange-600 font-medium">잠실</text>
              
              {/* 강남 */}
              <rect x="350" y="250" width="60" height="20" fill="#8b5cf6" opacity="0.3" rx="5" />
              <text x="370" y="263" className="text-xs fill-purple-700 font-medium">강남</text>
            </g>

            {/* 코스 경로들 */}
            {filteredCourses.map((course, index) => {
              const startPoint = coordToSVG(course.coordinates[0], course.coordinates[1]);
              const routeColor = routeColors[course.difficulty] || '#3B82F6';
              
              // 코스 경로 그리기
              if (course.routeCoordinates && course.routeCoordinates.length > 1) {
                const pathData = course.routeCoordinates
                  .map((coord: number[], i: number) => {
                    const point = coordToSVG(coord[0], coord[1]);
                    return `${i === 0 ? 'M' : 'L'} ${point.x} ${point.y}`;
                  })
                  .join(' ');

                return (
                  <g key={course.id}>
                    {/* 코스 경로 라인 */}
                    <path
                      d={pathData}
                      stroke={routeColor}
                      strokeWidth="4"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      opacity="0.8"
                      className="cursor-pointer hover:opacity-100 transition-all"
                      filter="url(#shadow)"
                      onClick={() => onCourseSelect(course)}
                      onMouseEnter={() => setHoveredCourse(course)}
                      onMouseLeave={() => setHoveredCourse(null)}
                    />
                    
                    {/* 시작점 마커 */}
                    <g className="cursor-pointer" onClick={() => onCourseSelect(course)}>
                      <circle
                        cx={startPoint.x}
                        cy={startPoint.y}
                        r="8"
                        fill="white"
                        stroke={routeColor}
                        strokeWidth="3"
                        className="hover:r-10 transition-all"
                        filter="url(#shadow)"
                      />
                      <circle
                        cx={startPoint.x}
                        cy={startPoint.y}
                        r="4"
                        fill={routeColor}
                      />
                      
                      {/* 거리 표시 */}
                      <text
                        x={startPoint.x}
                        y={startPoint.y - 15}
                        textAnchor="middle"
                        className="text-xs font-bold fill-gray-700"
                        style={{ textShadow: '1px 1px 2px white' }}
                      >
                        {course.distance}km
                      </text>
                    </g>
                  </g>
                );
              }
              
              return null;
            })}
            
            {/* 호버된 코스 정보 */}
            {hoveredCourse && (
              <g>
                <rect
                  x="20"
                  y="20"
                  width="200"
                  height="80"
                  fill="white"
                  stroke="#e2e8f0"
                  strokeWidth="2"
                  rx="8"
                  filter="url(#shadow)"
                />
                <text x="30" y="40" className="text-sm font-bold fill-gray-800">
                  {hoveredCourse.name}
                </text>
                <text x="30" y="55" className="text-xs fill-gray-600">
                  📍 {hoveredCourse.location}
                </text>
                <text x="30" y="70" className="text-xs fill-gray-600">
                  🏃 {hoveredCourse.distance}km • {hoveredCourse.estimatedTime}
                </text>
                <text x="30" y="85" className="text-xs fill-gray-600">
                  ❤️ {hoveredCourse.likes} • 👥 {hoveredCourse.completedCount}
                </text>
              </g>
            )}
          </svg>
          
          {/* 우측 코스 목록 */}
          <div className="absolute top-4 right-4 w-64 max-h-[calc(100%-2rem)] overflow-y-auto space-y-2">
            {filteredCourses.slice(0, 6).map((course, index) => (
              <div
                key={course.id}
                className="bg-white/95 backdrop-blur-sm rounded-2xl p-3 shadow-lg cursor-pointer hover:bg-white hover:shadow-xl transition-all border border-white/50"
                onClick={() => onCourseSelect(course)}
                onMouseEnter={() => setHoveredCourse(course)}
                onMouseLeave={() => setHoveredCourse(null)}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div 
                    className="w-3 h-3 rounded-full flex-shrink-0" 
                    style={{ backgroundColor: routeColors[course.difficulty] }}
                  />
                  <h4 className="font-semibold text-sm text-gray-800 truncate">
                    {course.name}
                  </h4>
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-xs text-gray-600">
                    <MapPin className="w-3 h-3 flex-shrink-0" />
                    <span className="truncate">{course.location}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-blue-600">{course.distance}km</span>
                    <Badge 
                      variant="outline" 
                      className="text-xs px-2 py-0 border-current"
                      style={{ color: routeColors[course.difficulty] }}
                    >
                      {course.difficulty}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-gray-500">
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
                      className="h-6 px-2 text-xs rounded-full bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        onCourseSelect(course);
                      }}
                    >
                      <Play className="w-3 h-3 mr-1" />
                      시작
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            
            {filteredCourses.length > 6 && (
              <div className="bg-white/80 rounded-2xl p-2 text-center">
                <span className="text-xs text-gray-600">
                  +{filteredCourses.length - 6}개 더보기
                </span>
              </div>
            )}
          </div>
          
          {/* 범례 */}
          <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm p-3 rounded-2xl shadow-lg border border-white/50">
            <div className="text-xs font-semibold text-gray-700 mb-2">범례</div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <div className="w-4 h-1 bg-blue-500 rounded opacity-80"></div>
                <span>러닝 코스</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <div className="w-3 h-3 bg-white border-2 border-blue-500 rounded-full"></div>
                <span>시작점</span>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: routeColors['초급'] }}></div>
                  <span className="text-gray-600">초급</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: routeColors['중급'] }}></div>
                  <span className="text-gray-600">중급</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: routeColors['고급'] }}></div>
                  <span className="text-gray-600">고급</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
