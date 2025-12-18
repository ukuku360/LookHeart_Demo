import React, { useEffect, useState, useMemo, memo } from 'react';
import { X, BarChart2, ChevronLeft, ChevronRight, Calendar, Sparkles, BrainCircuit } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, YAxis, CartesianGrid } from 'recharts';
import { getECGWaveform } from '../../data/ecgWaveforms';
import { cn } from '../../lib/utils';
import { aiAnalysisData } from '../../data/aiAnalysisData';

// Memoized Chart Component to prevent re-renders during AI analysis loading
const ECGChart = memo(({ data }) => (
    <div className="w-full h-full pt-8 pb-4 pl-1 pr-1">
        <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
            <CartesianGrid vertical={false} stroke="#e2e8f0" />
            <YAxis hide domain={[0, 150]} />
            <Line
            type="monotone"
            dataKey="value"
            stroke="#3b82f6"
            strokeWidth={1.5}
            dot={false}
            isAnimationActive={false} // Disable chart animation for performance
            />
        </LineChart>
        </ResponsiveContainer>
    </div>
));

ECGChart.displayName = 'ECGChart';

export default function ECGModal({ isOpen, onClose, event, currentDate }) {
  const [activeTab, setActiveTab] = useState('abnormal');
  // Use event?.id as key to reset state when event changes
  const eventKey = event?.id;
  const [analysisStatus, setAnalysisStatus] = useState('idle'); // idle, loading, done
  const [lastEventKey, setLastEventKey] = useState(eventKey);

  // Reset analysis status when event changes (without direct setState in effect)
  if (eventKey !== lastEventKey) {
    setLastEventKey(eventKey);
    setAnalysisStatus('idle');
  }

  const handleAnalyze = () => {
    if (analysisStatus === 'done' || analysisStatus === 'loading') return;
    setAnalysisStatus('loading');
    
    // Simulate API call delay
    setTimeout(() => {
        setAnalysisStatus('done');
    }, 2000);
  };
  
  // Get specific analysis data for this event or fallback to default
  const analysisData = analysisStatus === 'done' 
    ? (aiAnalysisData.ecg[event?.id] || aiAnalysisData.ecg.default)
    : null;

  // Get ECG waveform data for the selected event - MEMOIZED
  const ecgData = useMemo(() => getECGWaveform(event?.id || 338), [event?.id]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
    }

    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 animate-fade-in" // Removed backdrop-blur-sm for performance
      onClick={onClose}
    >
      <div
        className="absolute inset-4 bg-gray-50 rounded-2xl shadow-2xl flex flex-col max-w-md mx-auto animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-800">ECG 상세</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-200 rounded-full transition-colors"
          >
            <X size={24} className="text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 pb-12 bg-gray-50/50 block">
          {/* ECG Chart */}
          <div className="bg-white rounded-2xl border-2 border-gray-300 p-2 relative h-64 shadow-sm mb-4">
            {/* Top Controls */}
            <div className="absolute top-2 right-2 flex gap-1 z-10">
              <button
                onClick={() => setActiveTab('activity')}
                className={cn(
                  "text-[10px] px-3 py-1 rounded font-bold transition-colors",
                  activeTab === 'activity'
                    ? "bg-gray-500 text-white shadow-sm"
                    : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                )}
              >
                활동
              </button>
              <button
                onClick={() => setActiveTab('abnormal')}
                className={cn(
                  "text-[10px] px-3 py-1 rounded font-bold transition-colors",
                  activeTab === 'abnormal'
                    ? "bg-gray-500 text-white shadow-sm"
                    : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                )}
              >
                비정상 맥박
              </button>
            </div>

            {/* Waveform - Uses Memoized Component */}
            <ECGChart data={ecgData} />

            {/* Stats Button */}
            <button className="absolute bottom-2 right-2 bg-rose-300 rounded-md p-1.5 text-white shadow-sm hover:bg-rose-400 transition-colors">
              <BarChart2 size={16} />
            </button>
          </div>

          {/* Date Navigation */}
          <div className="flex items-center justify-between mb-4">
            <button className="bg-gray-600 rounded-full p-1.5 text-white shadow-md active:scale-95 transition-transform hover:bg-gray-700">
              <ChevronLeft size={20} />
            </button>
            <div className="flex items-center gap-2 bg-gray-200/50 px-4 py-1.5 rounded-full border border-gray-200">
              <Calendar size={18} className="text-gray-600" />
              <span className="text-gray-700 font-bold text-sm">{currentDate}</span>
            </div>
            <button className="bg-gray-600 rounded-full p-1.5 text-white shadow-md active:scale-95 transition-transform hover:bg-gray-700">
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Filter Tabs */}
          <div className="flex bg-white rounded-xl p-1 border border-gray-300 shadow-sm mb-4">
            {['전체', '종류', '상태', '시간'].map((tab, idx) => (
              <button
                key={tab}
                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${
                  idx === 0
                    ? 'bg-gray-600 text-white shadow-sm'
                    : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Selected Event Info */}
          <div className="flex items-center gap-2 bg-white rounded-xl p-1 pr-4 border-rose-300 ring-1 ring-rose-100 shadow-sm mb-4">
            <div className="w-14 h-11 flex items-center justify-center rounded-lg font-bold text-white shadow-sm bg-rose-300">
              {event?.id}
            </div>
            <div className="flex-1 text-center font-bold text-gray-600 text-sm">
              {event?.time}
            </div>
            </div>


          {/* AI Analysis Section */}
          <div 
              onClick={handleAnalyze}
              className={cn(
                  "bg-white p-5 rounded-2xl shadow-sm border border-gray-100 transition-all duration-300 relative overflow-hidden",
                  analysisStatus === 'idle' ? "cursor-pointer hover:shadow-md hover:border-rose-200 group" : ""
              )}
          >
              {/* Removed Background Decor Blur for Performance */}
              
              <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2 relative z-10">
                  {analysisStatus === 'loading' ? (
                      <Sparkles size={18} className="text-rose-500 animate-pulse" />
                  ) : (
                      <BrainCircuit size={18} className={cn("text-rose-500", analysisStatus === 'idle' ? "group-hover:text-rose-600 transition-colors" : "")} />
                  )}
                  AI 심전도 정밀 분석
                  {analysisStatus === 'idle' && (
                      <span className="text-[10px] bg-rose-50 text-rose-600 px-2 py-0.5 rounded-full font-medium ml-2">Beta</span>
                  )}
              </h4>

              <div className="relative z-10 min-h-[60px]">
                  {analysisStatus === 'idle' && (
                      <div className="flex flex-col gap-2">
                          <p className="text-sm text-gray-400 leading-relaxed">
                              선택된 구간의 심전도 파형을 AI가 분석하여 부정맥 위험도와 상세 소견을 제공합니다.
                          </p>
                          <div className="flex justify-end mt-1">
                              <span className="text-xs font-semibold text-rose-500 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                                  분석 리포트 생성 <ChevronRight size={14}/>
                              </span>
                          </div>
                      </div>
                  )}

                  {analysisStatus === 'loading' && (
                      <div className="flex flex-col items-center justify-center py-6 gap-3 animate-fade-in">
                          <div className="w-6 h-6 border-2 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
                          <span className="text-xs font-medium text-rose-500 animate-pulse">
                              심전도 파형을 분석하고 있습니다...
                          </span>
                      </div>
                  )}

                  {analysisStatus === 'done' && analysisData && (
                      <div className="flex flex-col gap-4 animate-scale-in">
                          
                          {/* Diagnosis */}
                          <div className="bg-rose-50/50 p-3 rounded-xl border border-rose-100">
                              <span className="text-xs font-bold text-rose-600 mb-1 block">🩺 AI 진단 소견</span>
                              <p className="text-sm text-gray-700 leading-relaxed font-medium">
                                  {analysisData.diagnosis}
                              </p>
                          </div>

                          <div className="grid grid-cols-1 gap-3">
                              {/* Risk */}
                              <div className="p-3 rounded-xl border border-orange-100 bg-orange-50/50">
                                  <span className="text-xs font-bold text-orange-600 mb-1 block">⚠️ 임상적 위험도</span>
                                  <p className="text-xs text-gray-600 leading-normal">
                                      {analysisData.risk}
                                  </p>
                              </div>

                              {/* Tips */}
                              <div className="p-3 rounded-xl border border-blue-100 bg-blue-50/50">
                                  <span className="text-xs font-bold text-blue-600 mb-2 block">💡 행동 가이드</span>
                                  <ul className="space-y-1.5">
                                      {analysisData.tips.map((tip, idx) => (
                                          <li key={idx} className="flex items-start gap-2 text-xs text-gray-600">
                                              <span className="text-blue-500 mt-0.5">•</span>
                                              {tip}
                                          </li>
                                      ))}
                                  </ul>
                              </div>
                          </div>
                      </div>
                  )}
              </div>
          </div>

          {/* More events could be listed here */}
        </div>
      </div>
    </div>
  );
}
