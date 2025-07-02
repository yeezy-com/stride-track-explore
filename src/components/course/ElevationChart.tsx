
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';

export const ElevationChart = ({ elevationProfile, distance }) => {
  const data = elevationProfile.map((elevation, index) => ({
    distance: ((index / (elevationProfile.length - 1)) * distance).toFixed(1),
    elevation: elevation
  }));

  const maxElevation = Math.max(...elevationProfile);
  const minElevation = Math.min(...elevationProfile);
  const elevationGain = maxElevation - minElevation;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-green-500" />
          고도 프로필
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 mb-4 text-center">
          <div>
            <div className="text-lg font-bold text-green-600">{maxElevation}m</div>
            <div className="text-xs text-gray-600">최고</div>
          </div>
          <div>
            <div className="text-lg font-bold text-blue-600">{minElevation}m</div>
            <div className="text-xs text-gray-600">최저</div>
          </div>
          <div>
            <div className="text-lg font-bold text-purple-600">{elevationGain}m</div>
            <div className="text-xs text-gray-600">고도차</div>
          </div>
        </div>
        
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="distance" 
                label={{ value: '거리 (km)', position: 'insideBottom', offset: -10 }}
              />
              <YAxis 
                label={{ value: '고도 (m)', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip 
                formatter={(value) => [`${value}m`, '고도']}
                labelFormatter={(label) => `${label}km`}
              />
              <Line 
                type="monotone" 
                dataKey="elevation" 
                stroke="#10B981" 
                strokeWidth={2}
                dot={false}
                fill="#10B981"
                fillOpacity={0.1}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
