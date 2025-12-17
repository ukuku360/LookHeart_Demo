import React, { useState } from 'react';
import { Settings, User, Bell, Shield, HelpCircle, LogOut, ChevronRight } from 'lucide-react';
import { mockData } from '../data/mockData';

export default function Menu() {

  return (
    <div className="p-4 pt-10 pb-24 flex flex-col gap-6 bg-gray-50 min-h-screen animate-fade-in">
      {/* Profile Section */}
      <div className="flex items-center gap-4 px-2">
        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 shadow-sm border-2 border-white">
          <User size={32} />
        </div>
        <div className="flex flex-col">
          <h1 className="text-xl font-bold text-gray-800">김철수 님</h1>
          <span className="text-sm text-gray-500">chelsu@example.com</span>
        </div>
      </div>


      {/* Menu List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <MenuItem icon={User} label="내 정보 수정" />
        <MenuItem icon={Bell} label="알림 설정" />
        <MenuItem icon={Shield} label="개인정보 처리방침" />
        <MenuItem icon={HelpCircle} label="고객센터 / 도움말" />
        <MenuItem icon={Settings} label="앱 설정" />
      </div>

      {/* Logout Button */}
      <button className="flex items-center justify-center gap-2 w-full p-4 text-rose-500 font-bold bg-rose-50 rounded-2xl border border-rose-100 hover:bg-rose-100 transition-colors mt-auto">
        <LogOut size={18} />
        로그아웃
      </button>
    </div>
  );
}

function MenuItem({ icon: Icon, label }) {
  return (
    <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-none">
      <div className="flex items-center gap-3">
        <Icon size={20} className="text-gray-400" />
        <span className="font-medium text-gray-700">{label}</span>
      </div>
      <ChevronRight size={18} className="text-gray-300" />
    </button>
  );
}
