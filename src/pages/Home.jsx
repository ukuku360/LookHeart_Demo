import React from 'react';
import { Bluetooth, Zap, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { useBluetooth } from '../contexts/BluetoothContext';
import { mockData } from '../data/mockData';
import AIInsightCard from '../components/cards/AIInsightCard';
import { APP_CONFIG } from '../config/appConfig';

export default function Home() {
  const { status, data, connect, disconnect, isConnected } = useBluetooth();
  
  // Get today's date from config
  const today = APP_CONFIG.TODAY;
  const todayData = mockData.dailyStats[today];

  return (
    <div className="p-4 pt-6 pb-24 flex flex-col gap-4 bg-gray-50 min-h-screen animate-fade-in">
      {/* Top Status Header */}
      <div className="flex gap-2 h-20">
        {/* BPM Card */}
        <div className="flex-1 bg-white rounded-2xl border-2 border-gray-100 relative p-2 flex flex-col items-center justify-center shadow-sm overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-blue-300"></div>
            <span className={cn(
              "text-4xl font-bold text-gray-700 mt-2",
              isConnected && "animate-pulse-slow"
            )}>{data.bpm}</span>
            <span className="text-[10px] font-bold text-blue-400 absolute bottom-1.5 right-3 tracking-wider">BPM</span>
        </div>

        {/* Abnormal Pulse Card */}
        <div className="flex-1 bg-rose-400 rounded-2xl relative p-2 flex flex-col items-center justify-center text-white shadow-sm overflow-hidden">
             <div className="absolute top-0 left-0 right-0 h-1.5 bg-rose-500/30"></div>
             <span className="text-4xl font-bold mt-2">{data.abnormalCount}</span>
             <span className="text-[10px] font-bold absolute bottom-1.5 right-3 opacity-90 tracking-wider">비정상맥박</span>
        </div>
      </div>

      {/* AI Health Insight Card */}
      <AIInsightCard dailyData={todayData} />

      {/* Main Connection Area */}
      <div className={cn(
        "bg-white rounded-2xl border-2 border-blue-100 relative overflow-hidden shadow-sm transition-all duration-500 ease-in-out",
        status === 'connected' ? "h-20" : "h-80 flex flex-col"
      )}>
          {status !== 'connected' ? (
            <>
              <div className="flex-1 flex items-center justify-center">
                {status === 'disconnected' && (
                  <button
                    onClick={connect}
                    className="bg-blue-400 hover:bg-blue-500 text-white px-6 py-2.5 rounded-full font-bold flex items-center gap-2 transition-all shadow-md active:scale-95"
                  >
                    <Bluetooth size={20} className="stroke-[2.5]" />
                    기기 찾기
                  </button>
                )}
                {status === 'connecting' && (
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 size={40} className="text-blue-400 animate-spin" />
                    <span className="text-gray-600 font-bold text-sm">연결 중...</span>
                  </div>
                )}
              </div>
              {/* Disconnect Bar */}
              <button
                onClick={disconnect}
                disabled={status === 'disconnected'}
                className={cn(
                  "bg-blue-100/80 h-10 flex items-center justify-center relative transition-all",
                  status === 'disconnected' && "opacity-50 cursor-not-allowed"
                )}
              >
                <div className="absolute left-4 w-1.5 h-4 bg-rose-400 rounded-full"></div>
                <span className="text-gray-500 font-bold text-sm tracking-widest">DISCONNECT</span>
              </button>
            </>
          ) : (
            /* Connected Compact View */
            <div className="w-full h-full flex items-center justify-between px-6">
               <div className="flex items-center gap-3">
                   <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-200"></div>
                   <span className="font-bold text-gray-700 text-lg">기기 연결됨</span>
               </div>
               <button 
                 onClick={disconnect} 
                 className="bg-rose-50 hover:bg-rose-100 text-rose-500 px-4 py-2 rounded-xl text-sm font-bold transition-all border border-rose-100 active:scale-95 flex items-center gap-2"
               >
                 <span>연결 해제</span>
               </button>
            </div>
          )}
      </div>

      {/* Stats Grid */}
      <div className="flex flex-col gap-2">
         {/* Stress Card */}
         <div className="bg-gray-200/50 rounded-2xl p-3 flex items-center justify-between shadow-sm border border-gray-100">
             <div className="flex items-center gap-3">
                 <div className="bg-gray-500 rounded-full w-10 h-10 flex items-center justify-center text-white shadow-sm">
                     <Zap size={20} className="fill-white stroke-none" />
                 </div>
                 <div className="flex flex-col">
                     <span className="font-bold text-gray-700 text-sm">스트레스</span>
                     <span className="text-[10px] text-gray-500 font-medium">5분 간격으로 측정</span>
                 </div>
             </div>
             {/* Toggle */}
             <div className="flex bg-blue-100 rounded-full p-1 w-32 relative">
                 <div className="z-10 w-1/2 text-center text-[10px] font-bold text-white leading-5">SNS</div>
                 <div className="z-10 w-1/2 text-center text-[10px] font-bold text-white leading-5">PNS</div>
                 <div className="absolute inset-y-1 left-1 w-[calc(50%-4px)] bg-rose-300 rounded-full shadow-sm"></div>
                 {/* This toggle needs logic but for mockup hardcoded is fine. Screenshot shows SNS pink selected. */}
                 {/* Actually screenshot shows: SNS (Pink bg), PNS (Blue bg). It is a split bar. */}
                 <div className="absolute inset-0 flex">
                    <div className="w-1/2 bg-rose-300 rounded-l-full flex items-center justify-center text-white text-[10px] font-bold">SNS</div>
                    <div className="w-1/2 bg-blue-300 rounded-r-full flex items-center justify-center text-white text-[10px] font-bold opacity-50">PNS</div>
                 </div> 
             </div>
         </div>

         {/* 2x2 Grid */}
         <div className="grid grid-cols-2 gap-2">
             <GridItem labelIcon="°C" label="전극온도" value={data.temperature.toFixed(1)} />
             <GridItem labelIcon="step" label="걸음수" value={data.steps} />
             <GridItem labelIcon="kcal" label="활동 칼로리" value={data.calories.toFixed(1)} />
             <GridItem labelIcon="km" label="거리" value={data.distance.toFixed(3)} />
         </div>
      </div>
    </div>
  );
}

function GridItem({ labelIcon, label, value }) {
    return (
        <div className="bg-gray-200/50 rounded-2xl p-3 flex flex-col gap-3 shadow-sm border border-gray-100">
             <div className="flex items-center justify-between">
                 <div className="bg-gray-500 rounded-full w-10 h-10 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                     {labelIcon}
                 </div>
                 <span className="font-bold text-sm text-gray-600">{label}</span>
             </div>
             <div className="bg-white rounded-xl py-2 px-3 text-center shadow-sm w-full">
                 <span className="text-lg font-bold text-gray-700">{value}</span>
             </div>
        </div>
    )
}
