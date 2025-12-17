import React, { useState } from 'react';
import { Heart, Activity, Zap, Flame, Footprints, ChevronLeft, ChevronRight, Calendar, Wind, List, TrendingUp, X, Sparkles, BrainCircuit } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { cn } from '../lib/utils';
import { useDateNavigation } from '../hooks/useDateNavigation';
import { mockData } from '../data/mockData';
import { aiAnalysisData } from '../data/aiAnalysisData';

export default function Stats() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const { currentDate, goToPrevDay, goToNextDay, canGoNext } = useDateNavigation('2025-12-16');

  // Daily Data for the List View
  const dailyData = mockData.dailyStats[currentDate];

  const categories = [
    { 
      id: 'heart', 
      label: '심박', 
      icon: Heart, 
      color: '#fda4af',
      data: dailyData ? [
        { label: '평균 심박수', value: `${dailyData.heartRate.avg} BPM` },
        { label: '표준 편차', value: `± ${dailyData.heartRate.stdDev}` }
      ] : []
    },
    { 
      id: 'variability', 
      label: '맥박변동률', 
      icon: Activity, 
      color: '#fda4af',
      data: dailyData ? [
        { label: '평균 변동률', value: `${dailyData.hrv.avg} ms` },
        { label: '표준 편차', value: `± ${dailyData.hrv.stdDev}` }
      ] : []
    },
    { 
      id: 'abnormal', 
      label: '비정상맥박', 
      icon: Zap, 
      color: '#fda4af',
      data: dailyData ? [
        { label: '전체 발생', value: `${dailyData.abnormalBeats}회` },
        { label: '시간별 데이터', value: '상세보기' }
      ] : []
    },
    { 
      id: 'stress', 
      label: '스트레스', 
      icon: Wind, 
      color: '#93c5fd',
      data: dailyData ? [
        { label: '평균 교감', value: `${dailyData.stress.sns.avg}` },
        { label: '평균 부교감', value: `${dailyData.stress.pns.avg}` }
      ] : []
    },
    { 
      id: 'calorie', 
      label: '칼로리', 
      icon: Flame, 
      color: '#fda4af',
      data: dailyData ? [
        { label: '소모 칼로리', value: `${dailyData.calories.consumed} kcal` },
        { label: '활동 칼로리', value: `${dailyData.calories.active} kcal` }
      ] : []
    },
    { 
      id: 'steps', 
      label: '걸음', 
      icon: Footprints, 
      color: '#fda4af',
      data: dailyData ? [
        { label: '걸음수', value: `${dailyData.steps} steps` },
        { label: '이동거리', value: '5.2 km' } // Mock if missing
      ] : []
    },
  ];

  return (
    <div className="p-4 pt-2 pb-24 flex flex-col gap-4 bg-gray-50 min-h-screen animate-fade-in relative">
      
      {/* Date Navigation (Moved to Top) */}
      <div className="flex items-center justify-between px-2 bg-white p-3 rounded-2xl shadow-sm border border-gray-100 mb-2 sticky top-2 z-10 transition-all">
          <button
            onClick={goToPrevDay}
            className="bg-gray-100 rounded-full p-2 text-gray-600 active:scale-95 transition-transform hover:bg-gray-200"
          >
            <ChevronLeft size={20}/>
          </button>
          <div className="flex items-center gap-2">
              <Calendar size={18} className="text-gray-500" />
              <span className="text-gray-700 font-bold text-md">
                {currentDate}
              </span>
          </div>
          <button
            onClick={goToNextDay}
            disabled={!canGoNext}
            className={cn(
              "bg-gray-100 rounded-full p-2 text-gray-600 active:scale-95 transition-transform",
              canGoNext ? "hover:bg-gray-200" : "opacity-30 cursor-not-allowed"
            )}
          >
            <ChevronRight size={20}/>
          </button>
      </div>

      {/* List Grid */}
      <div className="flex flex-col gap-3">
        {categories.map((cat) => (
          <div 
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 active:scale-[0.98] transition-all cursor-pointer hover:shadow-md"
          >
            <div className="flex items-center justify-between mb-3">
               <div className="flex items-center gap-2">
                 <div className={cn("p-2 rounded-full", cat.id === 'stress' ? "bg-blue-100 text-blue-500" : "bg-pink-100 text-pink-500")}>
                    <cat.icon size={20} fill="currentColor" className="opacity-80"/>
                 </div>
                 <span className="font-bold text-gray-700 text-md">{cat.label}</span>
               </div>
               <ChevronRight size={16} className="text-gray-300" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {dailyData ? (
                 cat.data.map((item, idx) => (
                    <div key={idx} className="flex flex-col">
                      <span className="text-xs text-gray-400 font-semibold mb-1">{item.label}</span>
                      <span className="text-sm font-bold text-gray-700">{item.value}</span>
                    </div>
                 ))
              ) : (
                <div className="col-span-2 text-center text-gray-300 text-xs py-2">데이터 없음</div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal Overlay */}
      {selectedCategory && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in">
           <DetailModal 
              category={selectedCategory} 
              onClose={() => setSelectedCategory(null)}
              currentDateStr={currentDate}
              categories={categories}
           />
        </div>
      )}

    </div>
  );
}

function DetailModal({ category, onClose, currentDateStr, categories }) {
  const [timePeriod, setTimePeriod] = useState('day');
  const [analysisStatus, setAnalysisStatus] = useState('idle'); // idle, loading, done
  
  const handleAnalyze = () => {
    if (analysisStatus === 'done' || analysisStatus === 'loading') return;
    setAnalysisStatus('loading');
    
    // Simulate API call delay
    setTimeout(() => {
        setAnalysisStatus('done');
    }, 2000);
  };
  
  const categoryInfo = categories.find(c => c.id === category);

  // Helper to fetch data based on timePeriod and category
  const getChartData = () => {
    const d = mockData.dailyStats[currentDateStr];
    // Mock week/month/year objects - ideally these come from a helper that handles keys dynamically
    const weekKey = '2025-12-01~2025-12-07';
    const monthKey = '2025-12';
    const yearKey = '2025';
    
    // Safely access data
    const w = mockData.weeklyStats[weekKey] || {};
    const m = mockData.monthlyStats[monthKey] || {};
    const y = mockData.yearlyStats[yearKey] || {};

    if (!d) return null; // Handle no data for day

    switch(category) {
        case 'heart':
            if (timePeriod === 'day') return { type: 'line', data: d.hourlyHeartRate, xKey: 'time', yKey: 'bpm', color: '#fda4af', domain: [0, 200], label: '심박수' };
            // Simple fallbacks for demo if data structure varies
            return { type: 'line', data: [], xKey: 'name', yKey: 'value', color: '#fda4af' };

        case 'variability':
            if (timePeriod === 'day') return { type: 'line', data: d.hourlyHRV, xKey: 'time', yKey: 'ms', color: '#fda4af', domain: [0, 100], label: 'HRV' };
            return { type: 'line', data: [], xKey: 'name', yKey: 'value', color: '#fda4af' };

        case 'stress':
             if (timePeriod === 'day') return { type: 'dual-line', data: d.hourlyStress, xKey: 'time', yKey1: 'sns', yKey2: 'pns', color1: '#fda4af', color2: '#93c5fd' };
             return { type: 'line', data: [], xKey: 'name', yKey: 'value', color: '#fda4af' };

        case 'abnormal':
            if (timePeriod === 'day') return { type: 'bar', data: d.hourlyAbnormal, xKey: 'name', yKey: 'count', color: '#fda4af', label: '비정상맥박' };
            if (timePeriod === 'week') return { type: 'bar', data: w.weeklyAbnormal || [], xKey: 'name', yKey: 'count', color: '#fda4af', label: '비정상맥박' };
            if (timePeriod === 'month') return { type: 'bar', data: m.dailyAbnormal || [], xKey: 'name', yKey: 'count', color: '#fda4af', label: '비정상맥박' };
            if (timePeriod === 'year') return { type: 'bar', data: y.monthlyAbnormal || [], xKey: 'name', yKey: 'count', color: '#fda4af', label: '비정상맥박' };
            return { type: 'bar', data: [], xKey: 'name', yKey: 'count', color: '#fda4af' };

        case 'calorie':
            if (timePeriod === 'day') return { type: 'dual-bar', data: d.hourlyCalories, xKey: 'name', yKey1: 'consumed', yKey2: 'active', color1: '#fda4af', color2: '#93c5fd' };
            if (timePeriod === 'week') return { type: 'dual-bar', data: w.weeklyCalories || [], xKey: 'name', yKey1: 'consumed', yKey2: 'active', color1: '#fda4af', color2: '#93c5fd' };
            if (timePeriod === 'month') return { type: 'dual-bar', data: m.dailyCalories || [], xKey: 'name', yKey1: 'consumed', yKey2: 'active', color1: '#fda4af', color2: '#93c5fd' };
            if (timePeriod === 'year') return { type: 'dual-bar', data: y.monthlyCalories || [], xKey: 'name', yKey1: 'consumed', yKey2: 'active', color1: '#fda4af', color2: '#93c5fd' };
            return { type: 'dual-bar', data: [], xKey: 'name', yKey1: 'value', yKey2: 'value', color1: '#fda4af', color2: '#93c5fd' };

        case 'steps':
            if (timePeriod === 'day') return { type: 'dual-bar', data: d.hourlySteps, xKey: 'name', yKey1: 'steps', yKey2: 'distance', color1: '#fda4af', color2: '#93c5fd' };
            if (timePeriod === 'week') return { type: 'dual-bar', data: w.weeklySteps || [], xKey: 'name', yKey1: 'steps', yKey2: 'distance', color1: '#fda4af', color2: '#93c5fd' };
            if (timePeriod === 'month') return { type: 'dual-bar', data: m.dailySteps || [], xKey: 'name', yKey1: 'steps', yKey2: 'distance', color1: '#fda4af', color2: '#93c5fd' };
            if (timePeriod === 'year') return { type: 'dual-bar', data: y.monthlySteps || [], xKey: 'name', yKey1: 'steps', yKey2: 'distance', color1: '#fda4af', color2: '#93c5fd' };
            return { type: 'dual-bar', data: [], xKey: 'name', yKey1: 'value', yKey2: 'value', color1: '#fda4af', color2: '#93c5fd' };

        default: return null;
    }
  };

  const chartData = getChartData();

  return (
    <div className="w-full h-[85vh] sm:h-[600px] sm:w-[500px] bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50/50">
            <div className="flex items-center gap-2">
                <div className={cn("p-2 rounded-full", category === 'stress' ? "bg-blue-100 text-blue-500" : "bg-pink-100 text-pink-500")}>
                    <categoryInfo.icon size={20} />
                </div>
                <h3 className="font-bold text-lg text-gray-800">{categoryInfo.label} 상세</h3>
            </div>
            <button onClick={onClose} className="p-2 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200 transition-colors">
                <X size={20} />
            </button>
        </div>

        {/* Time Tabs */}
        <div className="flex p-2 gap-2 border-b border-gray-100 bg-white">
            {['day', 'week', 'month', 'year'].map(p => (
                <button
                    key={p}
                    onClick={() => setTimePeriod(p)}
                    className={cn(
                        "flex-1 py-1.5 rounded-lg text-xs font-bold transition-all",
                        timePeriod === p ? "bg-gray-800 text-white shadow-md" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                    )}
                >
                    {p === 'day' ? '오늘' : p === 'week' ? '이번주' : p === 'month' ? '이번달' : '올해'}
                </button>
            ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50/30">
            {/* Chart Container */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 h-72 mb-4">
                {chartData && chartData.data && chartData.data.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                         {chartData.type === 'line' ? (
                            <LineChart data={chartData.data}>
                                <CartesianGrid vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey={chartData.xKey} axisLine={false} tickLine={false} fontSize={10} tick={{fill: '#94a3b8'}} />
                                <YAxis domain={chartData.domain} hide />
                                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                <Line type="monotone" dataKey={chartData.yKey} stroke={chartData.color} strokeWidth={3} dot={false} activeDot={{r:6, strokeWidth:0}} />
                            </LineChart>
                         ) : chartData.type === 'bar' ? (
                            <BarChart data={chartData.data}>
                                <CartesianGrid vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey={chartData.xKey} axisLine={false} tickLine={false} fontSize={10} tick={{fill: '#94a3b8'}} />
                                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                <Bar dataKey={chartData.yKey} fill={chartData.color} radius={[4,4,0,0]} barSize={30} />
                            </BarChart>
                         ) : chartData.type === 'dual-line' ? (
                             <LineChart data={chartData.data}>
                                <CartesianGrid vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey={chartData.xKey} axisLine={false} tickLine={false} fontSize={10} tick={{fill: '#94a3b8'}} />
                                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                <Line type="monotone" dataKey={chartData.yKey1} stroke={chartData.color1} strokeWidth={2} dot={false} />
                                <Line type="monotone" dataKey={chartData.yKey2} stroke={chartData.color2} strokeWidth={2} dot={false} />
                             </LineChart>
                         ) : chartData.type === 'dual-bar' ? (
                             <BarChart data={chartData.data}>
                                <CartesianGrid vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey={chartData.xKey} axisLine={false} tickLine={false} fontSize={10} tick={{fill: '#94a3b8'}} />
                                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                <Bar dataKey={chartData.yKey1} fill={chartData.color1} radius={[4,4,0,0]} barSize={20} />
                                <Bar dataKey={chartData.yKey2} fill={chartData.color2} radius={[4,4,0,0]} barSize={20} />
                             </BarChart>
                         ) : null}
                    </ResponsiveContainer>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-2">
                        <List size={30} className="opacity-20"/>
                        <span className="text-xs font-bold opacity-60">데이터가 없습니다</span>
                    </div>
                )}
            </div>

            {/* Additional Stats / context */}
            {/* AI Analysis Section */}
            <div 
                onClick={handleAnalyze}
                className={cn(
                    "bg-white p-5 rounded-2xl shadow-sm border border-gray-100 transition-all duration-300 relative overflow-hidden",
                    analysisStatus === 'idle' ? "cursor-pointer hover:shadow-md hover:border-blue-200 group" : ""
                )}
            >
                {/* Background Decor for AI feel */}
                {analysisStatus !== 'idle' && (
                     <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
                )}

                <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2 relative z-10">
                    {analysisStatus === 'loading' ? (
                        <Sparkles size={18} className="text-blue-500 animate-pulse" />
                    ) : (
                        <BrainCircuit size={18} className={cn("text-blue-500", analysisStatus === 'idle' ? "group-hover:text-blue-600 transition-colors" : "")} />
                    )}
                    AI 정밀 건강 분석
                    {analysisStatus === 'idle' && (
                        <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium ml-2">Beta</span>
                    )}
                </h4>

                <div className="relative z-10 min-h-[60px]">
                    {analysisStatus === 'idle' && (
                        <div className="flex flex-col gap-2">
                            <p className="text-sm text-gray-400 leading-relaxed">
                                현재 차트 데이터를 기반으로 AI가 건강 상태를 정밀 진단합니다.
                                클릭하여 분석 리포트를 생성해보세요.
                            </p>
                            <div className="flex justify-end mt-1">
                                <span className="text-xs font-semibold text-blue-500 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                                    분석 시작하기 <ChevronRight size={14}/>
                                </span>
                            </div>
                        </div>
                    )}

                    {analysisStatus === 'loading' && (
                        <div className="flex flex-col items-center justify-center py-6 gap-3 animate-fade-in">
                            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                            <span className="text-xs font-medium text-blue-500 animate-pulse">
                                데이터를 분석하고 있습니다...
                            </span>
                        </div>
                    )}

                    {analysisStatus === 'done' && aiAnalysisData[category] && (
                        <div className="flex flex-col gap-4 animate-scale-in">
                            
                            {/* Diagnosis */}
                            <div className="bg-blue-50/50 p-3 rounded-xl border border-blue-100">
                                <span className="text-xs font-bold text-blue-600 mb-1 block">🩺 진단 결과</span>
                                <p className="text-sm text-gray-700 leading-relaxed font-medium">
                                    {aiAnalysisData[category].diagnosis}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 gap-3">
                                {/* Risk */}
                                <div className="p-3 rounded-xl border border-orange-100 bg-orange-50/50">
                                    <span className="text-xs font-bold text-orange-600 mb-1 block">⚠️ 주의 및 위험 요인</span>
                                    <p className="text-xs text-gray-600 leading-normal">
                                        {aiAnalysisData[category].risk}
                                    </p>
                                </div>

                                {/* Tips */}
                                <div className="p-3 rounded-xl border border-green-100 bg-green-50/50">
                                    <span className="text-xs font-bold text-green-600 mb-2 block">💡 맞춤형 팁</span>
                                    <ul className="space-y-1.5">
                                        {aiAnalysisData[category].tips.map((tip, idx) => (
                                            <li key={idx} className="flex items-start gap-2 text-xs text-gray-600">
                                                <span className="text-green-500 mt-0.5">•</span>
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
        </div>
    </div>
  );
}
