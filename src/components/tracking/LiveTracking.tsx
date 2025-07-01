
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, Square, MapPin, Clock, Activity, Target } from 'lucide-react';
import { RunningStats } from './RunningStats';
import { LiveMap } from './LiveMap';

export const LiveTracking = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [distance, setDistance] = useState(0);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [route, setRoute] = useState([]);

  useEffect(() => {
    let interval;
    if (isRunning && !isPaused && startTime) {
      interval = setInterval(() => {
        setElapsedTime(Date.now() - startTime);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, isPaused, startTime]);

  useEffect(() => {
    if (isRunning && !isPaused) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const newLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            timestamp: Date.now()
          };
          
          setCurrentLocation(newLocation);
          setRoute(prev => {
            const newRoute = [...prev, newLocation];
            // 거리 계산 (간단한 직선 거리)
            if (prev.length > 0) {
              const lastPoint = prev[prev.length - 1];
              const dist = calculateDistance(
                lastPoint.latitude, lastPoint.longitude,
                newLocation.latitude, newLocation.longitude
              );
              setDistance(prevDistance => prevDistance + dist);
            }
            return newRoute;
          });
        },
        (error) => {
          console.error('위치 추적 오류:', error);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );

      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, [isRunning, isPaused]);

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // 지구 반지름 (km)
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const formatTime = (ms) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    return `${hours.toString().padStart(2, '0')}:${(minutes % 60).toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`;
  };

  const startRunning = () => {
    setIsRunning(true);
    setIsPaused(false);
    setStartTime(Date.now());
    setElapsedTime(0);
    setDistance(0);
    setRoute([]);
  };

  const pauseRunning = () => {
    setIsPaused(!isPaused);
  };

  const stopRunning = () => {
    setIsRunning(false);
    setIsPaused(false);
    setStartTime(null);
    // 여기서 러닝 데이터를 저장할 수 있습니다
  };

  const averagePace = distance > 0 ? (elapsedTime / 1000 / 60) / distance : 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="space-y-6">
        <Card className="bg-gradient-to-br from-blue-50 to-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-500" />
              실시간 러닝 추적
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {formatTime(elapsedTime)}
                </div>
                <div className="text-sm text-gray-600 flex items-center justify-center gap-1">
                  <Clock className="w-4 h-4" />
                  시간
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {distance.toFixed(2)}km
                </div>
                <div className="text-sm text-gray-600 flex items-center justify-center gap-1">
                  <MapPin className="w-4 h-4" />
                  거리
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {averagePace.toFixed(1)}
                </div>
                <div className="text-sm text-gray-600 flex items-center justify-center gap-1">
                  <Target className="w-4 h-4" />
                  평균 페이스
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3">
              {!isRunning ? (
                <Button 
                  onClick={startRunning}
                  className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 px-8"
                >
                  <Play className="w-4 h-4 mr-2" />
                  러닝 시작
                </Button>
              ) : (
                <>
                  <Button 
                    onClick={pauseRunning}
                    variant="outline"
                    className="px-6"
                  >
                    {isPaused ? <Play className="w-4 h-4 mr-2" /> : <Pause className="w-4 h-4 mr-2" />}
                    {isPaused ? '재개' : '일시정지'}
                  </Button>
                  <Button 
                    onClick={stopRunning}
                    variant="destructive"
                    className="px-6"
                  >
                    <Square className="w-4 h-4 mr-2" />
                    종료
                  </Button>
                </>
              )}
            </div>

            {isRunning && (
              <div className="text-center">
                <Badge variant={isPaused ? "secondary" : "default"} className="text-sm">
                  {isPaused ? "일시정지됨" : "러닝 중"}
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>

        <RunningStats 
          elapsedTime={elapsedTime}
          distance={distance}
          route={route}
          isRunning={isRunning}
        />
      </div>

      <div className="lg:sticky lg:top-24">
        <LiveMap 
          currentLocation={currentLocation}
          route={route}
          isRunning={isRunning}
        />
      </div>
    </div>
  );
};
