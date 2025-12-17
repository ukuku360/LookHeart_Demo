import React, { useState, useEffect, useCallback } from 'react';
import { Sparkles, ChevronRight, ChevronDown, Heart, Zap, Footprints, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';
import { cn } from '../../lib/utils';
import { generateDailyInsight } from '../../services/aiInsightService';

export default function AIInsightCard({ dailyData }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [insight, setInsight] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadInsight = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await generateDailyInsight(dailyData);
      setInsight(result);
    } catch (error) {
      console.error('Failed to load insight:', error);
    } finally {
      setIsLoading(false);
    }
  }, [dailyData]);

  useEffect(() => {
    loadInsight();
  }, [loadInsight]);

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center animate-pulse">
            <Sparkles size={20} className="text-gray-300" />
          </div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-100 rounded w-1/3 animate-pulse"></div>
            <div className="h-4 bg-gray-50 rounded w-3/4 animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!insight) return null;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm transition-all duration-300 overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-5 flex items-start gap-4 text-left hover:bg-gray-50/50 transition-colors"
      >
        <div className="mt-1">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-xl">
                {insight.emoji}
            </div>
        </div>

        <div className="flex-1 min-w-0 pt-0.5">
          <div className="flex items-center justify-between mb-1">
             <span className="text-xs font-bold text-blue-500 uppercase tracking-wider">AI Insight</span>
             {insight.score !== undefined && (
                <span className="text-xs font-bold text-gray-400">
                    건강점수 <span className="text-gray-900 text-sm ml-1">{insight.score}</span>
                </span>
             )}
          </div>
          <h3 className="text-base font-bold text-gray-800 leading-snug pr-4">
            {insight.summary}
          </h3>
        </div>

        <div className="mt-1 text-gray-400">
          {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
        </div>
      </button>

      {/* Expanded Content */}
      {isExpanded && insight.details && (
        <div className="px-5 pb-5 pt-0 animate-fade-in relative z-10">
          <div className="h-px w-full bg-gray-100 mb-5"></div>

          <div className="space-y-6">
            {/* Analysis Points */}
            <div className="grid gap-4">
                {insight.details.positives?.length > 0 && (
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 uppercase tracking-wide opacity-80">
                            <CheckCircle2 size={12} />
                            <span>Good Points</span>
                        </div>
                        <ul className="space-y-1.5 pl-1">
                            {insight.details.positives.map((item, idx) => (
                                <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                                    <span className="block w-1 h-1 rounded-full bg-emerald-400 mt-2 flex-shrink-0"></span>
                                    <span className="leading-relaxed">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {insight.details.concerns?.length > 0 && (
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-xs font-bold text-amber-600 uppercase tracking-wide opacity-80">
                            <AlertCircle size={12} />
                            <span>Attention Needed</span>
                        </div>
                         <ul className="space-y-1.5 pl-1">
                            {insight.details.concerns.map((item, idx) => (
                                <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                                    <span className="block w-1 h-1 rounded-full bg-amber-400 mt-2 flex-shrink-0"></span>
                                    <span className="leading-relaxed">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            {/* Recommendation */}
            {insight.details.recommendation && (
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <p className="text-sm text-gray-700 leading-relaxed font-medium">
                        "{insight.details.recommendation}"
                    </p>
                </div>
            )}

            {/* Key Metrics */}
            {insight.details.metrics && (
                <div className="grid grid-cols-3 gap-3 pt-2">
                 <MetricBadge 
                    label="심박수" 
                    value={insight.details.metrics.heartRate} 
                    unit="bpm"
                 />
                 <MetricBadge 
                    label="비정상" 
                    value={insight.details.metrics.abnormalBeats} 
                    unit="회"
                    isAlert={insight.details.metrics.abnormalBeats > 0}
                 />
                 <MetricBadge 
                    label="걸음수" 
                    value={Math.round(insight.details.metrics.steps / 1000) + 'k'} 
                    unit="걸음"
                 />
                </div>
            )}
          </div>

          <div className="mt-6 flex justify-end">
            <button 
                onClick={(e) => {
                  e.stopPropagation();
                  loadInsight();
                }}
                className="text-xs font-medium text-gray-400 hover:text-gray-600 flex items-center gap-1.5 transition-colors"
            >
                <RefreshCw size={12} />
                <span>업데이트</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function MetricBadge({ label, value, unit, isAlert }) {
  return (
    <div className={cn(
        "flex flex-col items-center justify-center p-2.5 rounded-xl border transition-colors",
        isAlert 
            ? "bg-rose-50 border-rose-100 text-rose-600" 
            : "bg-white border-gray-100 text-gray-600"
    )}>
      <span className={cn("text-lg font-bold", isAlert ? "text-rose-600" : "text-gray-800")}>
        {value}
      </span>
      <span className="text-[10px] text-gray-400 mt-0.5">{label}</span>
    </div>
  );
}
