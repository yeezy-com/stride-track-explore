
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

  // 실제 서울 좌표를 SVG 좌표로 변환하는 함수
  const coordToSVG = (lng: number, lat: number) => {
    // 서울 경계를 반영한 좌표 변환
    const minLng = 126.734, maxLng = 127.270;
    const minLat = 37.428, maxLat = 37.701;
    
    const x = ((lng - minLng) / (maxLng - minLng)) * 560 + 20;
    const y = ((maxLat - lat) / (maxLat - minLat)) * 360 + 20;
    
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
            서울 러닝 코스 지도
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
          {/* 실제 서울 지도 SVG */}
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 600 400"
            className="absolute inset-0"
          >
            <defs>
              <pattern id="mapGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e2e8f0" strokeWidth="0.5" opacity="0.2"/>
              </pattern>
              
              <linearGradient id="riverGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#60a5fa" />
                <stop offset="50%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#1e40af" />
              </linearGradient>
              
              <linearGradient id="mountainGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#16a34a" />
                <stop offset="100%" stopColor="#15803d" />
              </linearGradient>
              
              <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                <feDropShadow dx="2" dy="2" stdDeviation="3" floodColor="#00000020"/>
              </filter>
            </defs>
            
            {/* 배경 */}
            <rect width="100%" height="100%" fill="#f8fafc" />
            <rect width="100%" height="100%" fill="url(#mapGrid)" />
            
            {/* 행정구역 경계 (간소화된 서울 외곽선) */}
            <path
              d="M 50 120 Q 80 80 150 90 Q 250 70 350 85 Q 450 95 520 110 Q 550 130 570 160 Q 580 200 570 250 Q 560 300 540 330 Q 500 360 450 370 Q 400 375 350 370 Q 300 365 250 355 Q 200 345 150 330 Q 100 310 70 280 Q 40 240 45 200 Q 48 160 50 120 Z"
              fill="#f1f5f9"
              stroke="#cbd5e1"
              strokeWidth="1"
              opacity="0.6"
            />
            
            {/* 한강 - 실제 흐름을 반영 */}
            <path
              d="M 80 220 Q 120 200 180 205 Q 240 210 300 215 Q 360 220 420 218 Q 480 216 520 225 Q 540 230 550 240"
              stroke="url(#riverGradient)"
              strokeWidth="12"
              fill="none"
              opacity="0.8"
            />
            
            {/* 지천들 */}
            <path d="M 200 180 Q 220 190 240 210" stroke="#60a5fa" strokeWidth="4" fill="none" opacity="0.6" />
            <path d="M 350 180 Q 370 200 380 220" stroke="#60a5fa" strokeWidth="4" fill="none" opacity="0.6" />
            <path d="M 450 200 Q 470 210 485 220" stroke="#60a5fa" strokeWidth="4" fill="none" opacity="0.6" />
            
            {/* 주요 산 */}
            {/* 북한산 */}
            <ellipse cx="200" cy="120" rx="40" ry="25" fill="url(#mountainGradient)" opacity="0.7" />
            <text x="175" y="100" className="text-xs fill-green-800 font-semibold">북한산</text>
            
            {/* 남산 */}
            <ellipse cx="300" cy="200" rx="20" ry="15" fill="url(#mountainGradient)" opacity="0.7" />
            <text x="315" y="205" className="text-xs fill-green-800 font-semibold">남산</text>
            
            {/* 관악산 */}
            <ellipse cx="280" cy="320" rx="30" ry="20" fill="url(#mountainGradient)" opacity="0.7" />
            <text x="250" y="340" className="text-xs fill-green-800 font-semibold">관악산</text>
            
            {/* 주요 지역 표시 */}
            {/* 강남 */}
            <rect x="350" y="280" width="80" height="30" fill="#e879f9" opacity="0.3" rx="5" />
            <text x="375" y="298" className="text-sm fill-purple-700 font-semibold">강 남</text>
            
            {/* 강북 */}
            <rect x="250" y="140" width="60" height="25" fill="#06b6d4" opacity="0.3" rx="5" />
            <text x="270" y="155" className="text-sm fill-cyan-700 font-semibold">강 북</text>
            
            {/* 여의도 */}
            <ellipse cx="220" cy="215" rx="25" ry="12" fill="#94a3b8" opacity="0.5" />
            <text x="200" y="200" className="text-xs fill-gray-700 font-semibold">여의도</text>
            
            {/* 잠실 */}
            <rect x="480" y="240" width="40" height="25" fill="#f59e0b" opacity="0.4" rx="5" />
            <text x="490" y="255" className="text-xs fill-orange-700 font-semibold">잠실</text>
            
            {/* 홍대 */}
            <circle cx="150" cy="180" r="15" fill="#ec4899" opacity="0.4" />
            <text x="125" y="200" className="text-xs fill-pink-700 font-semibold">홍대</text>
            
            {/* 광화문 */}
            <rect x="280" y="170" width="30" height="20" fill="#fbbf24" opacity="0.5" rx="3" />
            <text x="285" y="165" className="text-xs fill-yellow-700 font-semibold">광화문</text>

            {/* 코스 경로들 */}
            {filteredCourses.map((course, index) => {
              if (!course.routeCoordinates || course.routeCoordinates.length < 2) return null;
              
              const routeColor = routeColors[course.difficulty] || '#3B82F6';
              
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
                    strokeWidth="3"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity="0.8"
                    className="cursor-pointer hover:opacity-100 hover:stroke-width-4 transition-all"
                    filter="url(#shadow)"
                    onClick={() => onCourseSelect(course)}
                    onMouseEnter={() => setHoveredCourse(course)}
                    onMouseLeave={() => setHoveredCourse(null)}
                  />
                  
                  {/* 시작점 마커 */}
                  <g className="cursor-pointer" onClick={() => onCourseSelect(course)}>
                    {course.routeCoordinates.map((coord: number[], pointIndex: number) => {
                      if (pointIndex !== 0) return null; // 시작점만 표시
                      const point = coordToSVG(coord[0], coord[1]);
                      
                      return (
                        <g key={`start-${course.id}`}>
                          <circle
                            cx={point.x}
                            cy={point.y}
                            r="8"
                            fill="white"
                            stroke={routeColor}
                            strokeWidth="3"
                            className="hover:r-10 transition-all"
                            filter="url(#shadow)"
                          />
                          <circle
                            cx={point.x}
                            cy={point.y}
                            r="4"
                            fill={routeColor}
                          />
                          
                          {/* 거리 표시 */}
                          <text
                            x={point.x}
                            y={point.y - 15}
                            textAnchor="middle"
                            className="text-xs font-bold fill-gray-700"
                            style={{ textShadow: '1px 1px 2px white' }}
                          >
                            {course.distance}km
                          </text>
                        </g>
                      );
                    })}
                  </g>
                </g>
              );
            })}
            
            {/* 호버된 코스 정보 */}
            {hoveredCourse && (
              <g>
                <rect
                  x="20"
                  y="20"
                  width="220"
                  height="90"
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
                <text x="30" y="100" className="text-xs fill-blue-600">
                  💪 {hoveredCourse.difficulty} 코스
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
            <div className="text-xs font-semibold text-gray-700 mb-2">지도 범례</div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <div className="w-4 h-1 bg-blue-500 rounded opacity-80"></div>
                <span>한강</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <div className="w-3 h-3 bg-green-600 rounded-full opacity-70"></div>
                <span>산/공원</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <div className="w-3 h-3 bg-white border-2 border-blue-500 rounded-full"></div>
                <span>코스 시작점</span>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: routeColors['초급'] }}></div>
                  <span className="text-gray-600">초급 코스</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: routeColors['중급'] }}></div>
                  <span className="text-gray-600">중급 코스</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: routeColors['고급'] }}></div>
                  <span className="text-gray-600">고급 코스</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
