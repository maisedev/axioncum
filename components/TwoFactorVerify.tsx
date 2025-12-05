import React, { useState } from 'react';
import { X, Shield, Loader2 } from 'lucide-react';
import Button from './Button';
import { useToast } from '../contexts/ToastContext';

interface TwoFactorVerifyProps {
  isOpen: boolean;
  onClose: () => void;
  onVerify: () => void;
  secret: string;
  username: string;
}

// Simple TOTP implementation without crypto.subtle (for HTTP compatibility)
const base32Decode = (input: string): number[] => {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  const cleanInput = input.toUpperCase().replace(/[^A-Z2-7]/g, '');
  
  let bits = '';
  for (const char of cleanInput) {
    const idx = alphabet.indexOf(char);
    if (idx >= 0) {
      bits += idx.toString(2).padStart(5, '0');
    }
  }
  
  const bytes: number[] = [];
  for (let i = 0; i + 8 <= bits.length; i += 8) {
    bytes.push(parseInt(bits.slice(i, i + 8), 2));
  }
  return bytes;
};

// Simple HMAC-SHA1 implementation
const hmacSha1 = async (key: number[], message: number[]): Promise<number[]> => {
  const blockSize = 64;
  
  // Pad or hash key
  let keyBytes = [...key];
  if (keyBytes.length > blockSize) {
    keyBytes = await sha1(keyBytes);
  }
  while (keyBytes.length < blockSize) {
    keyBytes.push(0);
  }
  
  const oKeyPad = keyBytes.map(b => b ^ 0x5c);
  const iKeyPad = keyBytes.map(b => b ^ 0x36);
  
  const inner = await sha1([...iKeyPad, ...message]);
  return await sha1([...oKeyPad, ...inner]);
};

// SHA-1 implementation
const sha1 = async (message: number[]): Promise<number[]> => {
  const msg = [...message];
  const ml = msg.length * 8;
  
  msg.push(0x80);
  while ((msg.length % 64) !== 56) {
    msg.push(0);
  }
  
  // Append length (big-endian, 64-bit)
  for (let i = 7; i >= 0; i--) {
    msg.push((ml / Math.pow(256, i)) & 0xff);
  }
  
  let h0 = 0x67452301;
  let h1 = 0xEFCDAB89;
  let h2 = 0x98BADCFE;
  let h3 = 0x10325476;
  let h4 = 0xC3D2E1F0;
  
  const rotl = (n: number, s: number) => ((n << s) | (n >>> (32 - s))) >>> 0;
  
  for (let i = 0; i < msg.length; i += 64) {
    const w: number[] = [];
    for (let j = 0; j < 16; j++) {
      w[j] = (msg[i + j * 4] << 24) | (msg[i + j * 4 + 1] << 16) | 
             (msg[i + j * 4 + 2] << 8) | msg[i + j * 4 + 3];
    }
    for (let j = 16; j < 80; j++) {
      w[j] = rotl(w[j-3] ^ w[j-8] ^ w[j-14] ^ w[j-16], 1);
    }
    
    let [a, b, c, d, e] = [h0, h1, h2, h3, h4];
    
    for (let j = 0; j < 80; j++) {
      let f: number, k: number;
      if (j < 20) {
        f = (b & c) | ((~b >>> 0) & d);
        k = 0x5A827999;
      } else if (j < 40) {
        f = b ^ c ^ d;
        k = 0x6ED9EBA1;
      } else if (j < 60) {
        f = (b & c) | (b & d) | (c & d);
        k = 0x8F1BBCDC;
      } else {
        f = b ^ c ^ d;
        k = 0xCA62C1D6;
      }
      
      const temp = (rotl(a, 5) + f + e + k + w[j]) >>> 0;
      e = d;
      d = c;
      c = rotl(b, 30);
      b = a;
      a = temp;
    }
    
    h0 = (h0 + a) >>> 0;
    h1 = (h1 + b) >>> 0;
    h2 = (h2 + c) >>> 0;
    h3 = (h3 + d) >>> 0;
    h4 = (h4 + e) >>> 0;
  }
  
  const hash: number[] = [];
  [h0, h1, h2, h3, h4].forEach(h => {
    hash.push((h >> 24) & 0xff, (h >> 16) & 0xff, (h >> 8) & 0xff, h & 0xff);
  });
  return hash;
};

