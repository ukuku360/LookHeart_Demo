import React from 'react';
import { Home, BarChart2, HeartPulse, Menu, MessageCircle } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function BottomNav({ activeTab, onTabChange }) {
  const navItems = [
    { id: 'home', label: '홈', icon: Home },
    { id: 'stats', label: '요약', icon: BarChart2 },
    { id: 'arrhythmia', label: '비정상맥박', icon: HeartPulse },
    { id: 'heartchat', label: '하트챗', icon: MessageCircle },
    { id: 'menu', label: '메뉴', icon: Menu },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 px-6 flex justify-between items-end z-50 pb-safe">
      {navItems.map((item) => {
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className="flex flex-col items-center gap-1 min-w-[64px]"
          >
            <div
              className={cn(
                "p-2 rounded-2xl transition-all",
                isActive ? "bg-rose-100/50" : "bg-transparent"
              )}
            >
              {/* Note: Screenshot shows filled shape background for active. 
                  Let's try a pink rounded rect with white icon? 
                  Or looking closer, it might be just the icon color? 
                  Screenshot 5: The "Home" icon is WHITE inside a PINK rounded rect.
                  Screenshot 1: The "Arrhythmia" icon is WHITE inside a PINK rounded rect.
              */}
              <div
                className={cn(
                  "flex items-center justify-center w-12 h-8 rounded-2xl transition-colors",
                  isActive ? "bg-rose-300 text-white" : "text-gray-400 bg-transparent"
                )}
              >
                <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              </div>
            </div>
            {item.label && (
              <span
                className={cn(
                  "text-[10px] font-medium",
                  isActive ? "text-rose-400" : "text-gray-400"
                )}
              >
                {item.label}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
