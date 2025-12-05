import React, { useState } from 'react';
import { User, Shield, CreditCard, Clock, Sword, Skull, Crown, Settings, LogOut, ChevronRight, AlertCircle } from 'lucide-react';
import { User as UserType } from '../types';
import Button from './Button';
import ProfileSettings from './ProfileSettings';
import TwoFactorSetup from './TwoFactorSetup';

interface ProfileProps {
  user: UserType;
  onLogout: () => void;
  onUpdate?: (updatedUser: Partial<UserType>) => void;
}

const Profile: React.FC<ProfileProps> = ({ user, onLogout, onUpdate }) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [is2FAModalOpen, setIs2FAModalOpen] = useState(false);
  const [settingsInitialTab, setSettingsInitialTab] = useState<'profile' | 'security' | 'notifications' | 'privacy'>('profile');

  const handle2FAEnable = (secret: string) => {
    if (onUpdate) {
      onUpdate({ twoFactorEnabled: true, twoFactorSecret: secret });
    }
  };

  const handle2FADisable = () => {
    if (onUpdate) {
      onUpdate({ twoFactorEnabled: false, twoFactorSecret: undefined });
    }
  };

  return (
    <div className="pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header Profile Section */}
      <div className="glass-card rounded-2xl p-8 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-axion-blue/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        
        <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
            {/* Skin Render */}
            <div className="relative group">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-xl overflow-hidden border-4 border-void-800 shadow-2xl bg-void-900 relative">
                    {/* 3D Skin Render - Steve fallback if skin yoksa */}
                    <img 
                        src={`https://visage.surgeplay.com/bust/512/${user.username}`} 
                        alt="Skin" 
                        className="w-full h-full object-cover pixelated transform group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          const target = e.currentTarget as HTMLImageElement;
                          target.onerror = null;
                          target.src = 'https://visage.surgeplay.com/bust/512/Steve';
                        }}
                    />
                </div>
                <div className="absolute -bottom-3 -right-3 bg-axion-gold text-void-950 font-black text-xs px-3 py-1 rounded-full shadow-lg border-2 border-void-900">
                    {user.rank}
                </div>
            </div>

            <div className="flex-1 text-center md:text-left space-y-2">
                <h1 className="text-3xl md:text-4xl font-black text-white">{user.username}</h1>
                <p className="text-gray-400 flex items-center justify-center md:justify-start gap-2">
                    <Clock className="w-4 h-4" /> Kayıt Tarihi: <span className="text-gray-200">{user.joinDate}</span>
                </p>
                <div className="flex flex-wrap gap-3 justify-center md:justify-start pt-2">
                    <div className="bg-void-950/50 px-4 py-2 rounded-lg border border-white/5 flex flex-col">
                        <span className="text-xs text-gray-500 uppercase font-bold">Bakiye</span>
                        <span className="text-axion-gold font-bold font-mono">
                            {(user.isAdmin || user.isOwner) ? 'x' : user.coins.toLocaleString()} Coin
                        </span>
                    </div>
                    <div className="bg-void-950/50 px-4 py-2 rounded-lg border border-white/5 flex flex-col">
                        <span className="text-xs text-gray-500 uppercase font-bold">Site Kredisi</span>
                        <span className="text-axion-cyan font-bold font-mono">
                            {(user.isAdmin || user.isOwner) ? 'x' : user.credits} Kredi
                        </span>
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-3 w-full md:w-auto">
                <Button variant="outline" className="justify-center" onClick={() => setIsSettingsOpen(true)}>
                    <Settings className="w-4 h-4" /> Ayarlar
                </Button>
                <Button variant="secondary" onClick={onLogout} className="justify-center hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/50">
                    <LogOut className="w-4 h-4" /> Çıkış Yap
                </Button>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Stats */}
        <div className="lg:col-span-2 space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="glass-card p-5 rounded-xl border-b-4 border-b-red-500">
                    <div className="text-red-500 mb-2"><Sword className="w-6 h-6" /></div>
                    <div className="text-2xl font-black text-white">{(user.isAdmin || user.isOwner) ? 'x' : (user.stats?.kills ?? 0)}</div>
                    <div className="text-xs text-gray-400 uppercase font-bold">Öldürme</div>
                </div>
                <div className="glass-card p-5 rounded-xl border-b-4 border-b-gray-500">
                    <div className="text-gray-500 mb-2"><Skull className="w-6 h-6" /></div>
                    <div className="text-2xl font-black text-white">{(user.isAdmin || user.isOwner) ? 'x' : (user.stats?.deaths ?? 0)}</div>
                    <div className="text-xs text-gray-400 uppercase font-bold">Ölme</div>
                </div>
                <div className="glass-card p-5 rounded-xl border-b-4 border-b-green-500">
                    <div className="text-green-500 mb-2"><Crown className="w-6 h-6" /></div>
                    <div className="text-2xl font-black text-white">{(user.isAdmin || user.isOwner) ? 'x' : (user.stats?.islandLevel ?? 0)}</div>
                    <div className="text-xs text-gray-400 uppercase font-bold">Ada Seviyesi</div>
                </div>
                <div className="glass-card p-5 rounded-xl border-b-4 border-b-blue-500">
                    <div className="text-blue-500 mb-2"><Clock className="w-6 h-6" /></div>
                    <div className="text-xl font-black text-white truncate">{(user.isAdmin || user.isOwner) ? 'x' : (user.stats?.playTime || '0 Dk')}</div>
                    <div className="text-xs text-gray-400 uppercase font-bold">Oynama Süresi</div>
                </div>
            </div>

            {/* Transaction History */}
            <div className="glass-card rounded-xl overflow-hidden">
                <div className="p-6 border-b border-white/5 flex items-center justify-between">
                    <h3 className="font-bold text-white flex items-center gap-2">
                        <CreditCard className="w-5 h-5 text-axion-cyan" /> Son İşlemler
                    </h3>
                    <button className="text-xs text-axion-cyan hover:underline">Tümünü Gör</button>
                </div>
                <div className="divide-y divide-white/5">
                    {user.history.map((tx) => (
                        <div key={tx.id} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                    tx.status === 'completed' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'
                                }`}>
                                    {tx.amount > 0 ? '+' : '-'}
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-200 text-sm">{tx.item}</h4>
                                    <span className="text-xs text-gray-500">{tx.date} • ID: #{tx.id}</span>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className={`font-mono font-bold ${tx.amount > 0 ? 'text-green-400' : 'text-red-400'}`}>
                                    {tx.amount > 0 ? '+' : ''}{tx.amount} TL
                                </div>
                                <div className={`text-[10px] uppercase font-bold ${
                                    tx.status === 'completed' ? 'text-green-600' : 'text-yellow-600'
                                }`}>
                                    {tx.status === 'completed' ? 'Tamamlandı' : 'Bekleniyor'}
                                </div>
                            </div>
                        </div>
                    ))}
                    {user.history.length === 0 && (
                        <div className="p-8 text-center text-gray-500 text-sm">
                            Henüz işlem geçmişi bulunmuyor.
                        </div>
                    )}
                </div>
            </div>
        </div>

        {/* Right Column: Security & Settings */}
        <div className="space-y-8">
            <div className="glass-card rounded-xl p-6">
                <h3 className="font-bold text-white mb-6 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-axion-cyan" /> Hesap Güvenliği
                </h3>
                
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-void-950/50 rounded-lg border border-white/5">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                            <div>
                                <div className="text-sm font-bold text-gray-200">E-Posta Doğrulama</div>
                                <div className="text-xs text-gray-500">Hesabınız doğrulandı</div>
                            </div>
                        </div>
                        <Button variant="outline" className="!px-3 !py-1 text-xs h-8">Değiştir</Button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-void-950/50 rounded-lg border border-white/5">
                        <div className="flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-full ${user.twoFactorEnabled ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]'}`}></div>
                            <div>
                                <div className="text-sm font-bold text-gray-200">2FA (İki Adımlı)</div>
                                <div className="text-xs text-gray-500">{user.twoFactorEnabled ? 'Koruma aktif' : 'Koruma devre dışı'}</div>
                            </div>
                        </div>
                        {user.twoFactorEnabled ? (
                          <Button variant="outline" className="!px-3 !py-1 text-xs h-8 text-red-400 border-red-400/30 hover:bg-red-500/10" onClick={handle2FADisable}>Kapat</Button>
                        ) : (
                          <Button variant="primary" className="!px-3 !py-1 text-xs h-8" onClick={() => setIs2FAModalOpen(true)}>Aktif Et</Button>
                        )}
                    </div>

                    <div className="pt-4 border-t border-white/5">
                        <h4 className="text-xs text-gray-400 font-bold uppercase mb-3">Hızlı İşlemler</h4>
                        <button
                          className="w-full text-left px-4 py-3 rounded-lg hover:bg-void-800 text-sm text-gray-300 transition-colors flex items-center justify-between group"
                          onClick={() => {
                            setSettingsInitialTab('security');
                            setIsSettingsOpen(true);
                          }}
                        >
                            Şifre Değiştir
                            <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-white" />
                        </button>
                        <button
                          className="w-full text-left px-4 py-3 rounded-lg hover:bg-void-800 text-sm text-gray-300 transition-colors flex items-center justify-between group"
                          onClick={() => {
                            setSettingsInitialTab('profile');
                            setIsSettingsOpen(true);
                          }}
                        >
                            Skin Yönetimi
                            <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-white" />
                        </button>
                    </div>
                </div>
            </div>

            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 flex gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                <div>
                    <h4 className="text-yellow-500 font-bold text-sm">Hesabını Koru!</h4>
                    <p className="text-xs text-yellow-200/70 mt-1 leading-relaxed">
                        Axion Craft yetkilileri sizden asla şifrenizi istemez. Hesabınızın güvenliği için şifrenizi kimseyle paylaşmayın.
                    </p>
                </div>
            </div>
        </div>
      </div>

      <ProfileSettings
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        user={user}
        onUpdate={(updatedUser) => {
          if (onUpdate) {
            onUpdate(updatedUser);
          }
        }}
        initialTab={settingsInitialTab}
      />

      <TwoFactorSetup
        isOpen={is2FAModalOpen}
        onClose={() => setIs2FAModalOpen(false)}
        username={user.username}
        onEnable={handle2FAEnable}
      />
    </div>
  );
};

export default Profile;