import React, { useState } from 'react';
import { ShoppingCart, Crown, Key, Skull, Zap, Info, Feather, Hammer, Box, Users, Star, ArrowUpCircle, ShieldCheck } from 'lucide-react';
import Button from './Button';
import { StoreItem } from '../types';
import { useToast } from '../contexts/ToastContext';

const Store: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<'vip' | 'keys' | 'spawner' | 'boost'>('vip');
  const { showToast } = useToast();

  const categories = [
    { id: 'vip', label: 'Rütbeler', icon: <Crown className="w-5 h-5" />, color: 'text-yellow-400' },
    { id: 'keys', label: 'Kasa Anahtarları', icon: <Key className="w-5 h-5" />, color: 'text-purple-400' },
    { id: 'spawner', label: 'Spawnerlar', icon: <Skull className="w-5 h-5" />, color: 'text-red-400' },
    { id: 'boost', label: 'Güçlendirmeler', icon: <Zap className="w-5 h-5" />, color: 'text-blue-400' },
  ];

  const axionImage = new URL('./assets/axion.png', import.meta.url).href;

  const items: StoreItem[] = [
    // VIPs - Based on ChickenNW / Classic Skyblock Perks
    {
      id: 1,
      name: "VIP",
      price: 40,
      image: axionImage,
      category: 'vip',
      tag: "BAŞLANGIÇ",
      perks: [
        { label: "Ada Uçuşu (/fly)", icon: <Feather className="w-4 h-4" /> },
        { label: "Sohbet Rengi: Beyaz", icon: <Star className="w-4 h-4" /> },
        { label: "Kit: VIP (Günlük)", icon: <Box className="w-4 h-4" /> },
        { label: "2 Adet Ada Hakkı", icon: <Users className="w-4 h-4" /> },
        { label: "1x Sanal Sandık", icon: <Box className="w-4 h-4" /> },
      ]
    },
    {
      id: 2,
      name: "VIP+",
      price: 80,
      image: axionImage,
      category: 'vip',
      tag: "POPÜLER",
      perks: [
        { label: "Ada & Lobi Uçuşu", icon: <Feather className="w-4 h-4" /> },
        { label: "Eşya Tamiri (/repair)", icon: <Hammer className="w-4 h-4" /> },
        { label: "Kit: VIP+ (Günlük)", icon: <Box className="w-4 h-4" /> },
        { label: "4 Adet Ada Hakkı", icon: <Users className="w-4 h-4" /> },
        { label: "3x Sanal Sandık", icon: <Box className="w-4 h-4" /> },
        { label: "Renkli Yazı Hakkı", icon: <Star className="w-4 h-4" /> },
      ]
    },
    {
      id: 3,
      name: "MVIP",
      price: 150,
      image: axionImage,
      category: 'vip',
      perks: [
        { label: "Her Yerde Uçuş", icon: <Feather className="w-4 h-4" /> },
        { label: "Otomatik Tamir", icon: <Hammer className="w-4 h-4" /> },
        { label: "Kit: MVIP (Özel Eşyalar)", icon: <Box className="w-4 h-4" /> },
        { label: "6 Adet Ada Hakkı", icon: <Users className="w-4 h-4" /> },
        { label: "5x Sanal Sandık", icon: <Box className="w-4 h-4" /> },
        { label: "Spawner Hızı %10", icon: <Zap className="w-4 h-4" /> },
        { label: "Özel Giriş Mesajı", icon: <Star className="w-4 h-4" /> },
      ]
    },
    {
      id: 4,
      name: "AXION",
      price: 300,
      image: axionImage,
      category: 'vip',
      tag: "EN İYİSİ",
      perks: [
        { label: "Sınırsız /feed & /heal", icon: <ShieldCheck className="w-4 h-4" /> },
        { label: "Tüm Tamir Yetkileri", icon: <Hammer className="w-4 h-4" /> },
        { label: "Kit: AXION (P5 Set)", icon: <Box className="w-4 h-4" /> },
        { label: "8 Adet Ada Hakkı", icon: <Users className="w-4 h-4" /> },
        { label: "Sınırsız Sanal Sandık", icon: <Box className="w-4 h-4" /> },
        { label: "Spawner Hızı %25", icon: <Zap className="w-4 h-4" /> },
        { label: "Özel Tag Tasarımı", icon: <Star className="w-4 h-4" /> },
      ]
    },
    // Keys
    {
      id: 5,
      name: "3x Vote Kasası",
      price: 10,
      image: axionImage,
      category: 'keys',
      perks: [{ label: "Rastgele Ödüller", icon: <Box className="w-4 h-4" /> }]
    },
    {
      id: 6,
      name: "1x Spawner Kasası",
      price: 45,
      image: axionImage,
      category: 'keys',
      perks: [{ label: "%100 Spawner Çıkar", icon: <Skull className="w-4 h-4" /> }]
    },
    {
      id: 7,
      name: "5x Efsanevi Kasa",
      price: 75,
      image: axionImage,
      category: 'keys',
      tag: "FIRSAT",
      perks: [{ label: "En Değerli Eşyalar", icon: <Crown className="w-4 h-4" /> }]
    },
    // Spawners
    {
      id: 8,
      name: "Demir Golem",
      price: 60,
      image: axionImage,
      category: 'spawner',
      perks: [{ label: "Demir Üretimi", icon: <Box className="w-4 h-4" /> }]
    },
    {
      id: 9,
      name: "Blaze",
      price: 40,
      image: axionImage,
      category: 'spawner',
      perks: [{ label: "XP ve Yakıt", icon: <Zap className="w-4 h-4" /> }]
    },
    // Boosts
    {
      id: 10,
      name: "Uçuş Bileti (1 Hafta)",
      price: 25,
      image: axionImage,
      category: 'boost',
      perks: [{ label: "Geçici Fly Yetkisi", icon: <Feather className="w-4 h-4" /> }]
    },
    {
      id: 11,
      name: "Ada Büyümesi",
      price: 30,
      image: axionImage,
      category: 'boost',
      perks: [{ label: "+50x50 Ada Alanı", icon: <ArrowUpCircle className="w-4 h-4" /> }]
    }
  ];

  const filteredItems = items.filter(item => item.category === activeCategory);

  return (
    <div className="pt-32 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-black text-white mb-4 drop-shadow-lg">
          SUNUCU <span className="text-axion-cyan">MARKETİ</span>
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Oyun deneyiminizi bir üst seviyeye taşıyın. Satın alımlar anında hesabınıza tanımlanır.
        </p>
      </div>

      {/* Modern Category Tabs */}
      <div className="flex flex-wrap justify-center gap-4 mb-12">
        {categories.map((cat) => (
            <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id as any)}
                className={`flex items-center gap-3 px-6 py-4 rounded-xl font-bold transition-all transform hover:-translate-y-1 ${
                    activeCategory === cat.id
                    ? 'bg-gradient-to-r from-axion-blue to-axion-cyan text-void-950 shadow-lg shadow-axion-cyan/30 scale-105'
                    : 'glass-card text-gray-400 hover:text-white hover:bg-white/5'
                }`}
            >
                <div className={`${activeCategory === cat.id ? 'text-void-950' : cat.color}`}>
                    {cat.icon}
                </div>
                {cat.label}
            </button>
        ))}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {filteredItems.map((item) => (
            <div key={item.id} className="group relative bg-void-800 rounded-2xl border border-white/5 overflow-hidden hover:border-axion-cyan/50 transition-all hover:shadow-2xl hover:shadow-axion-cyan/10 flex flex-col">
                
                {/* Tag */}
                {item.tag && (
                    <div className="absolute top-4 right-4 z-20 bg-axion-gold text-void-950 text-[10px] font-black px-2 py-1 rounded shadow-lg animate-pulse">
                        {item.tag}
                    </div>
                )}

                {/* Image Area */}
                <div className="h-40 bg-gradient-to-b from-void-700 to-void-800 flex items-center justify-center p-6 relative overflow-hidden group-hover:from-void-600 transition-colors">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
                        {/* Glow Effect */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-axion-cyan/20 rounded-full blur-2xl group-hover:bg-axion-cyan/40 transition-all"></div>
                        
                        <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-20 h-20 object-contain relative z-10 drop-shadow-2xl transform group-hover:scale-110 transition-transform duration-300 pixelated rounded-full" 
                        style={{ imageRendering: 'pixelated' }}
                        />
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-xl font-black text-white mb-4 text-center group-hover:text-axion-cyan transition-colors">{item.name}</h3>
                    
                    <div className="flex-1 space-y-3 mb-6">
                        {item.perks.map((perk, idx) => (
                            <div key={idx} className="flex items-center gap-3 text-xs text-gray-300 bg-void-950/50 p-2 rounded border border-white/5 group-hover:border-white/10 transition-colors">
                                <div className="text-axion-cyan">
                                    {perk.icon || <Star className="w-3 h-3" />}
                                </div>
                                <span className="font-semibold">{perk.label}</span>
                            </div>
                        ))}
                    </div>

                    <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between gap-3">
                        <div className="text-xl font-black text-white">
                            {item.price} <span className="text-xs text-gray-400 font-normal">Kredi</span>
                        </div>
                        <Button className="flex-1 text-xs py-2 !rounded-lg h-10" onClick={() => {
                          showToast(`${item.name} sepete eklendi!`, 'success');
                        }}>
                            Satın Al
                        </Button>
                    </div>
                </div>
            </div>
        ))}
      </div>

      <div className="mt-12 p-6 rounded-xl bg-blue-500/5 border border-blue-500/20 flex items-start gap-4 max-w-2xl mx-auto">
         <Info className="w-6 h-6 text-blue-400 flex-shrink-0" />
         <div>
             <h4 className="text-blue-400 font-bold mb-1">Bilgilendirme</h4>
             <p className="text-sm text-blue-200/70">
                 Market üzerinden yapılan alışverişlerde "Oyun Parası" satışı yapılmamaktadır. 
                 Sadece kozmetik, kolaylık sağlayan yetkiler ve spawner gibi oyun içi gelişimi hızlandıran eşyalar satılmaktadır.
                 Axion Craft, P2W (Pay to Win) karşıtı bir politika izler.
             </p>
         </div>
      </div>
    </div>
  );
};

export default Store;