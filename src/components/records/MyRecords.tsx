
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Calendar, Clock, MapPin, Activity, TrendingUp } from 'lucide-react';
import { mockRunningRecords } from '../../data/mockData';
import { RecordStats } from './RecordStats';
import { RecordDetail } from './RecordDetail';

export const MyRecords = () => {
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [records] = useState(mockRunningRecords);

  const getRecentRecords = () => {
    return records
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">나의 러닝 기록</h2>
        <p className="text-gray-600">당신의 러닝 여정을 확인해보세요</p>
      </div>

      <RecordStats records={records} />

      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-800">최근 러닝 기록</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {getRecentRecords().map((record) => (
            <Card 
              key={record.id}
              className="cursor-pointer hover:shadow-lg transition-all duration-200 border-l-4 border-l-green-500"
              onClick={() => setSelectedRecord(record)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg font-semibold text-gray-800">
                    {record.courseName}
                  </CardTitle>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                    완주
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  {record.date} • {record.time}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 mb-3">
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-600">{record.distance}km</div>
                    <div className="text-xs text-gray-600">거리</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">{record.duration}</div>
                    <div className="text-xs text-gray-600">시간</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-purple-600">{record.pace}</div>
                    <div className="text-xs text-gray-600">페이스</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Activity className="w-4 h-4" />
                      {record.calories}kcal
                    </span>
                    <span className="flex items-center gap-1">
                      <TrendingUp className="w-4 h-4" />
                      {record.averageHeartRate}bpm
                    </span>
                  </div>
                  <span>{record.weather} • {record.temperature}</span>
                </div>
                
                {record.notes && (
                  <p className="text-sm text-gray-700 mt-2 line-clamp-1">{record.notes}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Dialog open={!!selectedRecord} onOpenChange={() => setSelectedRecord(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedRecord && (
            <RecordDetail 
              record={selectedRecord} 
              onClose={() => setSelectedRecord(null)} 
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
