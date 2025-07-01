
import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MapPin, Navigation } from 'lucide-react';

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

    // 코스들을 마커로 표시
    courses.forEach((course) => {
      if (course.coordinates) {
        const marker = new (window as any).mapboxgl.Marker({
          color: '#3B82F6'
        })
        .setLngLat(course.coordinates)
        .setPopup(
          new (window as any).mapboxgl.Popup().setHTML(`
            <div class="p-2">
              <h3 class="font-semibold">${course.name}</h3>
              <p class="text-sm text-gray-600">${course.distance}km • ${course.difficulty}</p>
            </div>
          `)
        )
        .addTo(map.current);

        marker.getElement().addEventListener('click', () => {
          onCourseSelect(course);
        });
      }
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
          <MapPin className="w-5 h-5 text-blue-500" />
          코스 지도
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 h-[calc(100%-80px)]">
        {showTokenInput ? (
          <div className="flex flex-col items-center justify-center h-full p-6 space-y-4">
            <div className="text-center space-y-2">
              <Navigation className="w-12 h-12 text-blue-500 mx-auto" />
              <h3 className="text-lg font-semibold">Mapbox 토큰 입력</h3>
              <p className="text-sm text-gray-600">
                지도 기능을 사용하려면 Mapbox 공개 토큰이 필요합니다
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
                지도 로드
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
