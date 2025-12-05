import React from 'react';
import { Hammer, Snowflake } from 'lucide-react';

const News: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2 border-l-4 border-axion-cyan pl-3">
          Son Haberler
        </h2>
      </div>

      <div className="glass-card rounded-xl p-12 text-center border-2 border-dashed border-white/10 flex flex-col items-center justify-center bg-void-900/50">
        <div className="w-20 h-20 bg-void-800 rounded-full flex items-center justify-center mb-4 animate-pulse">
            <Hammer className="w-10 h-10 text-axion-cyan" />
        </div>
        <h3 className="text-2xl font-black text-white mb-2">SUNUCU KODLANMAKTADIR</h3>
        <p className="text-gray-400 max-w-md mx-auto">
            Axion Craft geliştirici ekibi şu anda sunucuyu sizler için mükemmel hale getirmek için çalışıyor. <br/>
            Kış sezonu yakında başlıyor!
        </p>
        <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-axion-ice/10 text-axion-ice text-sm font-bold">
            <Snowflake className="w-4 h-4 animate-spin-slow" />
            Çok Yakında
        </div>
      </div>
    </div>
  );
};

export default News;