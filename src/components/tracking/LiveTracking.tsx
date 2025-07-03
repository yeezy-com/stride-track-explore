
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, Square, MapPin, Clock, Activity } from 'lucide-react';
import { RunningStats } from './RunningStats';
import { LiveMap } from './LiveMap';

export interface RunningSession {
  isRunning: boolean;
  isPaused: boolean;
  startTime: Date | null;
  pausedTime: number;
  selectedCourse: any;
  currentPosition: [number, number] | null;
  distance: number;
  calories: number;
  pace: string;
  heartRate: number;
  routePoints: [number, number][];
}

export const LiveTracking = () => {
  const [session, setSession] = useState<RunningSession>({
    isRunning: false,
    isPaused: false,
    startTime: null,
    pausedTime: 0,
    selectedCourse: null,
    currentPosition: null,
    distance: 0,
    calories: 0,
    pace: '0:00',
    heartRate: 0,
    routePoints: []
  });

  const [elapsedTime, setElapsedTime] = useState(0);
  const [onTrackStatus, setOnTrackStatus] = useState<'on-track' | 'off-track' | 'unknown'>('unknown');

  // 선택된 코스로 러닝 시작하는 이벤트 리스너
  useEffect(() => {
    const handleStartRunning = (event: CustomEvent) => {
      const course = event.detail;
      console.log('Starting running with course:', course);
      setSession(prev => ({
        ...prev,
        selectedCourse: course
      }));
    };

    window.addEventListener('startRunningWithCourse', handleStartRunning as EventListener);
    return () => window.removeEventListener('startRunningWithCourse', handleStartRunning as EventListener);
  }, []);

  // 경과 시간 계산
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (session.isRunning && !session.isPaused && session.startTime) {
      interval = setInterval(() => {
        const now = new Date().getTime();
        const start = session.startTime!.getTime();
        setElapsedTime(Math.floor((now - start - session.pausedTime) / 1000));
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [session.isRunning, session.isPaused, session.startTime, session.pausedTime]);

  // 위치 추적 및 거리 계산
  useEffect(() => {
    let watchId: number;

    if (session.isRunning && !session.isPaused) {
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          const newPosition: [number, number] = [position.coords.longitude, position.coords.latitude];
          
          setSession(prev => {
            const newRoutePoints = [...prev.routePoints, newPosition];
            let newDistance = prev.distance;
            
            // 거리 계산 (간단한 유클리드 거리)
            if (prev.routePoints.length > 0) {
              const lastPoint = prev.routePoints[prev.routePoints.length - 1];
              const deltaX = newPosition[0] - lastPoint[0];
              const deltaY = newPosition[1] - lastPoint[1];
              const segmentDistance = Math.sqrt(deltaX * deltaX + deltaY * deltaY) * 111; // 대략적인 km 변환
              newDistance += segmentDistance;
            }

            // 칼로리 계산 (대략적으로 거리 * 60)
            const newCalories = Math.round(newDistance * 60);

            // 페이스 계산
            const timeInMinutes = elapsedTime / 60;
            const paceMinutes = timeInMinutes > 0 ? timeInMinutes / newDistance : 0;
            const paceString = paceMinutes > 0 ? 
              `${Math.floor(paceMinutes)}:${Math.round((paceMinutes % 1) * 60).toString().padStart(2, '0')}` : 
              '0:00';

            // 트랙 추적 상태 업데이트
            if (prev.selectedCourse && prev.selectedCourse.routeCoordinates) {
              const courseRoute = prev.selectedCourse.routeCoordinates;
              const distanceFromRoute = courseRoute.reduce((minDist: number, point: [number, number]) => {
                const dist = Math.sqrt(
                  Math.pow(newPosition[0] - point[0], 2) + 
                  Math.pow(newPosition[1] - point[1], 2)
                );
                return Math.min(minDist, dist);
              }, Infinity);

              setOnTrackStatus(distanceFromRoute < 0.001 ? 'on-track' : 'off-track'); // 약 100m 이내
            }

            return {
              ...prev,
              currentPosition: newPosition,
              routePoints: newRoutePoints,
              distance: newDistance,
              calories: newCalories,
              pace: paceString,
              heartRate: 140 + Math.round(Math.random() * 40) // 시뮬레이션된 심박수
            };
          });
        },
        (error) => console.error('위치 추적 오류:', error),
        { enableHighAccuracy: true, maximumAge: 1000, timeout: 5000 }
      );
    }

    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
    };
  }, [session.isRunning, session.isPaused, elapsedTime]);

  const startRunning = () => {
    setSession(prev => ({
      ...prev,
      isRunning: true,
      isPaused: false,
      startTime: new Date()
    }));
  };

  const pauseRunning = () => {
    setSession(prev => ({
      ...prev,
      isPaused: !prev.isPaused
    }));
  };

  const stopRunning = () => {
    if (session.startTime && session.distance > 0) {
      // 러닝 기록 저장
      const newRecord = {
        id: Date.now().toString(),
        courseId: session.selectedCourse?.id || 'free-run',
        courseName: session.selectedCourse?.name || '자유 러닝',
        date: new Date().toISOString().split('T')[0],
        time: session.startTime.toTimeString().split(' ')[0].substring(0, 5),
        duration: `${Math.floor(elapsedTime / 60)}:${(elapsedTime % 60).toString().padStart(2, '0')}`,
        distance: Number(session.distance.toFixed(1)),
        pace: session.pace,
        calories: session.calories,
        averageHeartRate: session.heartRate,
        maxHeartRate: session.heartRate + 15,
        weather: '맑음',
        temperature: '22°C',
        notes: session.selectedCourse ? `${session.selectedCourse.name} 코스로 러닝했습니다.` : '자유 러닝을 했습니다.'
      };

      // localStorage에 저장
      const existingRecords = JSON.parse(localStorage.getItem('runningRecords') || '[]');
      const updatedRecords = [newRecord, ...existingRecords];
      localStorage.setItem('runningRecords', JSON.stringify(updatedRecords));
      
      console.log('Running record saved:', newRecord);
      
      // 기록 저장 완료 이벤트 발생
      window.dispatchEvent(new CustomEvent('recordSaved'));
    }

    // 세션 초기화
    setSession({
      isRunning: false,
      isPaused: false,
      startTime: null,
      pausedTime: 0,
      selectedCourse: null,
      currentPosition: null,
      distance: 0,
      calories: 0,
      pace: '0:00',
      heartRate: 0,
      routePoints: []
    });
    setElapsedTime(0);
    setOnTrackStatus('unknown');
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">실시간 러닝</h2>
        <p className="text-gray-600">러닝을 시작하고 실시간으로 기록을 확인해보세요</p>
      </div>

      {session.selectedCourse && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <MapPin className="w-5 h-5" />
              선택된 코스: {session.selectedCourse.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-sm text-blue-700">
                거리: {session.selectedCourse.distance}km • 난이도: {session.selectedCourse.difficulty}
              </div>
              {session.isRunning && (
                <Badge 
                  variant={onTrackStatus === 'on-track' ? 'default' : onTrackStatus === 'off-track' ? 'destructive' : 'secondary'}
                >
                  {onTrackStatus === 'on-track' ? '코스 따라가는 중' : 
                   onTrackStatus === 'off-track' ? '코스 이탈' : '위치 확인 중'}
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                러닝 컨트롤
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">
                  {formatTime(elapsedTime)}
                </div>
                <div className="text-sm text-gray-600">경과 시간</div>
              </div>
              
              <div className="flex gap-2 justify-center">
                {!session.isRunning ? (
                  <Button onClick={startRunning} className="flex items-center gap-2">
                    <Play className="w-4 h-4" />
                    시작
                  </Button>
                ) : (
                  <>
                    <Button 
                      onClick={pauseRunning} 
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <Pause className="w-4 h-4" />
                      {session.isPaused ? '재개' : '일시정지'}
                    </Button>
                    <Button 
                      onClick={stopRunning} 
                      variant="destructive"
                      className="flex items-center gap-2"
                    >
                      <Square className="w-4 h-4" />
                      종료
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          <RunningStats 
            elapsedTime={elapsedTime}
            distance={session.distance}
            route={session.routePoints.map(point => ({
              longitude: point[0],
              latitude: point[1]
            }))}
            isRunning={session.isRunning && !session.isPaused}
            selectedCourse={session.selectedCourse}
            trackingStatus={session.distance >= (session.selectedCourse?.distance || 5) ? 'completed' : 'in-progress'}
          />
        </div>

        <div>
          <LiveMap 
            currentLocation={session.currentPosition ? {
              longitude: session.currentPosition[0],
              latitude: session.currentPosition[1]
            } : null}
            route={session.routePoints.map(point => ({
              longitude: point[0],
              latitude: point[1]
            }))}
            isRunning={session.isRunning && !session.isPaused}
            selectedCourse={session.selectedCourse}
          />
        </div>
      </div>
    </div>
  );
};
