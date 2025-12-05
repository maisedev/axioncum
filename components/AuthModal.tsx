import React, { useState } from 'react';
import { X, User, Lock, Mail, ArrowRight, Loader2 } from 'lucide-react';
import Button from './Button';
import TwoFactorVerify from './TwoFactorVerify';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (username: string, password: string, isRegistration: boolean) => void;
  check2FA?: (username: string) => { enabled: boolean; secret: string } | null;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLogin, check2FA }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [show2FAVerify, setShow2FAVerify] = useState(false);
  const [pending2FASecret, setPending2FASecret] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // Check if 2FA is enabled for this user (only on login)
      if (isLogin && check2FA) {
        const twoFAData = check2FA(username);
        if (twoFAData?.enabled && twoFAData?.secret) {
          setPending2FASecret(twoFAData.secret);
          setShow2FAVerify(true);
          setIsLoading(false);
          return;
        }
      }
      
      onLogin(username, password, !isLogin);
      setIsLoading(false);
      onClose();
    }, 1500);
  };

  const handle2FAVerified = () => {
    setShow2FAVerify(false);
    onLogin(username, password, false);
    onClose();
    setUsername('');
    setPassword('');
    setPending2FASecret('');
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-void-950/90 backdrop-blur-sm"
        onClick={!isLoading ? onClose : undefined}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-void-900 border border-white/10 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up">
        {/* Header Image */}
        <div className="h-32 bg-gradient-to-r from-axion-blue to-axion-cyan relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-30"></div>
            <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-void-900 to-transparent"></div>
            {!isLoading && (
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 bg-black/20 hover:bg-black/40 text-white p-2 rounded-full transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>
            )}
            <div className="absolute bottom-4 left-6">
                <h2 className="text-2xl font-bold text-white shadow-black drop-shadow-md">
                    {isLogin ? 'Tekrar Hoşgeldin!' : 'Aramıza Katıl'}
                </h2>
                <p className="text-white/80 text-sm">Axion Craft dünyasına giriş yap.</p>
            </div>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Minecraft Kullanıcı Adı</label>
                <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input 
                        type="text" 
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full bg-void-950 border border-void-700 rounded-xl py-3 pl-10 pr-4 text-white focus:border-axion-cyan focus:outline-none transition-colors"
                        placeholder="Örn: Steve"
                        required
                        disabled={isLoading}
                    />
                </div>
            </div>

            {!isLogin && (
                <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">E-Posta Adresi</label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <input 
                            type="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-void-950 border border-void-700 rounded-xl py-3 pl-10 pr-4 text-white focus:border-axion-cyan focus:outline-none transition-colors"
                            placeholder="mail@ornek.com"
                            required
                            disabled={isLoading}
                        />
                    </div>
                </div>
            )}

            <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Şifre</label>
                <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-void-950 border border-void-700 rounded-xl py-3 pl-10 pr-4 text-white focus:border-axion-cyan focus:outline-none transition-colors"
                        placeholder="••••••••"
                        required
                        disabled={isLoading}
                    />
                </div>
            </div>

            <Button className="w-full mt-6" variant="primary" disabled={isLoading}>
                {isLoading ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> İşleniyor...</>
                ) : (
                    <>{isLogin ? 'Giriş Yap' : 'Kayıt Ol'} <ArrowRight className="w-4 h-4" /></>
                )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
                {isLogin ? 'Hesabın yok mu?' : 'Zaten hesabın var mı?'} {' '}
                <button 
                    onClick={() => !isLoading && setIsLogin(!isLogin)}
                    className={`text-axion-cyan font-bold hover:underline ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={isLoading}
                >
                    {isLogin ? 'Kayıt Ol' : 'Giriş Yap'}
                </button>
            </p>
          </div>
        </div>
      </div>

      {/* 2FA Verification Modal */}
      <TwoFactorVerify
        isOpen={show2FAVerify}
        onClose={() => {
          setShow2FAVerify(false);
          setPending2FASecret('');
        }}
        onVerify={handle2FAVerified}
        secret={pending2FASecret}
        username={username}
      />
    </div>
  );
};

export default AuthModal;