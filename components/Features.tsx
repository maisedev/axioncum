import React from 'react';
import { Pickaxe, Coins, Sword, Castle, Zap, Crown } from 'lucide-react';
import { Feature } from '../types';

const Features: React.FC = () => {
  const features: Feature[] = [
    {
      title: "Void Minyonları",
      description: "Yükseltilebilir minyonlarla kaynak toplama işlemini otomatikleştirin.",
      icon: <Pickaxe className="w-6 h-6 text-axion-cyan" />
    },
    {
      title: "Oyuncu Ekonomisi",
      description: "İhale evinde güvenle ticaret yapın veya kendi marketinizi kurun.",
      icon: <Coins className="w-6 h-6 text-yellow-400" />
    },
    {
      title: "Özel Büyüler",
      description: "Keşfedilecek ve ustalaşılacak 150'den fazla özel büyü.",
      icon: <Zap className="w-6 h-6 text-purple-400" />
    },
    {
      title: "Ada Yükseltmeleri",
      description: "/is menüsü aracılığıyla ada sınırlarınızı ve üye limitlerini genişletin.",
      icon: <Castle className="w-6 h-6 text-green-400" />
    },
    {
      title: "Zindanlar",
      description: "Efsanevi ganimetler için özel yaratık dalgalarıyla savaşın.",
      icon: <Sword className="w-6 h-6 text-red-400" />
    },
    {
      title: "Turnuvalar",
      description: "Gerçek ödüller için ada değeri veya tarım yarışmalarında yarışın.",
      icon: <Crown className="w-6 h-6 text-orange-400" />
    }
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2 border-l-4 border-axion-purple pl-3">
          Oyun Özellikleri
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {features.map((feature, index) => (
          <div 
            key={index}
            className="group glass-card p-6 rounded-xl hover:bg-void-800 transition-all duration-300 flex items-start gap-4"
          >
            <div className="bg-void-900 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
              {feature.icon}
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-1 group-hover:text-axion-cyan transition-colors">
                {feature.title}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Features;