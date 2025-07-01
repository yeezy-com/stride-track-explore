
import React, { useState } from 'react';
import { Header } from '../components/layout/Header';
import { CourseExplorer } from '../components/course/CourseExplorer';
import { LiveTracking } from '../components/tracking/LiveTracking';
import { CreateCourse } from '../components/course/CreateCourse';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Map, Activity, Plus } from 'lucide-react';

const Index = () => {
  const [activeTab, setActiveTab] = useState('explore');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-4">
            RunShare
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            러닝 코스를 공유하고, 실시간으로 달리기를 추적하며, 러너들과 소통해보세요
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="explore" className="flex items-center gap-2">
              <Map className="w-4 h-4" />
              코스 둘러보기
            </TabsTrigger>
            <TabsTrigger value="track" className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              실시간 러닝
            </TabsTrigger>
            <TabsTrigger value="create" className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              코스 만들기
            </TabsTrigger>
          </TabsList>

          <TabsContent value="explore" className="mt-0">
            <CourseExplorer />
          </TabsContent>

          <TabsContent value="track" className="mt-0">
            <LiveTracking />
          </TabsContent>

          <TabsContent value="create" className="mt-0">
            <CreateCourse />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
