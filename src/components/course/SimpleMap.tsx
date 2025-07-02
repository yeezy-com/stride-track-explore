
import React from 'react';
import { MapPin } from 'lucide-react';

interface SimpleMapProps {
  courses: any[];
  onCourseSelect: (course: any) => void;
}

export const SimpleMap: React.FC<SimpleMapProps> = ({ courses, onCourseSelect }) => {
  // Convert coordinates to SVG coordinates
  const convertToSVG = (lng: number, lat: number) => {
    // Simple conversion for Seoul area (rough approximation)
    const baseX = 200;
    const baseY = 200;
    const scaleX = 2000;
    const scaleY = 2000;
    
    const x = (lng - 126.9) * scaleX + baseX;
    const y = (37.6 - lat) * scaleY + baseY;
    
    return { x: Math.max(50, Math.min(550, x)), y: Math.max(50, Math.min(350, y)) };
  };

  const colors = ['#3B82F6', '#10B981', '#EF4444', '#F59E0B', '#8B5CF6'];

  return (
    <div className="w-full h-full bg-slate-50 rounded-lg overflow-hidden">
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 600 400"
        className="border border-gray-200"
      >
        {/* Background grid */}
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e5e7eb" strokeWidth="0.5"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
        
        {/* Seoul landmarks (simplified) */}
        <circle cx="300" cy="200" r="3" fill="#6B7280" />
        <text x="305" y="205" className="text-xs fill-gray-600">서울시청</text>
        
        <rect x="280" y="180" width="40" height="20" fill="#E5E7EB" stroke="#9CA3AF" />
        <text x="285" y="193" className="text-xs fill-gray-600">한강</text>
        
        {/* Course routes */}
        {courses.map((course, index) => {
          if (!course.routeCoordinates || course.routeCoordinates.length < 2) return null;
          
          const pathData = course.routeCoordinates
            .map((coord: number[], i: number) => {
              const point = convertToSVG(coord[0], coord[1]);
              return `${i === 0 ? 'M' : 'L'} ${point.x} ${point.y}`;
            })
            .join(' ');

          return (
            <g key={course.id}>
              {/* Route path */}
              <path
                d={pathData}
                stroke={colors[index % colors.length]}
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="cursor-pointer hover:stroke-width-4 transition-all"
                onClick={() => onCourseSelect(course)}
              />
              
              {/* Route points */}
              {course.routeCoordinates.map((coord: number[], pointIndex: number) => {
                const point = convertToSVG(coord[0], coord[1]);
                return (
                  <circle
                    key={`${course.id}-${pointIndex}`}
                    cx={point.x}
                    cy={point.y}
                    r="2"
                    fill={colors[index % colors.length]}
                    className="cursor-pointer"
                    onClick={() => onCourseSelect(course)}
                  />
                );
              })}
            </g>
          );
        })}

        {/* Course markers */}
        {courses.map((course, index) => {
          if (!course.coordinates) return null;
          
          const point = convertToSVG(course.coordinates[0], course.coordinates[1]);
          
          return (
            <g key={`marker-${course.id}`}>
              {/* Marker background */}
              <circle
                cx={point.x}
                cy={point.y}
                r="12"
                fill="white"
                stroke={colors[index % colors.length]}
                strokeWidth="2"
                className="cursor-pointer hover:r-14 transition-all"
                onClick={() => onCourseSelect(course)}
              />
              
              {/* Marker icon */}
              <circle
                cx={point.x}
                cy={point.y}
                r="4"
                fill={colors[index % colors.length]}
                className="cursor-pointer"
                onClick={() => onCourseSelect(course)}
              />
              
              {/* Course info on hover */}
              <g className="opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
                <rect
                  x={point.x + 15}
                  y={point.y - 25}
                  width="120"
                  height="50"
                  fill="white"
                  stroke="#d1d5db"
                  rx="4"
                />
                <text x={point.x + 20} y={point.y - 10} className="text-xs font-semibold fill-gray-800">
                  {course.name}
                </text>
                <text x={point.x + 20} y={point.y + 2} className="text-xs fill-gray-600">
                  {course.distance}km • {course.difficulty}
                </text>
                <text x={point.x + 20} y={point.y + 14} className="text-xs fill-red-500">
                  ❤ {course.likes} • 👥 {course.completedCount}
                </text>
              </g>
            </g>
          );
        })}
      </svg>
      
      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-md">
        <div className="text-xs font-semibold text-gray-700 mb-2">범례</div>
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <div className="w-3 h-0.5 bg-blue-500"></div>
            <span>러닝 코스</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <div className="w-3 h-3 bg-white border-2 border-blue-500 rounded-full"></div>
            <span>시작점</span>
          </div>
        </div>
      </div>
    </div>
  );
};
