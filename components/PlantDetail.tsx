import React, { useEffect, useState } from 'react';
import { PlantData } from '../types';
import { getPlantDetails } from '../services/geminiService';
import { IconSun, IconWater, IconThermometer, IconWind, IconSprout, IconArrowLeft } from './Icons';

interface PlantDetailProps {
  plantName: string;
  onBack: () => void;
}

export const PlantDetail: React.FC<PlantDetailProps> = ({ plantName, onBack }) => {
  const [data, setData] = useState<PlantData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const result = await getPlantDetails(plantName);
      setData(result);
      setLoading(false);
    };
    fetchData();
  }, [plantName]);

  const imageUrl = `https://picsum.photos/seed/${plantName.replace(/\s/g, '')}/800/600`;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col bg-stone-50">
        <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mb-4"></div>
        <p className="text-stone-500 animate-pulse">正在生成植物百科数据...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col p-8 text-center">
        <p className="text-red-500 mb-4">无法获取数据，请稍后重试。</p>
        <button onClick={onBack} className="text-stone-600 underline">返回</button>
      </div>
    );
  }

  return (
    <div className="bg-stone-50 min-h-screen pb-12 animate-fade-in">
      {/* Header Image */}
      <div className="relative h-[40vh] md:h-[50vh]">
        <img src={imageUrl} alt={data.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/30"></div>
        <button 
          onClick={onBack}
          className="absolute top-6 left-6 bg-white/20 backdrop-blur-md hover:bg-white/30 text-white p-2 rounded-full transition-all"
        >
          <IconArrowLeft className="w-6 h-6" />
        </button>
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 bg-gradient-to-t from-black/80 to-transparent text-white">
          <div className="container mx-auto max-w-4xl">
            <span className="inline-block px-3 py-1 bg-green-600 rounded-full text-xs font-bold tracking-wider uppercase mb-3">
              {data.difficulty} Care
            </span>
            <h1 className="text-4xl md:text-6xl font-serif font-bold mb-2">{data.name}</h1>
            <p className="text-lg md:text-xl opacity-90 italic font-serif">{data.scientificName}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto max-w-4xl px-4 md:px-6 -mt-8 relative z-10">
        
        {/* Intro Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10 mb-8 border border-stone-100">
          <h2 className="text-2xl font-bold text-stone-800 mb-4 font-serif">关于植物</h2>
          <p className="text-stone-600 leading-relaxed text-lg">{data.description}</p>
          
          <div className="flex flex-wrap gap-2 mt-6">
            {data.tags.map(tag => (
              <span key={tag} className="px-3 py-1 bg-stone-100 text-stone-600 rounded-full text-sm">#{tag}</span>
            ))}
          </div>
        </div>

        {/* Care Grid */}
        <h2 className="text-2xl font-bold text-stone-800 mb-6 font-serif px-2">养护指南</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          
          <CareCard 
            icon={<IconSun className="w-6 h-6 text-amber-500" />}
            title="光照"
            description={data.care.light}
            bgColor="bg-amber-50"
          />
          <CareCard 
            icon={<IconWater className="w-6 h-6 text-blue-500" />}
            title="浇水"
            description={data.care.water}
            bgColor="bg-blue-50"
          />
          <CareCard 
            icon={<IconThermometer className="w-6 h-6 text-red-400" />}
            title="温度"
            description={data.care.temperature}
            bgColor="bg-red-50"
          />
          <CareCard 
            icon={<IconWind className="w-6 h-6 text-slate-400" />}
            title="湿度"
            description={data.care.humidity}
            bgColor="bg-slate-50"
          />
          <CareCard 
            icon={<IconSprout className="w-6 h-6 text-emerald-600" />}
            title="土壤 & 施肥"
            description={`${data.care.soil} ${data.care.fertilizer}`}
            bgColor="bg-emerald-50"
            className="md:col-span-2"
          />

        </div>

      </div>
    </div>
  );
};

const CareCard = ({ icon, title, description, bgColor, className = "" }: any) => (
  <div className={`p-6 rounded-xl border border-stone-100 ${bgColor} ${className} flex items-start gap-4 transition-all hover:shadow-md`}>
    <div className="p-3 bg-white rounded-full shadow-sm shrink-0">
      {icon}
    </div>
    <div>
      <h3 className="font-bold text-stone-800 mb-1">{title}</h3>
      <p className="text-stone-600 text-sm leading-relaxed">{description}</p>
    </div>
  </div>
);
