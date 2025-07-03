
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Zap, TrendingUp, Heart, Footprints, Target, CheckCircle } from 'lucide-react';

export const RunningStats = ({ elapsedTime, distance, route, isRunning, selectedCourse, trackingStatus }) => {
  const currentPace = route.length > 1 && elapsedTime > 0 ? 
    (elapsedTime / 1000 / 60) / distance : 0;
  
  const estimatedCalories = Math.floor(distance * 65);
  const targetDistance = selectedCourse ? selectedCourse.distance : 5;
  const progressPercentage = Math.min((distance / targetDistance) * 100, 100);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-purple-500" />
          러닝 통계
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {selectedCourse && (
          <div className="p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">코스 진행률</span>
              <Badge variant={trackingStatus === 'completed' ? 'default' : 'secondary'}>
                {trackingStatus === 'completed' ? (
                  <>
                    <CheckCircle className="w-3 h-3 mr-1" />
                    완주!
                  </>
                ) : (
                  `${progressPercentage.toFixed(0)}%`
                )}
              </Badge>
            </div>
            <Progress value={progressPercentage} className="h-2" />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0km</span>
              <span>{targetDistance}km 목표</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Zap className="w-4 h-4 text-blue-500" />
              <span className="text-sm text-gray-600">현재 페이스</span>
            </div>
            <div className="text-lg font-bold text-blue-600">
              {currentPace > 0 ? `${currentPace.toFixed(1)}분/km` : '--'}
            </div>
          </div>
          
          <div className="text-center p-3 bg-orange-50 rounded-lg">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Heart className="w-4 h-4 text-orange-500" />
              <span className="text-sm text-gray-600">예상 칼로리</span>
            </div>
            <div className="text-lg font-bold text-orange-600">
              {estimatedCalories} kcal
            </div>
          </div>
        </div>

        <div className="pt-2 border-t">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <Footprints className="w-4 h-4" />
            러닝 기록
          </div>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>총 경로 포인트:</span>
              <span className="font-medium">{route.length}</span>
            </div>
            {selectedCourse && (
              <div className="flex justify-between">
                <span>선택된 코스:</span>
                <span className="font-medium">{selectedCourse.name}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>상태:</span>
              <span className={`font-medium ${isRunning ? 'text-green-600' : 'text-gray-600'}`}>
                {isRunning ? '추적 중' : '정지'}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
