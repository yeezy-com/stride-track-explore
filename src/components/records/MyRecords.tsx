
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, MapPin, Heart, Zap, TrendingUp, Activity } from 'lucide-react';
import { mockRunningRecords } from '../../data/mockData';
import { RecordStats } from './RecordStats';

export const MyRecords = () => {
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [sortBy, setSortBy] = useState('recent');

  const sortedRecords = [...mockRunningRecords].sort((a, b) => {
    if (sortBy === 'recent') {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    } else if (sortBy === 'distance') {
      return b.distance - a.distance;
    } else {
      const paceA = parseInt(a.pace.split(':')[0]) * 60 + parseInt(a.pace.split(':')[1]);
      const paceB = parseInt(b.pace.split(':')[0]) * 60 + parseInt(b.pace.split(':')[1]);
      return paceA - paceB;
    }
  });

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-2">
          나의 러닝 기록
        </h2>
        <p className="text-gray-600">지금까지의 러닝 여정을 확인해보세요</p>
      </div>

      <RecordStats records={mockRunningRecords} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-800">러닝 기록</h3>
            <Tabs value={sortBy} onValueChange={setSortBy}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="recent" className="text-xs">최신순</TabsTrigger>
                <TabsTrigger value="distance" className="text-xs">거리순</TabsTrigger>
                <TabsTrigger value="pace" className="text-xs">페이스순</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="space-y-3 max-h-[600px] overflow-y-auto">
            {sortedRecords.map((record) => (
              <Card 
                key={record.id}
                className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                  selectedRecord?.id === record.id ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => setSelectedRecord(record)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-gray-800">{record.courseName}</h4>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(record.date).toLocaleDateString('ko-KR')} {record.time}
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {record.weather}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div>
                      <div className="text-lg font-bold text-blue-600">{record.distance}km</div>
                      <div className="text-xs text-gray-600">거리</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-green-600">{record.duration}</div>
                      <div className="text-xs text-gray-600">시간</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-purple-600">{record.pace}</div>
                      <div className="text-xs text-gray-600">페이스</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="lg:sticky lg:top-24">
          {selectedRecord ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-blue-500" />
                  러닝 상세 기록
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg">{selectedRecord.courseName}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(selectedRecord.date).toLocaleDateString('ko-KR')} {selectedRecord.time}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4" />
                        거리
                      </span>
                      <span className="font-semibold">{selectedRecord.distance}km</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        시간
                      </span>
                      <span className="font-semibold">{selectedRecord.duration}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2 text-sm text-gray-600">
                        <TrendingUp className="w-4 h-4" />
                        페이스
                      </span>
                      <span className="font-semibold">{selectedRecord.pace}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2 text-sm text-gray-600">
                        <Zap className="w-4 h-4" />
                        칼로리
                      </span>
                      <span className="font-semibold">{selectedRecord.calories}kcal</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2 text-sm text-gray-600">
                        <Heart className="w-4 h-4" />
                        평균심박
                      </span>
                      <span className="font-semibold">{selectedRecord.averageHeartRate}bpm</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2 text-sm text-gray-600">
                        <Heart className="w-4 h-4 text-red-500" />
                        최대심박
                      </span>
                      <span className="font-semibold">{selectedRecord.maxHeartRate}bpm</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-semibold mb-2">러닝 노트</h4>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {selectedRecord.notes}
                  </p>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">날씨: {selectedRecord.weather}</span>
                    <span className="text-gray-600">온도: {selectedRecord.temperature}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="h-96 flex items-center justify-center">
              <CardContent className="text-center">
                <Activity className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">러닝 기록을 선택하면<br />상세 정보를 확인할 수 있습니다</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
