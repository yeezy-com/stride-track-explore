
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { X, MapPin, Clock, Calendar, Thermometer, Cloud, Heart, Activity } from 'lucide-react';
import { SimpleMap } from '../course/SimpleMap';
import { mockCourses } from '../../data/mockData';

interface RecordDetailProps {
  record: any;
  onClose: () => void;
}

export const RecordDetail: React.FC<RecordDetailProps> = ({ record, onClose }) => {
  // 해당 기록의 코스 정보 찾기
  const course = mockCourses.find(c => c.id === record.courseId);

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <CardTitle className="text-xl font-bold text-gray-800">
            {record.courseName}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <Calendar className="w-4 h-4" />
          {record.date} {record.time}
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-y-auto space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{record.distance}km</div>
            <div className="text-sm text-gray-600">거리</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{record.duration}</div>
            <div className="text-sm text-gray-600">시간</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{record.pace}</div>
            <div className="text-sm text-gray-600">페이스</div>
          </div>
        </div>

        <Separator />

        {course && (
          <div>
            <h3 className="font-semibold mb-3 text-gray-800">러닝 경로</h3>
            <div className="h-48 bg-slate-50 rounded-lg overflow-hidden">
              <SimpleMap courses={[course]} onCourseSelect={() => {}} />
            </div>
          </div>
        )}

        <Separator />

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-800">운동 정보</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-gray-600">
                  <Activity className="w-4 h-4" />
                  칼로리
                </span>
                <span className="font-medium">{record.calories}kcal</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-gray-600">
                  <Heart className="w-4 h-4" />
                  평균 심박수
                </span>
                <span className="font-medium">{record.averageHeartRate}bpm</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-gray-600">
                  <Heart className="w-4 h-4" />
                  최고 심박수
                </span>
                <span className="font-medium">{record.maxHeartRate}bpm</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-800">날씨 정보</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-gray-600">
                  <Cloud className="w-4 h-4" />
                  날씨
                </span>
                <span className="font-medium">{record.weather}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-gray-600">
                  <Thermometer className="w-4 h-4" />
                  온도
                </span>
                <span className="font-medium">{record.temperature}</span>
              </div>
            </div>
          </div>
        </div>

        {record.notes && (
          <>
            <Separator />
            <div>
              <h3 className="font-semibold mb-2 text-gray-800">러닝 노트</h3>
              <p className="text-gray-700 leading-relaxed bg-gray-50 p-3 rounded-lg">
                {record.notes}
              </p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