// Generate TOTP
const generateTOTP = async (secret: string, counter: number): Promise<string> => {
  const keyBytes = base32Decode(secret);
  
  // Counter to 8 bytes (big-endian)
  const counterBytes: number[] = [];
  let c = counter;
  for (let i = 7; i >= 0; i--) {
    counterBytes[i] = c & 0xff;
    c = Math.floor(c / 256);
  }
  
  const hmac = await hmacSha1(keyBytes, counterBytes);
  
  // Dynamic truncation
  const offset = hmac[19] & 0x0f;
  const binary = 
    ((hmac[offset] & 0x7f) << 24) |
    ((hmac[offset + 1] & 0xff) << 16) |
    ((hmac[offset + 2] & 0xff) << 8) |
    (hmac[offset + 3] & 0xff);
  
  const otp = binary % 1000000;
  return otp.toString().padStart(6, '0');
};

// Verify TOTP
const verifyTOTP = async (token: string, secret: string): Promise<boolean> => {
  const counter = Math.floor(Date.now() / 1000 / 30);
  
  for (let i = -2; i <= 2; i++) {
    try {
      const expected = await generateTOTP(secret, counter + i);
      if (expected === token) {
        return true;
      }
    } catch (e) {
      console.error('TOTP error:', e);
    }
  }
  return false;
};

const TwoFactorVerify: React.FC<TwoFactorVerifyProps> = ({ isOpen, onClose, onVerify, secret, username }) => {
  const { showToast } = useToast();
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleVerify = async () => {
    if (code.length !== 6) return;
    
    setIsLoading(true);
    
    try {
      const isValid = await verifyTOTP(code, secret);
      
      if (isValid) {
        showToast('Doğrulama başarılı!', 'success');
        setCode('');
        onVerify();
      } else {
        showToast('Geçersiz kod! Lütfen tekrar deneyin.', 'error');
      }
    } catch (err) {
      console.error('2FA verify error:', err);
      showToast('Doğrulama hatası!', 'error');
    }
    setIsLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && code.length === 6) {
      handleVerify();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-void-950/90 backdrop-blur-sm"></div>
      
      <div className="relative bg-void-900 border border-white/10 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up">
        <div className="p-6 border-b border-white/5 flex items-center justify-between bg-gradient-to-r from-axion-blue/20 to-axion-cyan/20">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-axion-cyan/20 rounded-lg">
              <Shield className="w-6 h-6 text-axion-cyan" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">2FA Doğrulama</h2>
              <p className="text-xs text-gray-400">{username}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="text-center">
            <p className="text-gray-400 text-sm">
              Google Authenticator'daki 6 haneli kodu girin.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-2">
              Doğrulama Kodu
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              onKeyDown={handleKeyDown}
              className="w-full bg-void-950 border border-void-700 rounded-xl py-4 px-4 text-white text-center text-2xl tracking-[0.5em] font-mono focus:border-axion-cyan focus:outline-none transition-colors"
              placeholder="000000"
              maxLength={6}
              autoFocus
            />
          </div>

          <Button 
            onClick={handleVerify} 
            className="w-full"
            disabled={code.length !== 6 || isLoading}
          >
            {isLoading ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Doğrulanıyor...</>
            ) : (
              'Giriş Yap'
            )}
          </Button>

          <p className="text-xs text-gray-500 text-center">
            Kodunuza erişemiyorsanız destek ekibiyle iletişime geçin.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TwoFactorVerify;
