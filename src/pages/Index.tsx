
import React, { useState } from 'react';
import { Header } from '../components/layout/Header';
import { CourseRecommendation } from '../components/course/CourseRecommendation';
import { LiveTracking } from '../components/tracking/LiveTracking';
import { CreateCourse } from '../components/course/CreateCourse';
import { MyRecords } from '../components/records/MyRecords';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Compass, Activity, Plus, BarChart3 } from 'lucide-react';

const Index = () => {
  const [activeTab, setActiveTab] = useState('recommend');

  // 코스 선택시 실시간 러닝 탭으로 전환하는 이벤트 리스너
  React.useEffect(() => {
    const handleStartRunning = () => {
      setActiveTab('track');
    };

    window.addEventListener('startRunningWithCourse', handleStartRunning);
    return () => window.removeEventListener('startRunningWithCourse', handleStartRunning);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Header />
      
      {/* 모바일 친화적인 히어로 섹션 */}
      <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            코스픽
          </h1>
          <p className="text-lg opacity-90 max-w-md mx-auto">
            나에게 딱 맞는 러닝 코스를 추천받고 즐겁게 달려보세요
          </p>
        </div>
      </div>

      <main className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6 h-12 rounded-2xl bg-white shadow-lg border">
            <TabsTrigger 
              value="recommend" 
              className="flex flex-col items-center gap-1 py-2 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-green-500 data-[state=active]:text-white"
            >
              <Compass className="w-5 h-5" />
              <span className="text-xs font-medium">코스추천</span>
            </TabsTrigger>
            <TabsTrigger 
              value="track" 
              className="flex flex-col items-center gap-1 py-2 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-green-500 data-[state=active]:text-white"
            >
              <Activity className="w-5 h-5" />
              <span className="text-xs font-medium">실시간</span>
            </TabsTrigger>
            <TabsTrigger 
              value="create" 
              className="flex flex-col items-center gap-1 py-2 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-green-500 data-[state=active]:text-white"
            >
              <Plus className="w-5 h-5" />
              <span className="text-xs font-medium">코스만들기</span>
            </TabsTrigger>
            <TabsTrigger 
              value="records" 
              className="flex flex-col items-center gap-1 py-2 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-green-500 data-[state=active]:text-white"
            >
              <BarChart3 className="w-5 h-5" />
              <span className="text-xs font-medium">기록</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="recommend" className="mt-0">
            <CourseRecommendation />
          </TabsContent>

          <TabsContent value="track" className="mt-0">
            <LiveTracking />
          </TabsContent>

          <TabsContent value="create" className="mt-0">
            <CreateCourse />
          </TabsContent>

          <TabsContent value="records" className="mt-0">
            <MyRecords />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
