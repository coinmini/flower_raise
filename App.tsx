import React, { useState, useEffect } from 'react';
import { AppView, SearchResult } from './types';
import { searchPlants } from './services/geminiService';
import { PlantCard } from './components/PlantCard';
import { PlantDetail } from './components/PlantDetail';
import { PlantDoctor } from './components/PlantDoctor';
import { PlantIdentifier } from './components/PlantIdentifier';
import { IconSearch, IconSprout, IconFirstAid, IconScan } from './components/Icons';

// Default suggestions to avoid empty state
const DEFAULT_PLANTS: SearchResult[] = [
  { name: "龟背竹", scientificName: "Monstera deliciosa", shortDescription: "热带风情，叶片独特，适合室内散射光环境，非常受欢迎的网红植物。" },
  { name: "虎尾兰", scientificName: "Sansevieria trifasciata", shortDescription: "极强的空气净化能力，耐阴耐旱，非常适合懒人养护。" },
  { name: "琴叶榕", scientificName: "Ficus lyrata", shortDescription: "叶片如提琴般优美，植株高大挺拔，是提升家居格调的利器。" },
  { name: "绿萝", scientificName: "Epipremnum aureum", shortDescription: "生命力顽强，遇水即活，是新手入门的最佳选择。" },
];

export default function App() {
  const [view, setView] = useState<AppView>(AppView.HOME);
  const [searchQuery, setSearchQuery] = useState('');
  const [plants, setPlants] = useState<SearchResult[]>(DEFAULT_PLANTS);
  const [selectedPlantName, setSelectedPlantName] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!searchQuery.trim()) {
      setPlants(DEFAULT_PLANTS);
      return;
    }
    
    setIsSearching(true);
    const results = await searchPlants(searchQuery);
    setPlants(results);
    setIsSearching(false);
  };

  const handlePlantClick = (name: string) => {
    setSelectedPlantName(name);
    setView(AppView.DETAIL);
  };

  const goHome = () => {
    setView(AppView.HOME);
    setSelectedPlantName(null);
  };

  // Render Views
  if (view === AppView.DETAIL && selectedPlantName) {
    return <PlantDetail plantName={selectedPlantName} onBack={goHome} />;
  }

  if (view === AppView.DOCTOR) {
    return <PlantDoctor onBack={goHome} />;
  }

  if (view === AppView.IDENTIFY) {
    return (
      <PlantIdentifier 
        onBack={goHome} 
        onPlantFound={(name) => {
          setSelectedPlantName(name);
          setView(AppView.DETAIL);
        }} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-800">
      {/* Hero Section */}
      <div className="relative bg-emerald-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1463320726281-696a485928c7?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-emerald-900/90" />
        
        <div className="container mx-auto px-6 py-20 md:py-32 relative z-10 flex flex-col items-center text-center">
          <span className="text-emerald-300 font-serif italic text-lg mb-4 tracking-wider animate-fade-in-up">GreenSpace Encyclopedia</span>
          <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6 leading-tight animate-fade-in-up delay-100">
            打造您的 <br className="md:hidden" /> <span className="text-emerald-400">室内森林</span>
          </h1>
          <p className="text-lg md:text-xl text-stone-200 max-w-2xl mb-10 animate-fade-in-up delay-200">
            探索数千种室内植物的养护指南，或使用 AI 专家诊断植物健康问题。
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="w-full max-w-xl relative animate-fade-in-up delay-300">
            <input 
              type="text" 
              placeholder="搜索植物名称 (例如: 龟背竹, 仙人掌...)" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-4 pl-6 pr-14 rounded-full text-stone-800 focus:outline-none focus:ring-4 focus:ring-emerald-500/30 shadow-2xl"
            />
            <button 
              type="submit"
              className="absolute right-2 top-2 p-2 bg-emerald-600 rounded-full hover:bg-emerald-500 transition-colors text-white"
            >
              <IconSearch className="w-6 h-6" />
            </button>
          </form>

          {/* Quick Action Buttons */}
          <div className="mt-8 flex flex-wrap justify-center gap-4 animate-fade-in-up delay-500">
             <button 
              onClick={() => setView(AppView.IDENTIFY)}
              className="flex items-center gap-2 bg-emerald-500 text-white border border-emerald-400 px-6 py-3 rounded-full hover:bg-emerald-400 shadow-lg shadow-emerald-900/50 transition-all font-bold transform hover:-translate-y-1"
            >
              <IconScan className="w-5 h-5" />
              <span>拍照识花</span>
            </button>
             <button 
              onClick={() => setView(AppView.DOCTOR)}
              className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 px-6 py-3 rounded-full hover:bg-white/20 transition-all font-medium"
            >
              <IconFirstAid className="w-5 h-5 text-red-300" />
              <span>植物急救</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container mx-auto px-6 py-12">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-serif font-bold text-stone-800">
              {searchQuery ? '搜索结果' : '热门植物'}
            </h2>
            <p className="text-stone-500 mt-2">
              {searchQuery ? `关于 "${searchQuery}" 的植物` : '为您精选的室内绿植'}
            </p>
          </div>
          {searchQuery && (
             <button onClick={() => { setSearchQuery(''); handleSearch(); }} className="text-emerald-600 hover:text-emerald-700 text-sm font-medium">
               清除搜索
             </button>
          )}
        </div>

        {/* Plant Grid */}
        {isSearching ? (
          <div className="flex justify-center py-20">
             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {plants.map((plant, index) => (
              <PlantCard 
                key={index} 
                plant={plant} 
                onClick={() => handlePlantClick(plant.name)} 
              />
            ))}
          </div>
        )}
        
        {plants.length === 0 && !isSearching && (
          <div className="text-center py-20 text-stone-500">
            <p>未找到相关植物，请尝试其他关键词。</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-stone-100 py-12 border-t border-stone-200 mt-12">
        <div className="container mx-auto px-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-4 text-emerald-800 font-serif font-bold text-xl">
                <IconSprout className="w-6 h-6" />
                <span>GreenSpace</span>
            </div>
          <p className="text-stone-500 text-sm">© 2024 GreenSpace Encyclopedia. Powered by Google Gemini.</p>
        </div>
      </footer>
    </div>
  );
}
