
import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MapPin, Navigation, Activity, Target } from 'lucide-react';

export const LiveMap = ({ currentLocation, route, isRunning, selectedCourse }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef(null);
  const [mapboxToken, setMapboxToken] = useState('');
  const [showTokenInput, setShowTokenInput] = useState(true);
  const [userMarker, setUserMarker] = useState(null);

  const initializeMap = (token: string) => {
    if (!mapContainer.current || !token) return;

    (window as any).mapboxgl.accessToken = token;

    map.current = new (window as any).mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [126.9780, 37.5665],
      zoom: 15
    });

    map.current.addControl(new (window as any).mapboxgl.NavigationControl());

    // 지도가 로드된 후 실행
    map.current.on('load', () => {
      // 경로를 그리기 위한 소스 추가
      map.current.addSource('route', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: []
          }
        }
      });

      // 경로 라인 스타일 추가
      map.current.addLayer({
        id: 'route',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#3B82F6',
          'line-width': 4,
          'line-opacity': 0.8
        }
      });

      // 선택된 코스 경로 추가
      if (selectedCourse && selectedCourse.routeCoordinates) {
        map.current.addSource('course-route', {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: selectedCourse.routeCoordinates
            }
          }
        });

        map.current.addLayer({
          id: 'course-route',
          type: 'line',
          source: 'course-route',
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': '#10B981',
            'line-width': 6,
            'line-opacity': 0.6,
            'line-dasharray': [2, 2]
          }
        });
      }
    });
  };

  // 선택된 코스 경로 업데이트
  useEffect(() => {
    if (map.current && selectedCourse && selectedCourse.routeCoordinates) {
      if (map.current.getSource('course-route')) {
        map.current.getSource('course-route').setData({
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: selectedCourse.routeCoordinates
          }
        });
      }
    }
  }, [selectedCourse]);

  // 현재 위치 업데이트
  useEffect(() => {
    if (map.current && currentLocation) {
      const lngLat = [currentLocation.longitude, currentLocation.latitude];
      
      if (userMarker) {
        userMarker.setLngLat(lngLat);
      } else {
        const marker = new (window as any).mapboxgl.Marker({
          color: '#EF4444',
          scale: 1.2
        })
        .setLngLat(lngLat)
        .addTo(map.current);
        setUserMarker(marker);
      }

      // 지도 중심을 현재 위치로 이동
      map.current.easeTo({
        center: lngLat,
        duration: 1000
      });
    }
  }, [currentLocation, userMarker]);

  // 경로 업데이트
  useEffect(() => {
    if (map.current && route.length > 1) {
      const coordinates = route.map(point => [point.longitude, point.latitude]);
      
      map.current.getSource('route')?.setData({
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: coordinates
        }
      });
    }
  }, [route]);

  const handleTokenSubmit = () => {
    if (mapboxToken.trim()) {
      setShowTokenInput(false);
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
          <Navigation className="w-5 h-5 text-blue-500" />
          실시간 추적 지도
          {isRunning && (
            <div className="ml-auto flex items-center gap-1 text-sm text-green-600">
              <Activity className="w-4 h-4 animate-pulse" />
              추적 중
            </div>
          )}
          {selectedCourse && (
            <div className="ml-auto flex items-center gap-1 text-sm text-blue-600">
              <Target className="w-4 h-4" />
              코스 경로
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 h-[calc(100%-80px)]">
        {showTokenInput ? (
          <div className="flex flex-col items-center justify-center h-full p-6 space-y-4">
            <div className="text-center space-y-2">
              <MapPin className="w-12 h-12 text-blue-500 mx-auto" />
              <h3 className="text-lg font-semibold">실시간 추적을 위한 지도 설정</h3>
              <p className="text-sm text-gray-600">
                GPS 추적과 경로 표시를 위해 Mapbox 토큰이 필요합니다
              </p>
              {selectedCourse && (
                <p className="text-sm text-blue-600 font-medium">
                  선택된 코스: {selectedCourse.name}
                </p>
              )}
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
                className="w-full bg-gradient-to-r from-blue-500 to-green-500"
                disabled={!mapboxToken.trim()}
              >
                실시간 추적 시작
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
