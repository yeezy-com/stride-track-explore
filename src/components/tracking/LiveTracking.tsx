
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, Square, MapPin, Clock, Activity, Target, CheckCircle, AlertCircle } from 'lucide-react';
import { RunningStats } from './RunningStats';
import { LiveMap } from './LiveMap';
import { useToast } from '@/hooks/use-toast';

export const LiveTracking = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [distance, setDistance] = useState(0);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [route, setRoute] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [trackingStatus, setTrackingStatus] = useState('on-track'); // 'on-track', 'off-track', 'completed'
  const { toast } = useToast();

  // 코스 선택 이벤트 리스너
  useEffect(() => {
    const handleStartRunning = (event) => {
      const course = event.detail;
      setSelectedCourse(course);
      toast({
        title: "코스 선택됨",
        description: `${course.name} 코스가 선택되었습니다. 러닝을 시작해보세요!`,
      });
    };

    window.addEventListener('startRunningWithCourse', handleStartRunning);
    return () => window.removeEventListener('startRunningWithCourse', handleStartRunning);
  }, [toast]);

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

            // 코스 트랙 추적 확인
            if (selectedCourse && selectedCourse.routeCoordinates) {
              checkTrackingStatus(newLocation, selectedCourse.routeCoordinates);
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
  }, [isRunning, isPaused, selectedCourse]);

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

  const checkTrackingStatus = (currentLocation, courseRoute) => {
    // 현재 위치와 코스 경로의 가장 가까운 점 사이의 거리 확인
    let minDistance = Infinity;
    courseRoute.forEach(point => {
      const dist = calculateDistance(
        currentLocation.latitude, currentLocation.longitude,
        point[1], point[0]
      );
      minDistance = Math.min(minDistance, dist);
    });

    // 50미터 이내면 올바른 경로, 그 이상이면 벗어남
    if (minDistance <= 0.05) { // 0.05km = 50m
      if (trackingStatus !== 'on-track') {
        setTrackingStatus('on-track');
        toast({
          title: "경로 복귀",
          description: "코스 경로로 돌아왔습니다!",
        });
      }
    } else {
      if (trackingStatus !== 'off-track') {
        setTrackingStatus('off-track');
        toast({
          title: "경로 이탈",
          description: "코스 경로에서 벗어났습니다. 경로를 확인해주세요.",
        });
      }
    }

    // 목표 거리 달성 확인
    if (selectedCourse && distance >= selectedCourse.distance && trackingStatus !== 'completed') {
      setTrackingStatus('completed');
      toast({
        title: "코스 완주!",
        description: `${selectedCourse.name} 코스를 완주했습니다!`,
      });
    }
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
    setTrackingStatus('on-track');
  };

  const pauseRunning = () => {
    setIsPaused(!isPaused);
  };

  const stopRunning = () => {
    if (isRunning) {
      // 러닝 기록 저장
      const runningRecord = {
        id: Date.now(),
        courseName: selectedCourse ? selectedCourse.name : '자유 러닝',
        courseId: selectedCourse ? selectedCourse.id : null,
        date: new Date().toLocaleDateString('ko-KR'),
        time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
        distance: distance.toFixed(2),
        duration: formatTime(elapsedTime),
        pace: distance > 0 ? `${((elapsedTime / 1000 / 60) / distance).toFixed(1)}분/km` : '0분/km',
        calories: Math.floor(distance * 65),
        averageHeartRate: Math.floor(Math.random() * 40) + 140,
        maxHeartRate: Math.floor(Math.random() * 30) + 170,
        weather: '맑음',
        temperature: '22°C',
        notes: selectedCourse ? `${selectedCourse.name} 코스로 러닝 완료` : '자유 러닝 완료',
        route: route
      };

      // localStorage에 기록 저장
      const existingRecords = JSON.parse(localStorage.getItem('runningRecords') || '[]');
      existingRecords.unshift(runningRecord);
      localStorage.setItem('runningRecords', JSON.stringify(existingRecords));

      toast({
        title: "러닝 완료!",
        description: "러닝 기록이 저장되었습니다.",
      });
    }

    setIsRunning(false);
    setIsPaused(false);
    setStartTime(null);
    setSelectedCourse(null);
    setTrackingStatus('on-track');
  };

  const averagePace = distance > 0 ? (elapsedTime / 1000 / 60) / distance : 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="space-y-6">
        {selectedCourse && (
          <Card className="bg-gradient-to-br from-green-50 to-blue-50 border-green-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-green-500" />
                선택된 코스
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg">{selectedCourse.name}</h3>
                  <p className="text-sm text-gray-600">{selectedCourse.location}</p>
                  <p className="text-sm text-gray-600">{selectedCourse.distance}km • {selectedCourse.difficulty}</p>
                </div>
                <div className="text-right">
                  <Badge 
                    variant={trackingStatus === 'on-track' ? 'default' : trackingStatus === 'off-track' ? 'destructive' : 'default'}
                  >
                    {trackingStatus === 'on-track' && <CheckCircle className="w-3 h-3 mr-1" />}
                    {trackingStatus === 'off-track' && <AlertCircle className="w-3 h-3 mr-1" />}
                    {trackingStatus === 'completed' && <CheckCircle className="w-3 h-3 mr-1" />}
                    {trackingStatus === 'on-track' && '경로 추적 중'}
                    {trackingStatus === 'off-track' && '경로 이탈'}
                    {trackingStatus === 'completed' && '완주!'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

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
          selectedCourse={selectedCourse}
          trackingStatus={trackingStatus}
        />
      </div>

      <div className="lg:sticky lg:top-24">
        <LiveMap 
          currentLocation={currentLocation}
          route={route}
          isRunning={isRunning}
          selectedCourse={selectedCourse}
        />
      </div>
    </div>
  );
};
