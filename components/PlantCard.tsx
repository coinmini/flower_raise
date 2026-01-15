import React from 'react';
import { SearchResult } from '../types';

interface PlantCardProps {
  plant: SearchResult;
  onClick: () => void;
}

export const PlantCard: React.FC<PlantCardProps> = ({ plant, onClick }) => {
  // Use a deterministic-like random image if not provided
  const imageUrl = plant.imageUrl || `https://picsum.photos/seed/${plant.name.replace(/\s/g, '')}/400/300`;

  return (
    <div 
      onClick={onClick}
      className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden border border-stone-100 flex flex-col h-full"
    >
      <div className="relative h-48 overflow-hidden">
        <img 
          src={imageUrl} 
          alt={plant.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="text-xl font-bold text-stone-800 font-serif mb-1">{plant.name}</h3>
        <p className="text-xs text-stone-500 italic mb-3 font-serif">{plant.scientificName}</p>
        <p className="text-sm text-stone-600 line-clamp-3">{plant.shortDescription}</p>
        
        <div className="mt-auto pt-4 flex items-center text-green-700 font-medium text-sm group-hover:text-green-600">
          <span>查看详情</span>
          <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </div>
      </div>
    </div>
  );
};
