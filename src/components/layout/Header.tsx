
import React from 'react';
import { Button } from '@/components/ui/button';
import { User, Bell, Settings } from 'lucide-react';

export const Header = () => {
  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">R</span>
          </div>
          <span className="font-semibold text-gray-800">RunShare</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            <Bell className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Settings className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <User className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </header>
  );
};
