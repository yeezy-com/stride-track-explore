
import React from 'react';
import { Button } from '@/components/ui/button';
import { User, Bell, Settings } from 'lucide-react';

export const Header = () => {
  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-green-500 rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-lg">코</span>
          </div>
          <div>
            <span className="font-bold text-xl text-gray-800">코스픽</span>
            <div className="text-xs text-gray-500 -mt-1">Course Pick</div>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" className="rounded-full w-10 h-10 p-0">
            <Bell className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="sm" className="rounded-full w-10 h-10 p-0">
            <Settings className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="sm" className="rounded-full w-10 h-10 p-0">
            <User className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};
