import React, { useState, useEffect } from 'react';
import { X, User, Mail, Lock, Bell, Globe, Shield, Image, Save, Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react';
import { User as UserType } from '../types';
import Button from './Button';
import { useToast } from '../contexts/ToastContext';
import TwoFactorSetup from './TwoFactorSetup';

// 2FA Section Component
const TwoFactorSection: React.FC<{ user: UserType; onUpdate: (updatedUser: Partial<UserType>) => void }> = ({ user, onUpdate }) => {
  const [is2FAModalOpen, setIs2FAModalOpen] = useState(false);
  const { showToast } = useToast();

  const handle2FAEnable = (secret: string) => {
    onUpdate({ twoFactorEnabled: true, twoFactorSecret: secret });
  };

  const handle2FADisable = () => {
    onUpdate({ twoFactorEnabled: false, twoFactorSecret: undefined });
    showToast('2FA devre dışı bırakıldı.', 'info');
  };

  return (
    <div className="pt-6 border-t border-white/5">
      <h3 className="text-xl font-bold text-white mb-4">İki Adımlı Doğrulama (2FA)</h3>
      <div className={`rounded-xl p-4 border ${user.twoFactorEnabled ? 'bg-green-500/10 border-green-500/30' : 'bg-void-950/50 border-white/5'}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${user.twoFactorEnabled ? 'bg-green-500/20' : 'bg-void-800'}`}>
              <Shield className={`w-5 h-5 ${user.twoFactorEnabled ? 'text-green-400' : 'text-gray-400'}`} />
            </div>
            <div>
              <div className="text-sm font-bold text-white">Google Authenticator</div>
              <div className={`text-xs ${user.twoFactorEnabled ? 'text-green-400' : 'text-gray-500'}`}>
                {user.twoFactorEnabled ? '✓ Aktif' : 'Devre dışı'}
              </div>
            </div>
          </div>
          {user.twoFactorEnabled && (
            <CheckCircle className="w-5 h-5 text-green-400" />
          )}
        </div>
        
        <p className="text-sm text-gray-400 mb-4">
          {user.twoFactorEnabled 
            ? 'Hesabınız 2FA ile korunuyor. Giriş yaparken Google Authenticator kodunuz istenecek.'
            : 'Hesabınızı ekstra güvenlik katmanı ile koruyun. Google Authenticator uygulaması gereklidir.'}
        </p>
        
        {user.twoFactorEnabled ? (
          <Button variant="outline" className="w-full text-red-400 border-red-400/30 hover:bg-red-500/10" onClick={handle2FADisable}>
            <XCircle className="w-4 h-4" /> 2FA'yı Devre Dışı Bırak
          </Button>
        ) : (
          <Button variant="primary" className="w-full" onClick={() => setIs2FAModalOpen(true)}>
            <Shield className="w-4 h-4" /> 2FA'yı Aktif Et
          </Button>
        )}
      </div>

      <TwoFactorSetup
        isOpen={is2FAModalOpen}
        onClose={() => setIs2FAModalOpen(false)}
        username={user.username}
        onEnable={handle2FAEnable}
      />
    </div>
  );
};

interface ProfileSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserType;
  onUpdate: (updatedUser: Partial<UserType>) => void;
  initialTab?: 'profile' | 'security' | 'notifications' | 'privacy';
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ isOpen, onClose, user, onUpdate, initialTab }) => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications' | 'privacy'>(initialTab || 'profile');
  const [formData, setFormData] = useState({
    username: user.username,
    email: 'user@example.com',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    showPassword: false,
    emailNotifications: true,
    pushNotifications: false,
    marketingEmails: false,
    profileVisibility: 'public' as 'public' | 'friends' | 'private',
    showOnlineStatus: true,
    allowFriendRequests: true,
  });

  useEffect(() => {
    if (isOpen && initialTab) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  const handleSave = () => {
    // Simulate save
    showToast('Ayarlar başarıyla kaydedildi!', 'success');
    onUpdate({ username: formData.username });
    setTimeout(() => {
      onClose();
    }, 1000);
  };

  const handlePasswordChange = () => {
    if (formData.newPassword !== formData.confirmPassword) {
      showToast('Şifreler eşleşmiyor!', 'error');
      return;
    }
    if (formData.newPassword.length < 6) {
      showToast('Şifre en az 6 karakter olmalıdır!', 'error');
      return;
    }
    showToast('Şifre başarıyla değiştirildi!', 'success');
    setFormData({ ...formData, currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const tabs = [
    { id: 'profile', label: 'Profil', icon: User },
    { id: 'security', label: 'Güvenlik', icon: Shield },
    { id: 'notifications', label: 'Bildirimler', icon: Bell },
    { id: 'privacy', label: 'Gizlilik', icon: Globe },
  ];

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-void-950/90 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative z-10 w-full max-w-4xl max-h-[90vh] bg-void-900 rounded-2xl border border-white/10 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-white/5 flex items-center justify-between bg-gradient-to-r from-void-800 to-void-900">
          <h2 className="text-2xl font-black text-white">Profil Ayarları</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar Tabs */}
          <div className="w-64 border-r border-white/5 bg-void-950/50 p-4 flex flex-col gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-axion-cyan/20 text-axion-cyan border border-axion-cyan/50'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">Profil Bilgileri</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-400 uppercase mb-2">
                        Kullanıcı Adı
                      </label>
                      <input
                        type="text"
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        className="w-full bg-void-950 border border-void-700 rounded-xl py-3 px-4 text-white focus:border-axion-cyan focus:outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-400 uppercase mb-2">
                        E-Posta Adresi
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full bg-void-950 border border-void-700 rounded-xl py-3 pl-10 pr-4 text-white focus:border-axion-cyan focus:outline-none transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-400 uppercase mb-2">
                        Profil Fotoğrafı
                      </label>
                      <div className="flex items-center gap-4">
                        <div className="w-20 h-20 rounded-xl overflow-hidden border-2 border-void-700">
                          <img
                            src={user.avatar}
                            alt={user.username}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <Button
                          variant="outline"
                          className="flex items-center gap-2"
                          onClick={() => {
                            const url = window.prompt('Yeni profil fotoğrafı URL\'sini gir (İmgur / Discord CDN vb.):', user.avatar);
                            if (!url) return;
                            onUpdate({ avatar: url });
                            showToast('Profil fotoğrafı güncellendi.', 'success');
                          }}
                        >
                          <Image className="w-4 h-4" />
                          Fotoğraf Değiştir
                        </Button>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Maksimum dosya boyutu: 5MB. Desteklenen formatlar: JPG, PNG
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">Şifre Değiştir</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-400 uppercase mb-2">
                        Mevcut Şifre
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <input
                          type={formData.showPassword ? 'text' : 'password'}
                          value={formData.currentPassword}
                          onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                          className="w-full bg-void-950 border border-void-700 rounded-xl py-3 pl-10 pr-12 text-white focus:border-axion-cyan focus:outline-none transition-colors"
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, showPassword: !formData.showPassword })}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                        >
                          {formData.showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-400 uppercase mb-2">
                        Yeni Şifre
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <input
                          type={formData.showPassword ? 'text' : 'password'}
                          value={formData.newPassword}
                          onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                          className="w-full bg-void-950 border border-void-700 rounded-xl py-3 pl-10 pr-4 text-white focus:border-axion-cyan focus:outline-none transition-colors"
                          placeholder="••••••••"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-400 uppercase mb-2">
                        Yeni Şifre (Tekrar)
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <input
                          type={formData.showPassword ? 'text' : 'password'}
                          value={formData.confirmPassword}
                          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                          className="w-full bg-void-950 border border-void-700 rounded-xl py-3 pl-10 pr-4 text-white focus:border-axion-cyan focus:outline-none transition-colors"
                          placeholder="••••••••"
                        />
                      </div>
                    </div>

                    <Button onClick={handlePasswordChange} variant="primary" className="w-full">
                      Şifreyi Değiştir
                    </Button>
                  </div>
                </div>

                <TwoFactorSection user={user} onUpdate={onUpdate} />
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-white mb-4">Bildirim Ayarları</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-void-950/50 rounded-xl border border-white/5">
                    <div>
                      <div className="text-sm font-bold text-gray-200">E-Posta Bildirimleri</div>
                      <div className="text-xs text-gray-500">Önemli güncellemeler için e-posta al</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.emailNotifications}
                        onChange={(e) => setFormData({ ...formData, emailNotifications: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-void-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-axion-cyan"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-void-950/50 rounded-xl border border-white/5">
                    <div>
                      <div className="text-sm font-bold text-gray-200">Push Bildirimleri</div>
                      <div className="text-xs text-gray-500">Tarayıcı bildirimlerini al</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.pushNotifications}
                        onChange={(e) => setFormData({ ...formData, pushNotifications: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-void-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-axion-cyan"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-void-950/50 rounded-xl border border-white/5">
                    <div>
                      <div className="text-sm font-bold text-gray-200">Pazarlama E-postaları</div>
                      <div className="text-xs text-gray-500">Özel teklifler ve güncellemeler</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.marketingEmails}
                        onChange={(e) => setFormData({ ...formData, marketingEmails: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-void-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-axion-cyan"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Privacy Tab */}
            {activeTab === 'privacy' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-white mb-4">Gizlilik Ayarları</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-400 uppercase mb-2">
                      Profil Görünürlüğü
                    </label>
                    <select
                      value={formData.profileVisibility}
                      onChange={(e) => setFormData({ ...formData, profileVisibility: e.target.value as any })}
                      className="w-full bg-void-950 border border-void-700 rounded-xl py-3 px-4 text-white focus:border-axion-cyan focus:outline-none transition-colors"
                    >
                      <option value="public">Herkese Açık</option>
                      <option value="friends">Sadece Arkadaşlar</option>
                      <option value="private">Gizli</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-void-950/50 rounded-xl border border-white/5">
                    <div>
                      <div className="text-sm font-bold text-gray-200">Çevrimiçi Durumu Göster</div>
                      <div className="text-xs text-gray-500">Diğer kullanıcılar çevrimiçi olduğunu görebilir</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.showOnlineStatus}
                        onChange={(e) => setFormData({ ...formData, showOnlineStatus: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-void-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-axion-cyan"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-void-950/50 rounded-xl border border-white/5">
                    <div>
                      <div className="text-sm font-bold text-gray-200">Arkadaşlık İsteklerini Kabul Et</div>
                      <div className="text-xs text-gray-500">Diğer kullanıcılar size arkadaşlık isteği gönderebilir</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.allowFriendRequests}
                        onChange={(e) => setFormData({ ...formData, allowFriendRequests: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-void-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-axion-cyan"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/5 bg-void-950/50 flex items-center justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            İptal
          </Button>
          <Button variant="primary" onClick={handleSave} className="flex items-center gap-2">
            <Save className="w-4 h-4" />
            Kaydet
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;

