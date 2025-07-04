
import React, { useState } from 'react';
import { Header } from '../components/layout/Header';
import { CourseRecommendation } from '../components/course/CourseRecommendation';
import { LiveTracking } from '../components/tracking/LiveTracking';
import { CreateCourse } from '../components/course/CreateCourse';
import { MyRecords } from '../components/records/MyRecords';
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

  const tabs = [
    { id: 'recommend', label: '추천', icon: Compass, component: CourseRecommendation },
    { id: 'track', label: '러닝', icon: Activity, component: LiveTracking },
    { id: 'create', label: '생성', icon: Plus, component: CreateCourse },
    { id: 'records', label: '기록', icon: BarChart3, component: MyRecords },
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || CourseRecommendation;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header />
      
      {/* 메인 컨텐츠 */}
      <main className="flex-1 overflow-hidden">
        <div className="h-full pb-20"> {/* 하단 탭 공간 확보 */}
          <ActiveComponent />
        </div>
      </main>

      {/* 하단 탭 네비게이션 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-300 shadow-lg z-50">
        <div className="grid grid-cols-4 h-16">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center justify-center gap-1 transition-all duration-200 ${
                  isActive 
                    ? 'text-gray-900' 
                    : 'text-gray-500'
                }`}
              >
                <div className={`p-1 rounded-lg transition-all duration-200 ${
                  isActive 
                    ? 'bg-gray-200 scale-110' 
                    : 'hover:bg-gray-100'
                }`}>
                  <Icon className="w-6 h-6" />
                </div>
                <span className={`text-xs font-medium transition-all duration-200 ${
                  isActive ? 'scale-105' : ''
                }`}>
                  {tab.label}
                </span>
                {isActive && (
                  <div className="w-4 h-0.5 bg-gray-800 rounded-full mt-1"></div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Index;
