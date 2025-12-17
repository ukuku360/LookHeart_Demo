import React from 'react';
import { ChevronRight, User, IdCard, Flag, Users, Bell, Lock, BellRing } from 'lucide-react';
import { mockData } from '../data/mockData';

export default function Menu() {
  const handleMenuItemClick = (item) => {
    console.log(`Menu item clicked: ${item}`);
    // In a real app, navigate to the corresponding page
  };

  return (
    <div className="p-4 pt-6 pb-24 flex flex-col gap-4 bg-gray-50 min-h-screen animate-fade-in">
      {/* Profile Section */}
      <div className="bg-gray-600 rounded-2xl overflow-hidden shadow-lg">
        <div className="p-4 border-b border-gray-500/30">
          <h2 className="text-lg font-bold text-white">프로필</h2>
        </div>

        {/* Email */}
        <div className="px-4 py-3 border-b border-gray-500/30 flex items-center gap-3">
          <User size={20} className="text-gray-300" />
          <span className="text-white font-medium">{mockData.user.email}</span>
        </div>

        {/* Basic Info */}
        <button
          onClick={() => handleMenuItemClick('기본정보')}
          className="w-full px-4 py-3 border-b border-gray-500/30 flex items-center justify-between hover:bg-gray-500/20 transition-colors"
        >
          <div className="flex items-center gap-3">
            <IdCard size={20} className="text-gray-300" />
            <span className="text-white font-medium">기본정보</span>
          </div>
          <ChevronRight size={20} className="text-gray-400" />
        </button>

        {/* Goals */}
        <button
          onClick={() => handleMenuItemClick('목표량')}
          className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-500/20 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Flag size={20} className="text-gray-300" />
            <span className="text-white font-medium">목표량</span>
          </div>
          <ChevronRight size={20} className="text-gray-400" />
        </button>
      </div>

      {/* Guardian Section */}
      <div className="bg-gray-600 rounded-2xl overflow-hidden shadow-lg">
        <div className="p-4 border-b border-gray-500/30">
          <h2 className="text-lg font-bold text-white">보호자</h2>
        </div>

        {/* Guardian Settings */}
        <button
          onClick={() => handleMenuItemClick('보호자 설정')}
          className="w-full px-4 py-3 border-b border-gray-500/30 flex items-center justify-between hover:bg-gray-500/20 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Users size={20} className="text-gray-300" />
            <span className="text-white font-medium">보호자 설정</span>
          </div>
          <ChevronRight size={20} className="text-gray-400" />
        </button>

        {/* Guardian Notifications */}
        <button
          onClick={() => handleMenuItemClick('보호자 알림')}
          className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-500/20 transition-colors"
        >
          <div className="flex items-center gap-3">
            <BellRing size={20} className="text-gray-300" />
            <span className="text-white font-medium">보호자 알림</span>
          </div>
          <ChevronRight size={20} className="text-gray-400" />
        </button>
      </div>

      {/* Settings Section */}
      <div className="bg-gray-600 rounded-2xl overflow-hidden shadow-lg">
        <div className="p-4 border-b border-gray-500/30">
          <h2 className="text-lg font-bold text-white">설정</h2>
        </div>

        {/* Notifications */}
        <button
          onClick={() => handleMenuItemClick('알림')}
          className="w-full px-4 py-3 border-b border-gray-500/30 flex items-center justify-between hover:bg-gray-500/20 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Bell size={20} className="text-gray-300" />
            <span className="text-white font-medium">알림</span>
          </div>
          <ChevronRight size={20} className="text-gray-400" />
        </button>

        {/* Password Change */}
        <button
          onClick={() => handleMenuItemClick('비밀번호 변경')}
          className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-500/20 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Lock size={20} className="text-gray-300" />
            <span className="text-white font-medium">비밀번호 변경</span>
          </div>
          <ChevronRight size={20} className="text-gray-400" />
        </button>
      </div>

      {/* App Version (Optional) */}
      <div className="text-center text-gray-400 text-sm mt-4">
        <p>LookHeart v1.0.0</p>
        <p className="text-xs mt-1">© 2025 MSL Inc.</p>
      </div>
    </div>
  );
}
