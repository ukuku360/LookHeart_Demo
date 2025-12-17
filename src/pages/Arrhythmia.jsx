import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar, BarChart2 } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, YAxis, CartesianGrid } from 'recharts';
import { useDateNavigation } from '../hooks/useDateNavigation';
import { getECGWaveform } from '../data/ecgWaveforms';
import ECGModal from '../components/modals/ECGModal';

export default function Arrhythmia() {
  const { currentDate, goToPrevDay, goToNextDay, canGoNext } = useDateNavigation('2025-12-04');
  const [selectedEvent, setSelectedEvent] = useState({ id: 338, time: '16시 10분 57초' });
  const [showECGModal, setShowECGModal] = useState(false);

  // Get ECG data for selected event
  const ecgData = getECGWaveform(selectedEvent?.id || 338);

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setShowECGModal(true);
  };

  return (
    <div className="p-4 pt-4 pb-24 flex flex-col gap-4 bg-gray-50 min-h-screen animate-fade-in">
      {/* Chart Area */}
      <div className="bg-white rounded-2xl border-2 border-gray-300 p-2 relative h-64 shadow-sm overflow-hidden">
         {/* Top Controls */}
         <div className="absolute top-2 right-2 flex gap-1 z-10">
             <button className="bg-gray-200 text-gray-600 text-[10px] px-3 py-1 rounded font-bold hover:bg-gray-300">활동</button>
             <button className="bg-gray-500 text-white text-[10px] px-3 py-1 rounded font-bold shadow-sm">비정상 맥박</button>
         </div>
         
         {/* Chart */}
         <div className="w-full h-full pt-8 pb-4 pl-1 pr-1">
             <ResponsiveContainer width="100%" height="100%">
                <LineChart data={ecgData}>
                    <CartesianGrid vertical={false} stroke="#e2e8f0" />
                    <YAxis hide domain={[0, 150]} />
                    <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={1.5} dot={false} isAnimationActive={false} />
                </LineChart>
             </ResponsiveContainer>
         </div>

         {/* Bottom Right Icon */}
         <div className="absolute bottom-2 right-2">
             <div className="bg-rose-300 rounded-md p-1.5 text-white shadow-sm">
                 <BarChart2 size={16} /> 
             </div>
         </div>
      </div>

      {/* Date Navigation */}
      <div className="flex items-center justify-between p-2">
          <button
            onClick={goToPrevDay}
            className="bg-gray-600 rounded-full p-1.5 text-white shadow-md active:scale-95 transition-transform hover:bg-gray-700"
          >
              <ChevronLeft size={20} />
          </button>
          <div className="flex items-center gap-2 bg-gray-200/50 px-4 py-1.5 rounded-full border border-gray-200">
              <Calendar size={18} className="text-gray-600" />
              <span className="text-gray-700 font-bold text-sm">{currentDate}</span>
          </div>
          <button
            onClick={goToNextDay}
            disabled={!canGoNext}
            className={`bg-gray-600 rounded-full p-1.5 text-white shadow-md active:scale-95 transition-transform ${canGoNext ? 'hover:bg-gray-700' : 'opacity-50 cursor-not-allowed'}`}
          >
              <ChevronRight size={20} />
          </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex bg-white rounded-xl p-1 border border-gray-300 shadow-sm relative z-0">
          {/* Connecting lines decoration logic is complex, simpler to use standard tabs */}
          {['전체', '종류', '상태', '시간'].map((tab, idx) => (
              <button 
                key={tab} 
                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${idx === 0 ? 'bg-gray-600 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-100'}`}
              >
                  {tab}
              </button>
          ))}
      </div>

      {/* List */}
      <div className="flex flex-col gap-2.5">
          <ListItem id="338" time="16시 10분 57초" active onClick={() => handleEventClick({ id: 338, time: '16시 10분 57초' })} />
          <ListItem id="337" time="14시 25분 36초" onClick={() => handleEventClick({ id: 337, time: '14시 25분 36초' })} />
          <ListItem id="336" time="14시 25분 24초" onClick={() => handleEventClick({ id: 336, time: '14시 25분 24초' })} />
          <ListItem id="335" time="14시 25분 18초" onClick={() => handleEventClick({ id: 335, time: '14시 25분 18초' })} />
          <ListItem id="334" time="14시 24분 58초" onClick={() => handleEventClick({ id: 334, time: '14시 24분 58초' })} />
      </div>

      {/* ECG Modal */}
      <ECGModal
        isOpen={showECGModal}
        onClose={() => setShowECGModal(false)}
        event={selectedEvent}
        currentDate={currentDate}
      />
    </div>
  );
}

function ListItem({ id, time, active, onClick }) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-2 bg-white rounded-xl p-1 pr-4 border shadow-sm transition-all w-full hover:shadow-md ${active ? 'border-rose-300 ring-1 ring-rose-100' : 'border-gray-200'}`}
        >
             <div className={`w-14 h-11 flex items-center justify-center rounded-lg font-bold text-white shadow-sm transition-colors ${active ? 'bg-rose-300' : 'bg-gray-300 text-gray-500/80 bg-gray-200'}`}>
                 {id}
             </div>
             <div className="flex-1 text-center font-bold text-gray-600 text-sm">
                 {time}
             </div>
        </button>
    )
}
