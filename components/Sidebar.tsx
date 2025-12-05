import React, { useEffect, useState } from 'react';
import { Server, MessageCircle, UserPlus, Code, Snowflake, AlertCircle, WifiOff, Loader2 } from 'lucide-react';

interface SidebarProps {
  recentRegistrations: { name: string; time: string; avatar: string }[];
}

const Sidebar: React.FC<SidebarProps> = ({ recentRegistrations }) => {
  const discordLink = "https://discord.gg/MwGcF5dMtH";
  const developer = {
      name: "Jexa and Maise",
      id: "1402290595501834301",
      image: "https://media.discordapp.net/attachments/1427615471984971870/1444652278798880799/fda1fa75500a91dfb236397882d40249.jpg?ex=692d7cc7&is=692c2b47&hm=fca966e6ea088bb96933bd863eb4e0046ec8950c053bcdad052415e41a984338&=&format=webp"
  };

  const [serverStatus, setServerStatus] = useState<{
    online: boolean;
    players: number;
    max: number;
    loading: boolean;
  }>({
    online: false,
    players: 0,
    max: 0,
    loading: true
  });

  useEffect(() => {
    const fetchServerStatus = async () => {
        try {
            // Using a public API to fetch server status
            const response = await fetch('https://api.mcsrvstat.us/2/play.axioncraft.himsey.com');
            const data = await response.json();
            
            setServerStatus({
                online: data.online,
                players: data.online ? data.players.online : 0,
                max: data.online ? data.players.max : 2000,
                loading: false
            });
        } catch (error) {
            console.error("Failed to fetch server status", error);
            setServerStatus(prev => ({ ...prev, online: false, loading: false }));
        }
    };

    fetchServerStatus();
    // Refresh every 60 seconds
    const interval = setInterval(fetchServerStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8">
      
      {/* Server Status Widget - Real Data */}
      <div className="glass-card rounded-xl p-6 border-t-4 border-t-axion-ice relative overflow-hidden group">
        <div className="absolute -right-6 -top-6 text-axion-ice/5 group-hover:text-axion-ice/10 transition-colors duration-500 transform group-hover:rotate-12">
          <Server className="w-40 h-40" />
        </div>
        <div className="absolute top-2 right-2 animate-pulse">
            <Snowflake className="w-5 h-5 text-axion-ice opacity-50" />
        </div>

        <h3 className="text-lg font-bold text-white mb-1 relative z-10">Sunucu Durumu</h3>
        <p className="text-gray-400 text-xs mb-4 relative z-10">play.axioncraft.himsey.com</p>
        
        <div className="space-y-3 relative z-10">
          {serverStatus.loading ? (
             <div className="flex items-center gap-2 text-gray-400">
                <Loader2 className="w-4 h-4 animate-spin" /> Veriler yükleniyor...
             </div>
          ) : serverStatus.online ? (
              <>
                <div className="flex justify-between items-end mb-1">
                    <span className="text-green-400 font-bold text-sm uppercase flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        Çevrimiçi
                    </span>
                    <span className="text-white font-mono text-xl font-bold">{serverStatus.players}<span className="text-gray-500 text-sm">/{serverStatus.max}</span></span>
                </div>
                <div className="w-full bg-void-800 rounded-full h-2.5 overflow-hidden border border-white/5">
                    <div 
                        className="bg-gradient-to-r from-axion-blue to-axion-ice h-2.5 rounded-full transition-all duration-1000" 
                        style={{ width: `${(serverStatus.players / serverStatus.max) * 100}%` }}
                    ></div>
                </div>
              </>
          ) : (
              <div className="flex flex-col items-center justify-center py-2 text-red-400 gap-2">
                 <WifiOff className="w-8 h-8 opacity-50" />
                 <span className="font-bold">Sunucu Çevrimdışı</span>
              </div>
          )}
        </div>
      </div>

      {/* Discord Widget */}
      <div className="glass-card rounded-xl p-6 border-t-4 border-t-[#5865F2] hover:shadow-lg hover:shadow-[#5865F2]/10 transition-all">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-[#5865F2]" /> Discord
          </h3>
          <div className="bg-[#5865F2]/20 text-[#5865F2] text-xs font-bold px-2 py-1 rounded">
            Aktif
          </div>
        </div>
        <p className="text-gray-400 text-sm mb-4">Topluluğumuza katıl, çekilişleri kaçırma ve destek al.</p>
        <button 
          onClick={() => window.open(discordLink, '_blank')}
          className="w-full bg-[#5865F2] hover:bg-[#4752c4] text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          Sunucuya Katıl
        </button>
      </div>

      {/* Recent Registrations - REAL DATA ONLY */}
      <div className="glass-card rounded-xl p-0 overflow-hidden border-t-4 border-t-green-500">
        <div className="p-4 border-b border-white/5 bg-void-800/50 flex justify-between items-center">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-green-500" /> Son Kayıtlar
          </h3>
          <span className="text-[10px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">GERÇEK</span>
        </div>
        
        <div className="divide-y divide-white/5 max-h-[300px] overflow-hidden min-h-[100px]">
          {recentRegistrations.length > 0 ? (
              recentRegistrations.map((player, index) => (
                <div key={`${player.name}-${index}`} className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors animate-fade-in-left">
                  <div className="flex items-center gap-3">
                    <img 
                     src={player.avatar}
                     alt="Avatar" 
                     className="w-8 h-8 rounded bg-void-800 p-0.5 border border-white/10"
                    />
                    <span className="text-sm font-medium text-gray-200">{player.name}</span>
                  </div>
                  <span className="text-xs text-green-400 font-bold">{player.time}</span>
                </div>
              ))
          ) : (
              <div className="p-6 text-center flex flex-col items-center justify-center text-gray-500 gap-2">
                 <AlertCircle className="w-6 h-6 opacity-30" />
                 <span className="text-xs">Henüz yeni kayıt yok.<br/>İlk kayıt olan sen ol!</span>
              </div>
          )}
        </div>
      </div>

      {/* Developer Widget */}
      <div className="glass-card rounded-xl p-5 border border-white/5 flex items-center gap-4 hover:border-axion-cyan/30 transition-colors group cursor-pointer">
          <div className="relative">
              <img src={developer.image} alt={developer.name} className="w-12 h-12 rounded-full border-2 border-void-800 shadow-lg group-hover:scale-105 transition-transform" />
              <div className="absolute -bottom-1 -right-1 bg-axion-cyan p-1 rounded-full text-void-950">
                  <Code className="w-3 h-3" />
              </div>
          </div>
          <div>
              <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Site Geliştiricisi</p>
              <h4 className="text-white font-bold text-lg group-hover:text-axion-cyan transition-colors">Jexa & Maise</h4>
          </div>
      </div>

    </div>
  );
};

export default Sidebar;