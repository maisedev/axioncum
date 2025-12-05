import React, { useState, useEffect } from 'react';
import { X, Shield, Copy, Check, Smartphone } from 'lucide-react';
import Button from './Button';
import { useToast } from '../contexts/ToastContext';

interface TwoFactorSetupProps {
  isOpen: boolean;
  onClose: () => void;
  username: string;
  onEnable: (secret: string) => void;
}

// Base32 encoding for TOTP secret
const generateBase32Secret = (length = 16): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  let result = '';
  const randomValues = new Uint8Array(length);
  crypto.getRandomValues(randomValues);
  for (let i = 0; i < length; i++) {
    result += chars[randomValues[i] % 32];
  }
  return result;
};

const TwoFactorSetup: React.FC<TwoFactorSetupProps> = ({ isOpen, onClose, username, onEnable }) => {
  const { showToast } = useToast();
  const [secret, setSecret] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      generateSecret();
    }
  }, [isOpen]);

  const generateSecret = () => {
    const newSecret = generateBase32Secret(16);
    setSecret(newSecret);
    
    const otpauth = `otpauth://totp/AxionCraft:${encodeURIComponent(username)}?secret=${newSecret}&issuer=AxionCraft&algorithm=SHA1&digits=6&period=30`;
    
    // Generate QR code using QR Server API
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(otpauth)}`;
    setQrCodeUrl(qrUrl);
  };

  const copySecret = () => {
    navigator.clipboard.writeText(secret);
    setCopied(true);
    showToast('Gizli anahtar kopyalandı!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    onEnable(secret);
    showToast('2FA başarıyla kaydedildi!', 'success');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-void-950/90 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative bg-void-900 border border-white/10 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up">
        <div className="p-6 border-b border-white/5 flex items-center justify-between bg-gradient-to-r from-axion-blue/20 to-axion-cyan/20">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-axion-cyan/20 rounded-lg">
              <Shield className="w-6 h-6 text-axion-cyan" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">2FA Kurulumu</h2>
              <p className="text-xs text-gray-400">Google Authenticator</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Smartphone className="w-5 h-5 text-axion-cyan" />
              <span className="text-sm text-gray-400">Google Authenticator ile QR kodu tara</span>
            </div>
            
            {qrCodeUrl && (
              <div className="bg-white p-4 rounded-xl inline-block">
                <img src={qrCodeUrl} alt="2FA QR Code" className="w-48 h-48 mx-auto" />
              </div>
            )}
            
            <p className="text-xs text-gray-500 mt-4">QR kodu taradıktan sonra "Kaydet" butonuna bas</p>
          </div>

          <div className="bg-void-950/50 rounded-xl p-4 border border-white/5">
            <label className="block text-xs font-bold text-gray-400 uppercase mb-2">
              Manuel Giriş Anahtarı
            </label>
            <div className="flex items-center gap-2">
              <code className="flex-1 bg-void-950 px-3 py-2 rounded-lg text-axion-cyan text-sm font-mono break-all select-all">
                {secret}
              </code>
              <button
                onClick={copySecret}
                className="p-2 bg-void-800 hover:bg-void-700 rounded-lg transition-colors"
              >
                {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-gray-400" />}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              QR kod çalışmazsa bu anahtarı manuel olarak gir
            </p>
          </div>

          <Button onClick={handleSave} className="w-full">
            <Check className="w-4 h-4" /> Kaydet ve Aktifleştir
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TwoFactorSetup;
