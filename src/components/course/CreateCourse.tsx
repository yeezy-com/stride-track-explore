import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, X, MapPin, Save } from 'lucide-react';
import { toast } from 'sonner';
import { useCourses } from '../../contexts/CourseContext';

export const CreateCourse = () => {
  const { addCourse } = useCourses();
  const [courseData, setCourseData] = useState({
    name: '',
    location: '',
    description: '',
    difficulty: '',
    distance: '',
    estimatedTime: '',
    tags: []
  });
  const [newTag, setNewTag] = useState('');

  const handleInputChange = (field, value) => {
    setCourseData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addTag = () => {
    if (newTag.trim() && !courseData.tags.includes(newTag.trim())) {
      setCourseData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove) => {
    setCourseData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSave = () => {
    if (!courseData.name || !courseData.location || !courseData.difficulty) {
      toast.error('필수 정보를 모두 입력해주세요.');
      return;
    }

    // 새 코스를 context에 추가
    addCourse({
      name: courseData.name,
      location: courseData.location,
      description: courseData.description,
      difficulty: courseData.difficulty,
      distance: parseFloat(courseData.distance) || 0,
      estimatedTime: courseData.estimatedTime || '미정',
      tags: courseData.tags
    });

    console.log('새 코스 저장:', courseData);
    toast.success('러닝 코스가 성공적으로 생성되었습니다!');
    
    // 폼 초기화
    setCourseData({
      name: '',
      location: '',
      description: '',
      difficulty: '',
      distance: '',
      estimatedTime: '',
      tags: []
    });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5 text-green-500" />
            새 러닝 코스 만들기
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                코스 이름 <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="예: 한강 러닝 코스"
                value={courseData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                위치 <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="예: 서울 여의도"
                value={courseData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">코스 설명</label>
            <Textarea
              placeholder="이 러닝 코스의 특징과 매력을 설명해주세요..."
              value={courseData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={4}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                난이도 <span className="text-red-500">*</span>
              </label>
              <Select onValueChange={(value) => handleInputChange('difficulty', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="초급">초급</SelectItem>
                  <SelectItem value="중급">중급</SelectItem>
                  <SelectItem value="고급">고급</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">거리 (km)</label>
              <Input
                type="number"
                placeholder="5.0"
                step="0.1"
                value={courseData.distance}
                onChange={(e) => handleInputChange('distance', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">예상 시간</label>
              <Input
                placeholder="30분"
                value={courseData.estimatedTime}
                onChange={(e) => handleInputChange('estimatedTime', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">태그</label>
            <div className="flex gap-2">
              <Input
                placeholder="태그 입력 (예: 야경, 공원)"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addTag()}
              />
              <Button variant="outline" onClick={addTag}>
                추가
              </Button>
            </div>
            {courseData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {courseData.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    #{tag}
                    <X 
                      className="w-3 h-3 cursor-pointer hover:text-red-500" 
                      onClick={() => removeTag(tag)}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 text-blue-700 mb-2">
              <MapPin className="w-4 h-4" />
              <span className="font-medium">GPS 경로 추가 (선택사항)</span>
            </div>
            <p className="text-sm text-blue-600 mb-3">
              실시간 러닝을 통해 실제 경로를 기록하거나, 지도에서 직접 경로를 그려 추가할 수 있습니다.
            </p>
            <Button variant="outline" className="text-blue-600 border-blue-200">
              경로 추가하기
            </Button>
          </div>

          <Button 
            onClick={handleSave}
            className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
          >
            <Save className="w-4 h-4 mr-2" />
            러닝 코스 저장
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
