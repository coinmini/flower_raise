import React, { useState, useRef } from 'react';
import { diagnosePlantIssue } from '../services/geminiService';
import { DiagnosisResult } from '../types';
import { IconCamera, IconFirstAid, IconArrowLeft } from './Icons';

interface PlantDoctorProps {
  onBack: () => void;
}

export const PlantDoctor: React.FC<PlantDoctorProps> = ({ onBack }) => {
  const [description, setDescription] = useState('');
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        // Remove data URL prefix (e.g., "data:image/jpeg;base64,")
        const base64Data = base64String.split(',')[1];
        setImageBase64(base64Data);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDiagnose = async () => {
    if (!description && !imageBase64) return;
    setLoading(true);
    setResult(null);
    const diagnosis = await diagnosePlantIssue(description, imageBase64 || undefined);
    setResult(diagnosis);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-stone-50 pb-12">
      <div className="bg-emerald-900 text-white p-6 pt-10 pb-16 relative">
        <button 
          onClick={onBack}
          className="absolute top-6 left-6 p-2 rounded-full hover:bg-white/10 transition-colors"
        >
          <IconArrowLeft className="w-6 h-6" />
        </button>
        <div className="container mx-auto max-w-2xl text-center">
            <div className="inline-block p-4 bg-emerald-800 rounded-full mb-4">
                <IconFirstAid className="w-8 h-8 text-emerald-300" />
            </div>
            <h1 className="text-3xl font-serif font-bold mb-2">AI 植得拯救</h1>
            <p className="text-emerald-200">上传照片或描述症状，AI 专家为您诊断。</p>
        </div>
      </div>

      <div className="container mx-auto max-w-2xl px-4 -mt-10 relative z-10">
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-stone-100">
            
            {/* Input Section */}
            <div className="space-y-6">
                
                {/* Image Upload */}
                <div>
                    <label className="block text-sm font-bold text-stone-700 mb-2">1. 上传照片 (可选)</label>
                    <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-stone-300 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-emerald-500 hover:bg-emerald-50 transition-colors group"
                    >
                        {imageBase64 ? (
                            <img src={`data:image/jpeg;base64,${imageBase64}`} alt="Uploaded" className="h-40 object-contain rounded" />
                        ) : (
                            <>
                                <IconCamera className="w-8 h-8 text-stone-400 group-hover:text-emerald-600 mb-2" />
                                <span className="text-stone-500 text-sm group-hover:text-emerald-700">点击上传照片</span>
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

                {/* Text Description */}
                <div>
                    <label className="block text-sm font-bold text-stone-700 mb-2">2. 症状描述</label>
                    <textarea 
                        className="w-full p-4 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none min-h-[120px]"
                        placeholder="例如：叶子边缘发黄，最近浇水比较多..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    ></textarea>
                </div>

                <button 
                    onClick={handleDiagnose}
                    disabled={loading || (!description && !imageBase64)}
                    className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all transform hover:scale-[1.02] ${loading || (!description && !imageBase64) ? 'bg-stone-300 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700'}`}
                >
                    {loading ? '正在诊断...' : '开始诊断'}
                </button>
            </div>

            {/* Results Section */}
            {result && (
                <div className="mt-10 pt-8 border-t border-stone-100 animate-fade-in">
                    <h3 className="text-xl font-bold text-stone-800 mb-6 flex items-center">
                        <span className="w-2 h-8 bg-emerald-500 rounded-full mr-3"></span>
                        诊断报告
                    </h3>
                    
                    <div className="space-y-6">
                        <div className="bg-red-50 p-5 rounded-lg border border-red-100">
                            <h4 className="font-bold text-red-800 mb-2 text-sm uppercase tracking-wide">问题诊断</h4>
                            <p className="text-red-900 font-medium text-lg">{result.diagnosis}</p>
                        </div>

                        <div className="bg-emerald-50 p-5 rounded-lg border border-emerald-100">
                            <h4 className="font-bold text-emerald-800 mb-2 text-sm uppercase tracking-wide">解决方案</h4>
                            <p className="text-emerald-900 leading-relaxed whitespace-pre-line">{result.solution}</p>
                        </div>

                        <div className="bg-blue-50 p-5 rounded-lg border border-blue-100">
                            <h4 className="font-bold text-blue-800 mb-2 text-sm uppercase tracking-wide">预防措施</h4>
                            <p className="text-blue-900 leading-relaxed">{result.prevention}</p>
                        </div>
                    </div>
                </div>
            )}

        </div>
      </div>
    </div>
  );
};
