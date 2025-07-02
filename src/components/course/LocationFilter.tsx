
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { MapPin, Navigation, Target } from 'lucide-react';
import { seoulDistricts } from '../../data/mockData';

export const LocationFilter = ({ onLocationChange, currentLocation }) => {
  const [selectedRegion, setSelectedRegion] = useState('전체');
  const [selectedDistrict, setSelectedDistrict] = useState('전체');
  const [nearbyMode, setNearbyMode] = useState(false);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    if (nearbyMode && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          };
          setUserLocation(location);
          onLocationChange({
            type: 'nearby',
            location: location,
            radius: 5 // 5km 반경
          });
        },
        (error) => {
          console.error('위치 정보를 가져올 수 없습니다:', error);
          setNearbyMode(false);
        }
      );
    } else if (!nearbyMode) {
      onLocationChange({
        type: 'region',
        region: selectedRegion,
        district: selectedDistrict
      });
    }
  }, [nearbyMode, selectedRegion, selectedDistrict, onLocationChange]);

  const handleNearbyToggle = () => {
    setNearbyMode(!nearbyMode);
    if (!nearbyMode) {
      setSelectedRegion('전체');
      setSelectedDistrict('전체');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-blue-500" />
          위치별 코스 탐색
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <Button
            variant={nearbyMode ? "default" : "outline"}
            size="sm"
            onClick={handleNearbyToggle}
            className="flex items-center gap-2"
          >
            <Navigation className="w-4 h-4" />
            내 주변
          </Button>
          {nearbyMode && userLocation && (
            <Badge variant="secondary" className="text-xs">
              현재 위치 기준 5km
            </Badge>
          )}
        </div>

        {!nearbyMode && (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                지역
              </label>
              <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="전체">전체</SelectItem>
                  <SelectItem value="서울">서울</SelectItem>
                  <SelectItem value="경기">경기</SelectItem>
                  <SelectItem value="인천">인천</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                구역
              </label>
              <Select 
                value={selectedDistrict} 
                onValueChange={setSelectedDistrict}
                disabled={selectedRegion !== '서울'}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="전체">전체</SelectItem>
                  {selectedRegion === '서울' && seoulDistricts.map((district) => (
                    <SelectItem key={district} value={district}>
                      {district}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {nearbyMode && !userLocation && (
          <div className="flex items-center justify-center py-4 text-sm text-gray-500">
            <Target className="w-4 h-4 mr-2 animate-pulse" />
            위치 정보를 가져오는 중...
          </div>
        )}
      </CardContent>
    </Card>
  );
};
