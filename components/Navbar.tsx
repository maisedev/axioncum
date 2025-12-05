import React, { useState, useEffect } from 'react';
import { Menu, X, ShoppingCart, Home, Book, HelpCircle, Swords, Gavel, User, Snowflake, Shield, MessageSquare, WifiOff, Users } from 'lucide-react';
import { NavItem, User as UserType } from '../types';
import Button from './Button';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLoginClick: () => void;
  user: UserType | null;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, onLoginClick, user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [serverStatus, setServerStatus] = useState<{ online: boolean; players: number; max: number; loading: boolean }>({
    online: false,
    players: 0,
    max: 0,
    loading: true,
  });

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Sunucu durumunu ve aktif oyuncu sayısını çek
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch('https://api.mcsrvstat.us/2/play.axioncraft.himsey.com:25574');
        const data = await res.json();
        setServerStatus({
          online: !!data.online,
          players: data.online && data.players ? data.players.online ?? 0 : 0,
          max: data.online && data.players ? data.players.max ?? 0 : 0,
          loading: false,
        });
      } catch (e) {
        setServerStatus({
          online: false,
          players: 0,
          max: 0,
          loading: false,
        });
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const navItems: NavItem[] = [
    { label: 'Anasayfa', id: 'home', icon: <Home className="w-4 h-4" /> },
    { label: 'Özellikler', id: 'features', icon: <Swords className="w-4 h-4" /> },
    { label: 'Wiki', id: 'wiki', icon: <Book className="w-4 h-4" /> },
    { label: 'Destek', id: 'support', icon: <HelpCircle className="w-4 h-4" /> },
    { label: 'Cezalar', id: 'bans', icon: <Gavel className="w-4 h-4" /> },
  ];

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-void-950/90 backdrop-blur-md shadow-xl py-2 border-b border-axion-ice/10' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo - Image Removed, Text Only */}
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setActiveTab('home')}>
             <div className="relative">
                <h2 className="text-2xl font-black italic tracking-tighter text-white drop-shadow-lg">
                    AXION<span className="text-axion-cyan">CRAFT</span>
                </h2>
                <Snowflake className="absolute -top-3 -right-4 w-4 h-4 text-axion-ice animate-pulse opacity-0 group-hover:opacity-100 transition-opacity" />
             </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
                  activeTab === item.id
                    ? 'text-white bg-white/10 shadow-inner ring-1 ring-white/10'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>

          {/* Server status + CTA Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-void-900/80 border border-white/10 text-xs">
              {serverStatus.loading ? (
                <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
              ) : serverStatus.online ? (
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              ) : (
                <span className="w-2 h-2 rounded-full bg-red-500" />
              )}
              {serverStatus.online ? (
                <div className="flex items-center gap-2 text-gray-200">
                  <Users className="w-3 h-3 text-axion-cyan" />
                  <span className="font-semibold">
                    {serverStatus.players} / {serverStatus.max} aktif
                  </span>
                </div>
              ) : serverStatus.loading ? (
                <span className="text-gray-400">Sunucu kontrol ediliyor...</span>
              ) : (
                <div className="flex items-center gap-1 text-red-400">
                  <WifiOff className="w-3 h-3" />
                  <span>Sunucu kapalı</span>
                </div>
              )}
            </div>

             {user ? (
                 <>
                    {user.isAdmin && (
                        <button 
                            onClick={() => setActiveTab('admin')}
                            className={`p-2 rounded-lg transition-colors border ${activeTab === 'admin' ? 'bg-red-500/20 text-red-500 border-red-500/50' : 'text-gray-400 hover:text-white border-transparent'}`}
                            title="Yönetim Paneli"
                        >
                            <Shield className="w-5 h-5" />
                        </button>
                    )}
                    {user.supportTickets && user.supportTickets.length > 0 && (
                        <button
                            onClick={() => setActiveTab('my-tickets')}
                            className={`relative p-2 rounded-lg transition-colors border ${activeTab === 'my-tickets' ? 'bg-blue-500/20 text-blue-400 border-blue-500/50' : 'text-gray-400 hover:text-white border-transparent'}`}
                            title="Destek Taleplerim"
                        >
                            <MessageSquare className="w-5 h-5" />
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                {user.supportTickets.length}
                            </span>
                        </button>
                    )}
                    <div className="flex items-center gap-3 bg-void-800 rounded-lg p-1 pr-4 border border-white/5 hover:border-axion-cyan/30 transition-all cursor-pointer group" onClick={() => setActiveTab('profile')}>
                        <div className="relative">
                            <img src={user.avatar} alt={user.username} className="w-9 h-9 rounded-md bg-void-950" />
                            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-void-800"></div>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs font-bold text-white leading-tight group-hover:text-axion-cyan transition-colors">{user.username}</span>
                            <span className="text-[10px] text-axion-gold leading-tight">{user.credits} Kredi</span>
                        </div>
                    </div>
                 </>
             ) : (
                <button 
                    onClick={onLoginClick}
                    className="text-gray-300 hover:text-white font-medium text-sm flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors"
                >
                    <User className="w-4 h-4" />
                    Giriş Yap
                </button>
             )}
            <Button 
              variant="primary" 
              onClick={() => setActiveTab('store')}
              className="!py-2 !px-4 text-sm !rounded-lg bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 shadow-yellow-500/20 border-none"
            >
              <ShoppingCart className="w-4 h-4" />
              Market
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-gray-400 hover:text-white bg-void-800"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-void-900 border-t border-white/5 absolute w-full left-0 top-full shadow-2xl z-50 animate-fade-in-up">
          <div className="px-4 py-4 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-3 rounded-lg text-base font-medium flex items-center gap-3 ${
                  activeTab === item.id
                    ? 'text-axion-cyan bg-void-800'
                    : 'text-gray-400 hover:text-white hover:bg-void-800'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
             <button
                onClick={() => {
                  setActiveTab('store');
                  setIsOpen(false);
                }}
                className="w-full text-left px-4 py-3 rounded-lg text-base font-medium flex items-center gap-3 text-yellow-400 hover:bg-void-800"
              >
                <ShoppingCart className="w-5 h-5" />
                Market
              </button>
              
              {user ? (
                  <div className="mt-4 pt-4 border-t border-white/10">
                      <div className="flex items-center justify-between px-4 py-3 bg-void-950 rounded-lg" onClick={() => { setActiveTab('profile'); setIsOpen(false); }}>
                          <div className="flex items-center gap-3">
                            <img src={user.avatar} alt={user.username} className="w-8 h-8 rounded" />
                            <div className="flex flex-col">
                                <span className="text-white font-bold">{user.username}</span>
                                <span className="text-xs text-axion-gold">{user.credits} Kredi</span>
                            </div>
                          </div>
                          <button onClick={(e) => { e.stopPropagation(); onLogout(); }} className="text-red-400 text-sm">Çıkış</button>
                      </div>
                      {user.supportTickets && user.supportTickets.length > 0 && (
                        <button onClick={() => { setActiveTab('my-tickets'); setIsOpen(false); }} className="w-full text-left px-4 py-3 rounded-lg text-base font-medium flex items-center gap-3 text-blue-400 hover:bg-void-800 mt-2 relative">
                            <MessageSquare className="w-5 h-5" /> Destek Taleplerim
                            <span className="ml-auto bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                                {user.supportTickets.length}
                            </span>
                        </button>
                      )}
                      {user.isAdmin && (
                        <button onClick={() => { setActiveTab('admin'); setIsOpen(false); }} className="w-full text-left px-4 py-3 rounded-lg text-base font-medium flex items-center gap-3 text-red-500 hover:bg-void-800 mt-2">
                            <Shield className="w-5 h-5" /> Yönetim Paneli
                        </button>
                      )}
                  </div>
              ) : (
                <button 
                    onClick={() => {
                        onLoginClick();
                        setIsOpen(false);
                    }}
                    className="w-full text-left px-4 py-3 rounded-lg text-base font-medium flex items-center gap-3 text-gray-400 hover:bg-void-800"
                >
                    <User className="w-5 h-5" />
                    Giriş Yap
                </button>
              )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;