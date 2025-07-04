
import React from 'react';
import { Button } from '@/components/ui/button';
import { User, Bell, Menu } from 'lucide-react';

export const Header = () => {
  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
      <div className="px-4 py-3 flex items-center justify-between">
        {/* 좌측: 메뉴 버튼과 로고 */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="rounded-full w-10 h-10 p-0 lg:hidden">
            <Menu className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-xl flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-sm">코</span>
            </div>
            <div>
              <span className="font-bold text-lg text-gray-800">코스픽</span>
            </div>
          </div>
        </div>
        
        {/* 우측: 알림과 프로필 */}
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" className="rounded-full w-10 h-10 p-0 relative">
            <Bell className="w-5 h-5" />
            {/* 알림 배지 */}
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">3</span>
            </div>
          </Button>
          <Button variant="ghost" size="sm" className="rounded-full w-10 h-10 p-0">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
          </Button>
        </div>
      </div>
    </header>
  );
};
