import React, { useState } from 'react';
import BottomNav from './components/layout/BottomNav';
import Home from './pages/Home';
import Stats from './pages/Stats';
import Arrhythmia from './pages/Arrhythmia';
import Menu from './pages/Menu';

function App() {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 max-w-md mx-auto shadow-2xl overflow-hidden relative border-x border-gray-100">
      <main className="h-full min-h-screen relative">
        {activeTab === 'home' && <Home />}
        {activeTab === 'stats' && <Stats />}
        {activeTab === 'arrhythmia' && <Arrhythmia />}
        {activeTab === 'menu' && <Menu />}
      </main>
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}

export default App;
