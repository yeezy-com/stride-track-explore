
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Navigation, Heart, Users, Play, Target, Filter, Locate } from 'lucide-react';

interface ImprovedCourseMapProps {
  courses: any[];
  onCourseSelect: (course: any) => void;
}

export const ImprovedCourseMap: React.FC<ImprovedCourseMapProps> = ({ courses, onCourseSelect }) => {
  const [hoveredCourse, setHoveredCourse] = useState<any>(null);
  const [selectedRouteType, setSelectedRouteType] = useState('전체');
  const [nearbyMode, setNearbyMode] = useState(false);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);

  // 실제 서울 좌표를 SVG 좌표로 변환하는 함수
  const coordToSVG = (lng: number, lat: number) => {
    // 서울 경계를 반영한 좌표 변환
    const minLng = 126.734, maxLng = 127.270;
    const minLat = 37.428, maxLat = 37.701;
    
    const x = ((lng - minLng) / (maxLng - minLng)) * 760 + 20;
    const y = ((maxLat - lat) / (maxLat - minLat)) * 500 + 20;
    
    return { x: Math.max(20, Math.min(780, x)), y: Math.max(20, Math.min(520, y)) };
  };

  const routeColors = {
    '초급': '#6B7280',
    '중급': '#4B5563', 
    '고급': '#374151'
  };

  // 내 주변 코스 찾기
  const getNearbyPlaceholder = () => {
    if (!navigator.geolocation) {
      return [];
    }
    
    return courses.slice(0, 6); // 임시로 처음 6개 코스 반환
  };

  const handleNearbyToggle = () => {
    if (!nearbyMode && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setNearbyMode(true);
        },
        (error) => {
          console.error('위치 정보를 가져올 수 없습니다:', error);
        }
      );
    } else {
      setNearbyMode(!nearbyMode);
    }
  };

  const filteredCourses = nearbyMode 
    ? getNearbyPlaceholder()
    : selectedRouteType === '전체' 
      ? courses 
      : courses.filter(course => course.difficulty === selectedRouteType);

  return (
    <Card className="h-[800px] overflow-hidden rounded-3xl shadow-xl bg-white border border-gray-300">
      <CardHeader className="pb-4 bg-gray-100">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg font-bold text-gray-900">
            <Navigation className="w-5 h-5 text-gray-800" />
            서울 러닝 코스 지도
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant={nearbyMode ? "default" : "outline"}
              size="sm"
              onClick={handleNearbyToggle}
              className="flex items-center gap-2 bg-gray-800 text-white hover:bg-gray-700 border-gray-600"
            >
              <Locate className="w-4 h-4" />
              내 주변
            </Button>
            <Filter className="w-4 h-4 text-gray-600" />
            <div className="flex gap-1">
              {['전체', '초급', '중급', '고급'].map((type) => (
                <Button
                  key={type}
                  variant={selectedRouteType === type ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedRouteType(type)}
                  className={`text-xs rounded-full px-3 py-1 h-7 ${
                    selectedRouteType === type 
                      ? 'bg-gray-800 text-white' 
                      : 'bg-white text-gray-800 border-gray-400 hover:bg-gray-100'
                  }`}
                  disabled={nearbyMode}
                >
                  {type}
                </Button>
              ))}
            </div>
          </div>
        </div>
        <div className="text-sm text-gray-700">
          {nearbyMode ? '내 주변 코스' : `${filteredCourses.length}개의 코스`}가 있습니다
        </div>
      </CardHeader>
      
      <CardContent className="p-0 h-[calc(100%-140px)] relative">
        <div className="w-full h-full bg-gray-50 relative overflow-hidden">
          {/* 실제 서울 지도 SVG */}
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 800 540"
            className="absolute inset-0"
          >
            <defs>
              <pattern id="mapGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e5e7eb" strokeWidth="0.5" opacity="0.3"/>
              </pattern>
              
              <linearGradient id="riverGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#9ca3af" />
                <stop offset="50%" stopColor="#6b7280" />
                <stop offset="100%" stopColor="#4b5563" />
              </linearGradient>
              
              <linearGradient id="mountainGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6b7280" />
                <stop offset="100%" stopColor="#4b5563" />
              </linearGradient>
              
              <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                <feDropShadow dx="2" dy="2" stdDeviation="3" floodColor="#00000020"/>
              </filter>
            </defs>
            
            {/* 배경 */}
            <rect width="100%" height="100%" fill="#f9fafb" />
            <rect width="100%" height="100%" fill="url(#mapGrid)" />
            
            {/* 행정구역 경계 (간소화된 서울 외곽선) */}
            <path
              d="M 70 160 Q 110 110 200 120 Q 330 90 460 110 Q 590 125 680 140 Q 720 170 740 210 Q 750 260 740 320 Q 730 380 710 420 Q 650 460 580 470 Q 520 475 460 470 Q 400 465 330 450 Q 260 435 200 415 Q 140 390 100 350 Q 60 300 65 250 Q 68 200 70 160 Z"
              fill="#f3f4f6"
              stroke="#d1d5db"
              strokeWidth="1"
              opacity="0.8"
            />
            
            {/* 한강 - 실제 흐름을 반영 */}
            <path
              d="M 110 280 Q 160 250 240 255 Q 320 260 400 265 Q 480 270 560 268 Q 640 266 680 280 Q 700 290 720 300"
              stroke="url(#riverGradient)"
              strokeWidth="16"
              fill="none"
              opacity="0.9"
            />
            
            {/* 지천들 */}
            <path d="M 270 230 Q 300 240 320 260" stroke="#9ca3af" strokeWidth="6" fill="none" opacity="0.7" />
            <path d="M 460 230 Q 490 250 500 270" stroke="#9ca3af" strokeWidth="6" fill="none" opacity="0.7" />
            <path d="M 590 250 Q 620 260 635 275" stroke="#9ca3af" strokeWidth="6" fill="none" opacity="0.7" />
            
            {/* 주요 산 */}
            {/* 북한산 */}
            <ellipse cx="270" cy="160" rx="50" ry="30" fill="url(#mountainGradient)" opacity="0.8" />
            <text x="235" y="135" className="text-sm fill-gray-800 font-semibold">북한산</text>
            
            {/* 남산 */}
            <ellipse cx="400" cy="250" rx="25" ry="18" fill="url(#mountainGradient)" opacity="0.8" />
            <text x="420" y="255" className="text-sm fill-gray-800 font-semibold">남산</text>
            
            {/* 관악산 */}
            <ellipse cx="370" cy="400" rx="40" ry="25" fill="url(#mountainGradient)" opacity="0.8" />
            <text x="330" y="425" className="text-sm fill-gray-800 font-semibold">관악산</text>
            
            {/* 주요 지역 표시 */}
            {/* 강남 */}
            <rect x="460" y="350" width="100" height="35" fill="#6b7280" opacity="0.4" rx="5" />
            <text x="495" y="372" className="text-base fill-gray-800 font-semibold">강 남</text>
            
            {/* 강북 */}
            <rect x="330" y="180" width="75" height="30" fill="#6b7280" opacity="0.4" rx="5" />
            <text x="355" y="198" className="text-base fill-gray-800 font-semibold">강 북</text>
            
            {/* 여의도 */}
            <ellipse cx="290" cy="265" rx="30" ry="15" fill="#9ca3af" opacity="0.6" />
            <text x="265" y="250" className="text-sm fill-gray-700 font-semibold">여의도</text>
            
            {/* 잠실 */}
            <rect x="630" y="300" width="50" height="30" fill="#6b7280" opacity="0.5" rx="5" />
            <text x="645" y="318" className="text-sm fill-gray-800 font-semibold">잠실</text>
            
            {/* 홍대 */}
            <circle cx="200" cy="230" r="18" fill="#6b7280" opacity="0.5" />
            <text x="165" y="255" className="text-sm fill-gray-700 font-semibold">홍대</text>
            
            {/* 광화문 */}
            <rect x="370" cy="215" width="35" height="25" fill="#9ca3af" opacity="0.6" rx="3" />
            <text x="375" y="205" className="text-sm fill-gray-700 font-semibold">광화문</text>

            {/* 사용자 위치 표시 */}
            {nearbyMode && userLocation && (
              <g>
                <circle
                  cx="400"
                  cy="270"
                  r="12"
                  fill="#374151"
                  stroke="white"
                  strokeWidth="3"
                  className="animate-pulse"
                />
                <circle
                  cx="400"
                  cy="270"
                  r="25"
                  fill="none"
                  stroke="#374151"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                  opacity="0.5"
                />
                <text x="420" y="275" className="text-xs fill-gray-800 font-semibold">현재 위치</text>
              </g>
            )}

            {/* 코스 경로들 */}
            {filteredCourses.map((course, index) => {
              if (!course.routeCoordinates || course.routeCoordinates.length < 2) return null;
              
              const routeColor = routeColors[course.difficulty] || '#6B7280';
              
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
                    opacity="0.9"
                    className="cursor-pointer hover:opacity-100 hover:stroke-width-5 transition-all"
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
                            r="10"
                            fill="white"
                            stroke={routeColor}
                            strokeWidth="3"
                            className="hover:r-12 transition-all"
                            filter="url(#shadow)"
                          />
                          <circle
                            cx={point.x}
                            cy={point.y}
                            r="5"
                            fill={routeColor}
                          />
                          
                          {/* 거리 표시 */}
                          <text
                            x={point.x}
                            y={point.y - 18}
                            textAnchor="middle"
                            className="text-sm font-bold fill-gray-800"
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
                  x="30"
                  y="30"
                  width="280"
                  height="110"
                  fill="white"
                  stroke="#d1d5db"
                  strokeWidth="2"
                  rx="8"
                  filter="url(#shadow)"
                />
                <text x="45" y="55" className="text-base font-bold fill-gray-900">
                  {hoveredCourse.name}
                </text>
                <text x="45" y="75" className="text-sm fill-gray-700">
                  📍 {hoveredCourse.location}
                </text>
                <text x="45" y="95" className="text-sm fill-gray-700">
                  🏃 {hoveredCourse.distance}km • {hoveredCourse.estimatedTime}
                </text>
                <text x="45" y="115" className="text-sm fill-gray-700">
                  ❤️ {hoveredCourse.likes} • 👥 {hoveredCourse.completedCount}
                </text>
                <text x="45" y="135" className="text-sm fill-gray-600">
                  💪 {hoveredCourse.difficulty} 코스
                </text>
              </g>
            )}
          </svg>
          
          {/* 우측 코스 목록 */}
          <div className="absolute top-4 right-4 w-72 max-h-[calc(100%-2rem)] overflow-y-auto space-y-3">
            {filteredCourses.slice(0, 6).map((course, index) => (
              <div
                key={course.id}
                className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-lg cursor-pointer hover:bg-white hover:shadow-xl transition-all border border-gray-200"
                onClick={() => onCourseSelect(course)}
                onMouseEnter={() => setHoveredCourse(course)}
                onMouseLeave={() => setHoveredCourse(null)}
              >
                <div className="flex items-center gap-2 mb-3">
                  <div 
                    className="w-4 h-4 rounded-full flex-shrink-0" 
                    style={{ backgroundColor: routeColors[course.difficulty] }}
                  />
                  <h4 className="font-semibold text-sm text-gray-900 truncate">
                    {course.name}
                  </h4>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-1 text-sm text-gray-700">
                    <MapPin className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{course.location}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-gray-800">{course.distance}km</span>
                    <Badge 
                      variant="outline" 
                      className="text-xs px-2 py-0 border-gray-400 text-gray-700"
                    >
                      {course.difficulty}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-3 text-gray-600">
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
                      className="h-7 px-3 text-xs rounded-full bg-gray-800 hover:bg-gray-700 text-white"
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
              <div className="bg-white/90 rounded-2xl p-3 text-center border border-gray-200">
                <span className="text-sm text-gray-700">
                  +{filteredCourses.length - 6}개 더보기
                </span>
              </div>
            )}
          </div>
          
          {/* 범례 */}
          <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm p-4 rounded-2xl shadow-lg border border-gray-200">
            <div className="text-sm font-semibold text-gray-900 mb-3">지도 범례</div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <div className="w-5 h-1 bg-gray-600 rounded opacity-90"></div>
                <span>한강</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <div className="w-4 h-4 bg-gray-600 rounded-full opacity-80"></div>
                <span>산/공원</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <div className="w-4 h-4 bg-white border-2 border-gray-600 rounded-full"></div>
                <span>코스 시작점</span>
              </div>
              {nearbyMode && (
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <div className="w-4 h-4 bg-gray-800 rounded-full"></div>
                  <span>현재 위치</span>
                </div>
              )}
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: routeColors['초급'] }}></div>
                  <span className="text-gray-700">초급 코스</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: routeColors['중급'] }}></div>
                  <span className="text-gray-700">중급 코스</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: routeColors['고급'] }}></div>
                  <span className="text-gray-700">고급 코스</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
