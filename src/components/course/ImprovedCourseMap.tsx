
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Navigation, Heart, Users } from 'lucide-react';

interface ImprovedCourseMapProps {
  courses: any[];
  onCourseSelect: (course: any) => void;
}

export const ImprovedCourseMap: React.FC<ImprovedCourseMapProps> = ({ courses, onCourseSelect }) => {
  // 서울 지역 가상 좌표 변환
  const convertToMapCoords = (lng: number, lat: number, index: number) => {
    // 서울 중심부 기준으로 가상 좌표 생성
    const baseX = 300;
    const baseY = 200;
    const spread = 150;
    
    // 코스 인덱스를 기반으로 원형으로 배치
    const angle = (index * 2 * Math.PI) / Math.max(courses.length, 1);
    const radius = 80 + (index % 3) * 30;
    
    const x = baseX + Math.cos(angle) * radius;
    const y = baseY + Math.sin(angle) * radius;
    
    return { 
      x: Math.max(50, Math.min(550, x)), 
      y: Math.max(50, Math.min(350, y)) 
    };
  };

  const colors = ['#3B82F6', '#10B981', '#EF4444', '#F59E0B', '#8B5CF6', '#EC4899'];

  return (
    <Card className="h-[500px] overflow-hidden rounded-3xl shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Navigation className="w-5 h-5 text-blue-500" />
          코스 지도
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 h-[calc(100%-80px)] relative">
        <div className="w-full h-full bg-gradient-to-br from-blue-50 to-green-50 relative overflow-hidden">
          {/* 지도 배경 SVG */}
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 600 400"
            className="absolute inset-0"
          >
            {/* 배경 그리드 */}
            <defs>
              <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
                <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#e0e7ff" strokeWidth="1" opacity="0.3"/>
              </pattern>
              
              {/* 그라디언트 정의 */}
              <linearGradient id="mapGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#dbeafe" />
                <stop offset="100%" stopColor="#dcfce7" />
              </linearGradient>
              
              {/* 강 패턴 */}
              <linearGradient id="riverGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#93c5fd" />
                <stop offset="50%" stopColor="#60a5fa" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
            </defs>
            
            <rect width="100%" height="100%" fill="url(#mapGradient)" />
            <rect width="100%" height="100%" fill="url(#grid)" />
            
            {/* 한강 표현 */}
            <path
              d="M 50 250 Q 200 230 350 250 Q 450 270 550 250"
              stroke="url(#riverGradient)"
              strokeWidth="20"
              fill="none"
              opacity="0.7"
            />
            
            {/* 주요 랜드마크 */}
            <g>
              {/* 남산타워 */}
              <circle cx="300" cy="180" r="6" fill="#ef4444" />
              <rect x="298" y="160" width="4" height="20" fill="#dc2626" />
              <text x="310" y="185" className="text-xs fill-gray-700 font-medium">남산타워</text>
              
              {/* 한강공원 */}
              <rect x="180" y="240" width="240" height="20" fill="#22c55e" opacity="0.6" rx="10" />
              <text x="190" y="253" className="text-xs fill-green-700 font-medium">한강공원</text>
              
              {/* 올림픽공원 */}
              <circle cx="450" cy="150" r="25" fill="#16a34a" opacity="0.4" />
              <text x="425" y="140" className="text-xs fill-green-700 font-medium">올림픽공원</text>
            </g>

            {/* 코스 경로들 */}
            {courses.map((course, index) => {
              const startPoint = convertToMapCoords(126.9, 37.5, index);
              const endPoint = convertToMapCoords(127.0, 37.6, index + courses.length);
              const midPoint = {
                x: (startPoint.x + endPoint.x) / 2 + (Math.random() - 0.5) * 50,
                y: (startPoint.y + endPoint.y) / 2 + (Math.random() - 0.5) * 50
              };

              const pathData = `M ${startPoint.x} ${startPoint.y} Q ${midPoint.x} ${midPoint.y} ${endPoint.x} ${endPoint.y}`;

              return (
                <g key={course.id}>
                  {/* 코스 경로 */}
                  <path
                    d={pathData}
                    stroke={colors[index % colors.length]}
                    strokeWidth="4"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray="8,4"
                    className="cursor-pointer hover:stroke-width-6 transition-all opacity-80 hover:opacity-100"
                    onClick={() => onCourseSelect(course)}
                  />
                  
                  {/* 시작점 마커 */}
                  <g className="cursor-pointer" onClick={() => onCourseSelect(course)}>
                    <circle
                      cx={startPoint.x}
                      cy={startPoint.y}
                      r="12"
                      fill="white"
                      stroke={colors[index % colors.length]}
                      strokeWidth="3"
                      className="hover:r-14 transition-all drop-shadow-lg"
                    />
                    <circle
                      cx={startPoint.x}
                      cy={startPoint.y}
                      r="6"
                      fill={colors[index % colors.length]}
                    />
                  </g>
                  
                  {/* 종료점 마커 */}
                  <g className="cursor-pointer" onClick={() => onCourseSelect(course)}>
                    <rect
                      x={endPoint.x - 8}
                      y={endPoint.y - 8}
                      width="16"
                      height="16"
                      fill="white"
                      stroke={colors[index % colors.length]}
                      strokeWidth="3"
                      rx="2"
                      className="hover:scale-110 transition-all drop-shadow-lg"
                    />
                    <rect
                      x={endPoint.x - 4}
                      y={endPoint.y - 4}
                      width="8"
                      height="8"
                      fill={colors[index % colors.length]}
                      rx="1"
                    />
                  </g>
                </g>
              );
            })}
          </svg>
          
          {/* 코스 정보 오버레이 */}
          <div className="absolute top-4 left-4 space-y-2 max-h-[300px] overflow-y-auto">
            {courses.slice(0, 4).map((course, index) => (
              <div
                key={course.id}
                className="bg-white/90 backdrop-blur-sm rounded-2xl p-3 shadow-lg cursor-pointer hover:bg-white transition-all max-w-[200px]"
                onClick={() => onCourseSelect(course)}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: colors[index % colors.length] }}
                  />
                  <h4 className="font-semibold text-sm text-gray-800 truncate">
                    {course.name}
                  </h4>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-xs text-gray-600">
                    <MapPin className="w-3 h-3" />
                    <span className="truncate">{course.location}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-blue-600">{course.distance}km</span>
                    <Badge variant="outline" className="text-xs px-1 py-0">
                      {course.difficulty}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Heart className="w-3 h-3" />
                      {course.likes}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {course.completedCount}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            
            {courses.length > 4 && (
              <div className="bg-white/80 rounded-2xl p-2 text-center">
                <span className="text-xs text-gray-600">
                  +{courses.length - 4}개 더보기
                </span>
              </div>
            )}
          </div>
          
          {/* 범례 */}
          <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-2xl shadow-lg">
            <div className="text-xs font-semibold text-gray-700 mb-2">범례</div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <div className="w-4 h-1 bg-blue-500 rounded opacity-80"></div>
                <span>러닝 코스</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <div className="w-3 h-3 bg-white border-2 border-blue-500 rounded-full"></div>
                <span>시작점</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <div className="w-3 h-3 bg-white border-2 border-blue-500 rounded"></div>
                <span>도착점</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
