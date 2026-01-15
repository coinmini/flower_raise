import React, { useState, useRef } from 'react';
import { identifyPlant } from '../services/geminiService';
import { SearchResult } from '../types';
import { IconCamera, IconScan, IconArrowLeft } from './Icons';
import { PlantCard } from './PlantCard';

interface PlantIdentifierProps {
  onBack: () => void;
  onPlantFound: (name: string) => void;
}

export const PlantIdentifier: React.FC<PlantIdentifierProps> = ({ onBack, onPlantFound }) => {
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SearchResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        // Remove data URL prefix
        const base64Data = base64String.split(',')[1];
        setImageBase64(base64Data);
        setResult(null); // Reset result on new upload
      };
      reader.readAsDataURL(file);
    }
  };

  const handleIdentify = async () => {
    if (!imageBase64) return;
    setLoading(true);
    setResult(null);
    const identifiedPlant = await identifyPlant(imageBase64);
    
    // Inject the uploaded image into the result so the card shows the actual photo
    if (identifiedPlant) {
       identifiedPlant.imageUrl = `data:image/jpeg;base64,${imageBase64}`;
    }
    
    setResult(identifiedPlant);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-stone-50 pb-12">
      <div className="bg-blue-900 text-white p-6 pt-10 pb-16 relative">
        <button 
          onClick={onBack}
          className="absolute top-6 left-6 p-2 rounded-full hover:bg-white/10 transition-colors"
        >
          <IconArrowLeft className="w-6 h-6" />
        </button>
        <div className="container mx-auto max-w-2xl text-center">
            <div className="inline-block p-4 bg-blue-800 rounded-full mb-4">
                <IconScan className="w-8 h-8 text-blue-300" />
            </div>
            <h1 className="text-3xl font-serif font-bold mb-2">拍照识花</h1>
            <p className="text-blue-200">上传植物照片，AI 立即告诉您它的名字和习性。</p>
        </div>
      </div>

      <div className="container mx-auto max-w-2xl px-4 -mt-10 relative z-10">
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-stone-100">
            
            {/* Input Section */}
            <div className="space-y-6">
                
                {/* Image Upload */}
                <div>
                    <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-stone-300 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors group min-h-[300px]"
                    >
                        {imageBase64 ? (
                            <img src={`data:image/jpeg;base64,${imageBase64}`} alt="Uploaded" className="h-64 object-contain rounded shadow-sm" />
                        ) : (
                            <>
                                <IconCamera className="w-12 h-12 text-stone-300 group-hover:text-blue-600 mb-4" />
                                <span className="text-stone-500 font-medium group-hover:text-blue-700">点击上传植物照片</span>
                            </>
                        )}
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            className="hidden" 
                            accept="image/*"
                            onChange={handleImageUpload} 
                        />
                    </div>
                </div>

                <button 
                    onClick={handleIdentify}
                    disabled={loading || !imageBase64}
                    className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all transform hover:scale-[1.02] ${loading || !imageBase64 ? 'bg-stone-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                >
                    {loading ? '正在识别...' : '开始识别'}
                </button>
            </div>

            {/* Results Section */}
            {result && (
                <div className="mt-10 pt-8 border-t border-stone-100 animate-fade-in">
                    <h3 className="text-xl font-bold text-stone-800 mb-6 flex items-center">
                        <span className="w-2 h-8 bg-blue-500 rounded-full mr-3"></span>
                        识别结果
                    </h3>
                    
                    <div className="max-w-sm mx-auto">
                        <PlantCard 
                            plant={result} 
                            onClick={() => onPlantFound(result.name)}
                        />
                        <p className="text-center text-sm text-stone-500 mt-4">点击卡片查看详细百科</p>
                    </div>
                </div>
            )}
            
            {!loading && !result && imageBase64 && (
                 // Placeholder helper text when image is uploaded but not processed
                 <p className="text-center text-stone-400 text-sm mt-4">点击"开始识别"按钮进行分析</p>
            )}

        </div>
      </div>
    </div>
  );
};
