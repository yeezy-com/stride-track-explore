
import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MapPin, Navigation, Route } from 'lucide-react';

export const CourseMap = ({ courses, onCourseSelect }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef(null);
  const [mapboxToken, setMapboxToken] = useState('');
  const [showTokenInput, setShowTokenInput] = useState(true);

  const initializeMap = (token: string) => {
    if (!mapContainer.current || !token) return;

    // Mapbox 토큰 설정
    (window as any).mapboxgl.accessToken = token;

    map.current = new (window as any).mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [126.9780, 37.5665], // 서울 중심
      zoom: 11
    });

    // 네비게이션 컨트롤 추가
    map.current.addControl(new (window as any).mapboxgl.NavigationControl());

    // 지도가 로드된 후 경로와 마커 추가
    map.current.on('load', () => {
      // 각 코스의 경로를 지도에 추가
      courses.forEach((course, index) => {
        if (course.routeCoordinates && course.routeCoordinates.length > 1) {
          // 경로 소스 추가
          map.current.addSource(`route-${course.id}`, {
            type: 'geojson',
            data: {
              type: 'Feature',
              properties: {
                courseId: course.id,
                courseName: course.name
              },
              geometry: {
                type: 'LineString',
                coordinates: course.routeCoordinates
              }
            }
          });

          // 경로 레이어 추가
          map.current.addLayer({
            id: `route-${course.id}`,
            type: 'line',
            source: `route-${course.id}`,
            layout: {
              'line-join': 'round',
              'line-cap': 'round'
            },
            paint: {
              'line-color': index % 2 === 0 ? '#3B82F6' : '#10B981',
              'line-width': 3,
              'line-opacity': 0.8
            }
          });

          // 경로 클릭 이벤트
          map.current.on('click', `route-${course.id}`, () => {
            onCourseSelect(course);
          });

          // 마우스 커서 변경
          map.current.on('mouseenter', `route-${course.id}`, () => {
            map.current.getCanvas().style.cursor = 'pointer';
          });

          map.current.on('mouseleave', `route-${course.id}`, () => {
            map.current.getCanvas().style.cursor = '';
          });
        }

        // 시작점 마커 추가
        if (course.coordinates) {
          const marker = new (window as any).mapboxgl.Marker({
            color: '#EF4444'
          })
          .setLngLat(course.coordinates)
          .setPopup(
            new (window as any).mapboxgl.Popup().setHTML(`
              <div class="p-3">
                <h3 class="font-semibold text-sm">${course.name}</h3>
                <p class="text-xs text-gray-600 mt-1">${course.distance}km • ${course.difficulty}</p>
                <div class="flex items-center gap-2 mt-2 text-xs">
                  <span class="text-red-500">❤ ${course.likes}</span>
                  <span class="text-blue-500">👥 ${course.completedCount}</span>
                </div>
              </div>
            `)
          )
          .addTo(map.current);

          marker.getElement().addEventListener('click', () => {
            onCourseSelect(course);
          });
        }
      });
    });
  };

  const handleTokenSubmit = () => {
    if (mapboxToken.trim()) {
      setShowTokenInput(false);
      // Mapbox GL JS 동적 로드
      const script = document.createElement('script');
      script.src = 'https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.js';
      script.onload = () => {
        const link = document.createElement('link');
        link.href = 'https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.css';
        link.rel = 'stylesheet';
        document.head.appendChild(link);
        
        setTimeout(() => initializeMap(mapboxToken), 100);
      };
      document.head.appendChild(script);
    }
  };

  return (
    <Card className="h-[600px]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Route className="w-5 h-5 text-blue-500" />
          코스 경로 지도
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 h-[calc(100%-80px)]">
        {showTokenInput ? (
          <div className="flex flex-col items-center justify-center h-full p-6 space-y-4">
            <div className="text-center space-y-2">
              <Navigation className="w-12 h-12 text-blue-500 mx-auto" />
              <h3 className="text-lg font-semibold">Mapbox 토큰 입력</h3>
              <p className="text-sm text-gray-600">
                러닝 코스 경로를 지도에 표시하려면 Mapbox 공개 토큰이 필요합니다
              </p>
              <a 
                href="https://mapbox.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline text-sm"
              >
                Mapbox에서 토큰 받기 →
              </a>
            </div>
            <div className="w-full max-w-sm space-y-2">
              <Input
                type="text"
                placeholder="pk.eyJ1..."
                value={mapboxToken}
                onChange={(e) => setMapboxToken(e.target.value)}
                className="text-center"
              />
              <Button 
                onClick={handleTokenSubmit}
                className="w-full"
                disabled={!mapboxToken.trim()}
              >
                경로 지도 로드
              </Button>
            </div>
          </div>
        ) : (
          <div ref={mapContainer} className="w-full h-full rounded-lg" />
        )}
      </CardContent>
    </Card>
  );
};
