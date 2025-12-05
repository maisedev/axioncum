import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import News from './components/News';
import Sidebar from './components/Sidebar';
import Features from './components/Features';
import Store from './components/Store';
import WikiBot from './components/WikiBot';
import Support from './components/Support';
import AuthModal from './components/AuthModal';
import Profile from './components/Profile';
import AdminPanel from './components/AdminPanel';
import MySupportTickets from './components/MySupportTickets';
import { ToastProvider, useToast } from './contexts/ToastContext';
import { ToastContainer } from './components/Toast';
import { Snowflake } from 'lucide-react';
import { User, SupportTicket } from './types';

const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [recentRegistrations, setRecentRegistrations] = useState<{ name: string; time: string; avatar: string }[]>([]);
  const { showToast, toasts, removeToast } = useToast();

  // Load user from fake session
  useEffect(() => {
    const savedUser = localStorage.getItem('axion_user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      // Load support tickets
      const tickets = JSON.parse(localStorage.getItem(`support_tickets_${userData.username}`) || '[]');
      userData.supportTickets = tickets;
      setUser(userData);
    }
  }, []);

  const handleLogin = (username: string, password: string, isRegistration: boolean) => {
    // Load existing 2FA data for this user (if any)
    let existing2FA: { enabled: boolean; secret: string } | null = null;
    try {
      const savedUsers2FA = JSON.parse(localStorage.getItem('axion_users_2fa') || '{}');
      if (savedUsers2FA && typeof savedUsers2FA === 'object' && savedUsers2FA[username]) {
        existing2FA = savedUsers2FA[username];
      }
    } catch {
      existing2FA = null;
    }

    // Default avatar for new registrations
    const defaultAvatar = '/assets/axion.png';
    
    // Owner credentials check
    const OWNER_USERNAME = "AxionOwnersSECRET";
    const OWNER_PASSWORD = "ownersSECRETsystems";
    const isOwner = username === OWNER_USERNAME && password === OWNER_PASSWORD;
    
    // If it's a registration, add to sidebar list
    if (isRegistration) {
        const newReg = {
            name: username,
            time: 'Az önce',
            avatar: defaultAvatar
        };
        setRecentRegistrations(prev => [newReg, ...prev]);
        showToast(`Hoş geldin ${username}! Hesabın başarıyla oluşturuldu.`, 'success');
    } else {
        if (isOwner) {
            showToast(`Hoş geldin Owner! Admin Panel'e erişiminiz var.`, 'success');
        } else {
            showToast(`Hoş geldin ${username}!`, 'success');
        }
    }

    // Creating a robust mock user profile
    const newUser: User = {
      username: isOwner ? OWNER_USERNAME : username,
      avatar: isRegistration ? defaultAvatar : (isOwner ? defaultAvatar : `https://visage.surgeplay.com/face/64/${username}`),
      coins: isRegistration ? 500 : 15420,
      credits: isRegistration ? 0 : 25,
      rank: isOwner ? "OWNER" : username === "Jexa.dev" ? "YÖNETİCİ" : "OYUNCU",
      role: isOwner ? "owner" : username === "Jexa.dev" ? "owner" : username === "Admin" ? "admin" : "player",
      isAdmin: isOwner || username === "Jexa.dev" || username === "Admin",
      isOwner: isOwner || username === "Jexa.dev",
      joinDate: new Date().toLocaleDateString('tr-TR'),
      // Keep 2FA status on profile if it was previously enabled
      twoFactorEnabled: !isOwner && !!existing2FA?.enabled,
      twoFactorSecret: !isOwner ? existing2FA?.secret : undefined,
      stats: {
          kills: isRegistration ? 0 : 42,
          deaths: isRegistration ? 0 : 12,
          islandLevel: isRegistration ? 0 : 150,
          playTime: isRegistration ? "1 Dk" : "12 Sa, 40 Dk"
      },
      history: isRegistration ? [] : [
          { id: 'TRX-101', item: 'Vote Kasası', amount: 0, date: 'Bugün', status: 'completed' },
          { id: 'TRX-99', item: 'Hoşgeldin Hediyesi', amount: 1000, date: 'Bugün', status: 'completed' }
      ]
    };
    // Load support tickets if they exist
    const existingTickets = JSON.parse(localStorage.getItem(`support_tickets_${username}`) || '[]');
    newUser.supportTickets = existingTickets;
    
    setUser(newUser);
    localStorage.setItem('axion_user', JSON.stringify(newUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('axion_user');
    setActiveTab('home');
    showToast('Başarıyla çıkış yapıldı.', 'info');
  };

  const handleUserUpdate = (updatedUser: Partial<User>) => {
    if (user) {
      const newUser = { ...user, ...updatedUser };
      setUser(newUser);
      localStorage.setItem('axion_user', JSON.stringify(newUser));
      
      // Save 2FA data separately for login check
      if (updatedUser.twoFactorEnabled !== undefined || updatedUser.twoFactorSecret !== undefined) {
        const savedUsers2FA = JSON.parse(localStorage.getItem('axion_users_2fa') || '{}');
        if (newUser.twoFactorEnabled && newUser.twoFactorSecret) {
          savedUsers2FA[newUser.username] = {
            enabled: true,
            secret: newUser.twoFactorSecret
          };
        } else {
          delete savedUsers2FA[newUser.username];
        }
        localStorage.setItem('axion_users_2fa', JSON.stringify(savedUsers2FA));
      }
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <>
            <Hero />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content Area (2/3 width) */}
                <div className="lg:col-span-2">
                  <News />
                  <div className="mt-12">
                     <Features />
                  </div>
                </div>

                {/* Sidebar Area (1/3 width) */}
                <div className="lg:col-span-1">
                  <div className="sticky top-24">
                    <Sidebar recentRegistrations={recentRegistrations} />
                  </div>
                </div>
              </div>
            </div>
          </>
        );
      case 'features':
        return (
           <div className="pt-24 max-w-7xl mx-auto px-4 pb-20 relative z-10">
             <Features />
           </div>
        );
      case 'store':
        return (
           <div className="min-h-screen relative z-10">
             <Store />
           </div>
        );
      case 'wiki':
        return (
           <div className="pt-24 relative z-10">
            <WikiBot />
           </div>
        );
       case 'support':
        return (
            <div className="relative z-10">
             <Support user={user || undefined} onTicketCreated={(ticket) => {
               if (user) {
                 const updatedTickets = [...(user.supportTickets || []), ticket];
                 handleUserUpdate({ supportTickets: updatedTickets });
               }
             }} />
            </div>
        );
        case 'my-tickets':
            if (!user) {
                setTimeout(() => setActiveTab('home'), 100);
                return null;
            }
            return (
                <div className="relative z-10">
                    <MySupportTickets user={user} onUpdate={handleUserUpdate} />
                </div>
            );
        case 'profile':
            if (!user) {
                setTimeout(() => setActiveTab('home'), 100);
                return null;
            }
            return (
                <div className="relative z-10">
                    <Profile user={user} onLogout={handleLogout} onUpdate={handleUserUpdate} />
                </div>
            );
        case 'admin':
            if (!user?.isAdmin) {
                setTimeout(() => setActiveTab('home'), 100);
                return null;
            }
            return (
                <div className="relative z-10">
                    <AdminPanel user={user} />
                </div>
            );
        case 'bans':
            return (
                <div className="pt-32 max-w-4xl mx-auto px-4 text-center min-h-[60vh] relative z-10">
                    <h2 className="text-3xl font-bold mb-4">Cezalı Oyuncular</h2>
                    <p className="text-gray-400">Ceza listesi şu anda yüklenemiyor. (Bakım Modu)</p>
                </div>
            );
      default:
        return (
          <>
            <Hero />
            <News />
          </>
        );
    }
  };

  return (
    <div className="min-h-screen font-sans selection:bg-axion-cyan selection:text-void-900 flex flex-col overflow-x-hidden">
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onLoginClick={() => setIsAuthModalOpen(true)}
        user={user}
        onLogout={handleLogout}
      />
      
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        onLogin={(username, password, isRegistration) => handleLogin(username, password, isRegistration)}
        check2FA={(username) => {
          // Check localStorage for saved 2FA data
          const savedUsers = JSON.parse(localStorage.getItem('axion_users_2fa') || '{}');
          if (savedUsers[username]) {
            return savedUsers[username];
          }
          return null;
        }}
      />

      <ToastContainer toasts={toasts} onRemove={removeToast} />

      <main className="flex-grow fade-in">
        {renderContent()}
      </main>
      
      {/* Enhanced Footer - Winter Theme - Socials Removed */}
      <footer className="bg-void-950/90 backdrop-blur-md border-t border-white/5 pt-16 pb-8 mt-auto relative z-20">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-axion-ice to-transparent opacity-20"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-2">
               <div className="flex items-center gap-3 mb-4">
                  <h2 className="text-2xl font-bold text-white relative">
                      AXION<span className="text-axion-cyan">CRAFT</span>
                      <Snowflake className="absolute -top-2 -right-3 w-3 h-3 text-axion-ice animate-spin-slow" />
                  </h2>
               </div>
               <p className="text-gray-400 text-sm leading-relaxed max-w-sm mb-6">
                 Skyblock deneyiminin zirvesi. Binlerce kişilik topluluğa katıl, imparatorluğunu kur ve ekonomiye hükmet. Haftalık güncellemeler, özel eklentiler.
               </p>
            </div>
            
            <div>
              <h3 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">Hızlı Bağlantılar</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><button onClick={() => setActiveTab('store')} className="hover:text-axion-cyan transition-colors">Market</button></li>
                <li><a href="#" className="hover:text-axion-cyan transition-colors">Oy Ver</a></li>
                <li><button onClick={() => setActiveTab('bans')} className="hover:text-axion-cyan transition-colors">Cezalar</button></li>
                <li><a href="#" className="hover:text-axion-cyan transition-colors">Yönetim</a></li>
                <li><button onClick={() => setActiveTab('wiki')} className="hover:text-axion-cyan transition-colors">Wiki</button></li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">Destek</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><button onClick={() => setActiveTab('support')} className="hover:text-axion-cyan transition-colors">Destek Talebi</button></li>
                <li><a href="#" className="hover:text-axion-cyan transition-colors">Hata Bildir</a></li>
                <li><a href="#" className="hover:text-axion-cyan transition-colors">Hizmet Şartları</a></li>
                <li><a href="#" className="hover:text-axion-cyan transition-colors">Gizlilik Politikası</a></li>
                <li><a href="#" className="hover:text-axion-cyan transition-colors">Kurallar</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
             <p className="text-gray-600 text-sm">
              © {new Date().getFullYear()} Axion Craft. Mojang AB ile bağlantısı yoktur.
            </p>
            <div className="flex items-center gap-2 bg-void-900 border border-white/5 px-4 py-2 rounded-full cursor-pointer hover:border-axion-cyan/50 transition-colors">
              <span className="text-gray-500 text-xs">Developed by</span>
              <img 
                src="https://media.discordapp.net/attachments/1427615471984971870/1444652278798880799/fda1fa75500a91dfb236397882d40249.jpg?ex=692d7cc7&is=692c2b47&hm=fca966e6ea088bb96933bd863eb4e0046ec8950c053bcdad052415e41a984338&=&format=webp" 
                alt="Jexa.dev" 
                className="w-5 h-5 rounded-full"
              />
              <span className="text-white text-xs font-bold">Jexa.dev</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
};

export default App;