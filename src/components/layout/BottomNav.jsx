import React from 'react';
import { Home, BarChart2, HeartPulse, Menu } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function BottomNav({ activeTab, onTabChange }) {
  const tabs = [
    { id: 'home', label: '홈', icon: Home },
    { id: 'stats', label: '', icon: BarChart2 }, // Label empty in some screens? Or '통계'? '요약' in screenshot 4?
    { id: 'arrhythmia', label: '비정상맥박', icon: HeartPulse },
    { id: 'menu', label: '', icon: Menu }, // Menu usually doesn't have label?
  ];

  // Adjust labels based on screenshots
  // Screenshot 4 shows '요약' for Stats tab? Or is '요약' a sub-tab?
  // Screenshot 5 (Home) shows '홈'.
  // Screenshot 1 (Arrhythmia) shows '비정상맥박'.
  // Let's use generic labels or conditional.
  // Stats label might be just an icon or '통계'. 
  // Looking at Screenshot 4 bottom: There is a '요약' (Summary) text below the chart icon.
  // So 'home' -> '홈', 'stats' -> '요약' (Summary) or '통계' (Stats)? Screenshot 4 says '요약'.
  // 'arrhythmia' -> '비정상맥박'.
  // 'menu' -> Hamburger. Usually no text or '메뉴'. Let's leave empty or '메뉴'.

  const navItems = [
    { id: 'home', label: '홈', icon: Home },
    { id: 'stats', label: '요약', icon: BarChart2 },
    { id: 'arrhythmia', label: '비정상맥박', icon: HeartPulse },
    { id: 'menu', label: '', icon: Menu },
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
