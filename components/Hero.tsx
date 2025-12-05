import React, { useState } from 'react';
import { Copy, Users, Play, Snowflake } from 'lucide-react';

const Hero: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const ip = "play.axioncraft.himsey.com";

  const handleCopy = () => {
    navigator.clipboard.writeText(ip);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative pt-36 pb-20 overflow-hidden">
      {/* Background Banner */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-t from-void-950 via-void-950/60 to-transparent z-10"></div>
      </div>

      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          
          {/* Left: Content */}
          <div className="flex-1 text-center md:text-left space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-axion-ice/10 border border-axion-ice/30 text-axion-ice text-xs font-bold uppercase tracking-wider mb-2 animate-pulse">
              <Snowflake className="w-3 h-3" />
              Kış Sezonu Güncellemesi
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black italic text-white leading-tight drop-shadow-2xl">
              AXION <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-axion-ice to-axion-blue">CRAFT</span>
            </h1>
            
            <p className="text-lg text-gray-200 max-w-xl mx-auto md:mx-0 font-medium drop-shadow-lg">
              Türkiye'nin en gelişmiş Skyblock deneyimi kış temasıyla karşınızda! <br/>
              Boşlukta hayatta kal, adanı kur ve imparatorluğunu yönet.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start pt-4">
              <button 
                onClick={handleCopy}
                className="group relative px-8 py-4 bg-axion-blue hover:bg-axion-cyan text-white font-black text-lg rounded-xl transition-all shadow-lg shadow-axion-blue/25 flex items-center gap-3 transform hover:-translate-y-1 active:translate-y-0"
              >
                <Play className="fill-current w-5 h-5" />
                PLAY.AXIONCRAFT.HIMSEY.COM
                <div className="absolute -top-3 -right-3 bg-white text-void-900 text-xs font-bold px-2 py-1 rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {copied ? 'Kopyalandı!' : 'Kopyalamak için Tıkla'}
                </div>
              </button>
            </div>
          </div>

          {/* Right: Feature Image */}
          <div className="hidden lg:block relative w-[500px] h-[500px]">
             {/* Floating elements effect */}
             <div className="absolute inset-0 bg-gradient-to-br from-axion-blue/20 to-axion-ice/5 rounded-full blur-[80px]"></div>
             
             {/* Custom Image Provided by User */}
             <img 
              src="https://media.discordapp.net/attachments/1428057140039520412/1444673403574550669/image.png?ex=692d9074&is=692c3ef4&hm=d4b32db44ca26b7ca0a50c17ffffb722b2666f020c02e7a33cd3ab4c77bc4263&=&format=webp&quality=lossless" 
              alt="Axion Craft Artwork"
              className="relative z-10 w-full h-full object-contain drop-shadow-2xl transform hover:scale-105 transition-transform duration-500 rounded-2xl" 
             />
          </div>

        </div>
      </div>
    </div>
  );
};

export default Hero;