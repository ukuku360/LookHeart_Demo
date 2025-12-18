
import { mockData } from '../data/mockData';

export const getChartData = (category, timePeriod, currentDateStr) => {
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
