
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Clock, Zap, TrendingUp } from 'lucide-react';

interface RecordStatsProps {
  records: any[];
}

export const RecordStats: React.FC<RecordStatsProps> = ({ records }) => {
  const totalDistance = records.reduce((sum, record) => {
    const distance = typeof record.distance === 'number' ? record.distance : parseFloat(record.distance) || 0;
    return sum + distance;
  }, 0);
  
  const totalRuns = records.length;
  const totalCalories = records.reduce((sum, record) => {
    const calories = typeof record.calories === 'number' ? record.calories : parseInt(record.calories) || 0;
    return sum + calories;
  }, 0);
  
  // 평균 페이스 계산
  const totalSeconds = records.reduce((sum, record) => {
    if (!record.pace || typeof record.pace !== 'string') return sum;
    const [minutes, seconds] = record.pace.split(':').map(Number);
    return sum + (minutes * 60 + (seconds || 0));
  }, 0);
  
  const avgPaceSeconds = records.length > 0 ? Math.round(totalSeconds / records.length) : 0;
  const avgPace = avgPaceSeconds > 0 ? 
    `${Math.floor(avgPaceSeconds / 60)}:${(avgPaceSeconds % 60).toString().padStart(2, '0')}` : 
    '0:00';

  const stats = [
    {
      title: '총 거리',
      value: `${totalDistance.toFixed(1)}km`,
      icon: MapPin,
      color: 'text-blue-600'
    },
    {
      title: '총 러닝 횟수',
      value: `${totalRuns}회`,
      icon: TrendingUp,
      color: 'text-green-600'
    },
    {
      title: '총 칼로리',
      value: `${totalCalories.toLocaleString()}kcal`,
      icon: Zap,
      color: 'text-yellow-600'
    },
    {
      title: '평균 페이스',
      value: avgPace,
      icon: Clock,
      color: 'text-purple-600'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardContent className="p-4 text-center">
            <div className={`inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 mb-2`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
            <div className="text-sm text-gray-600">{stat.title}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
