import React, { useState } from 'react';
import { HelpCircle, Send, AlertTriangle, FileText, CheckCircle2, DollarSign, Bug, Gavel, LayoutGrid } from 'lucide-react';
import Button from './Button';
import { SupportCategory, SupportTicket } from '../types';
import { useToast } from '../contexts/ToastContext';

interface SupportProps {
  user?: { username: string };
  onTicketCreated?: (ticket: SupportTicket) => void;
}

const Support: React.FC<SupportProps> = ({ user, onTicketCreated }) => {
  const { showToast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [category, setCategory] = useState<SupportCategory>('skyblock');
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
    banId: '',
    transactionId: '',
    evidence: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      showToast('Lütfen önce giriş yapın!', 'error');
      return;
    }

    const ticket: SupportTicket = {
      id: `TICKET-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      userId: user.username,
      username: user.username,
      category,
      subject: formData.subject,
      message: formData.message,
      banId: formData.banId || undefined,
      transactionId: formData.transactionId || undefined,
      evidence: formData.evidence || undefined,
      status: 'open',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Save to localStorage
    const existingTickets = JSON.parse(localStorage.getItem(`support_tickets_${user.username}`) || '[]');
    existingTickets.push(ticket);
    localStorage.setItem(`support_tickets_${user.username}`, JSON.stringify(existingTickets));

    // Send webhook notification
    const webhookUrl = localStorage.getItem('webhook_url');
    if (webhookUrl && webhookUrl.trim()) {
      // Discord webhook format
      const webhookData = {
        content: `🔔 **Yeni Destek Talebi**`,
        embeds: [
          {
            title: ticket.subject,
            description: ticket.message,
            color: 0x00d2ff, // Axion cyan color
            fields: [
              {
                name: '👤 Kullanıcı',
                value: ticket.username,
                inline: true
              },
              {
                name: '📋 Kategori',
                value: ticket.category,
                inline: true
              },
              {
                name: '🆔 Talep ID',
                value: ticket.id,
                inline: true
              },
              {
                name: '📅 Tarih',
                value: new Date(ticket.createdAt).toLocaleString('tr-TR'),
                inline: false
              }
            ],
            timestamp: ticket.createdAt
          }
        ]
      };

      // Add optional fields
      if (ticket.banId) {
        webhookData.embeds[0].fields.push({
          name: '🚫 Ban ID',
          value: ticket.banId,
          inline: true
        });
      }

      if (ticket.transactionId) {
        webhookData.embeds[0].fields.push({
          name: '💳 İşlem ID',
          value: ticket.transactionId,
          inline: true
        });
      }

      if (ticket.evidence) {
        webhookData.embeds[0].fields.push({
          name: '📎 Kanıt',
          value: `[Link](${ticket.evidence})`,
          inline: false
        });
      }

      fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(webhookData)
      })
      .then(response => {
        if (!response.ok) {
          console.error('Webhook gönderim hatası:', response.status, response.statusText);
        }
      })
      .catch(error => {
        console.error('Webhook gönderim hatası:', error);
      });
    }

    if (onTicketCreated) {
      onTicketCreated(ticket);
    }

    showToast('Destek talebiniz başarıyla gönderildi!', 'success');
    setSubmitted(true);
  };

  const categories = [
    { id: 'skyblock', label: 'Genel Destek', icon: <LayoutGrid className="w-4 h-4" />, desc: 'Oyun içi sorunlar' },
    { id: 'account', label: 'Hesap Sorunu', icon: <FileText className="w-4 h-4" />, desc: 'Giriş/Kayıt' },
    { id: 'bug', label: 'Bug Bildir', icon: <Bug className="w-4 h-4" />, desc: 'Hata raporlama' },
    { id: 'refund', label: 'Market / İade', icon: <DollarSign className="w-4 h-4" />, desc: 'Ödeme sorunları' },
    { id: 'ban_appeal', label: 'Ban İtiraz', icon: <Gavel className="w-4 h-4" />, desc: 'Cezalara itiraz' },
  ];

  if (submitted) {
    return (
      <div className="pt-32 pb-20 max-w-2xl mx-auto px-4 text-center animate-fade-in-up">
        <div className="bg-void-800 border border-green-500/20 rounded-2xl p-12 shadow-2xl shadow-green-900/10">
          <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Talep Oluşturuldu!</h2>
          <p className="text-gray-400 mb-8">
            Destek talebiniz başarıyla ekibimize iletildi. Yetkililerimiz en kısa sürede (genellikle 24 saat içinde) sizinle iletişime geçecektir.
            <br/><span className="text-xs mt-2 block text-gray-500">Destek taleplerinizi "Destek Taleplerim" sayfasından takip edebilirsiniz.</span>
          </p>
          <Button onClick={() => { setSubmitted(false); setFormData({subject: '', message: '', banId: '', transactionId: '', evidence: ''}); }} variant="secondary">
            Yeni Talep Oluştur
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 max-w-5xl mx-auto px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-black text-white mb-4 flex items-center justify-center gap-3">
          <HelpCircle className="text-axion-cyan w-10 h-10" /> Destek Merkezi
        </h1>
        <p className="text-gray-400 max-w-xl mx-auto">
          Bir sorun mu yaşıyorsunuz? Doğru kategoriyi seçerek en hızlı şekilde çözüm bulabilirsiniz.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Category Sidebar */}
        <div className="lg:col-span-4 space-y-4">
            <div className="glass-card p-4 rounded-xl">
                <h3 className="font-bold text-white mb-4 px-2">Kategori Seçin</h3>
                <div className="space-y-2">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setCategory(cat.id as SupportCategory)}
                            className={`w-full text-left p-3 rounded-lg transition-all flex items-center gap-3 ${
                                category === cat.id 
                                ? 'bg-axion-cyan text-void-950 font-bold shadow-lg shadow-axion-cyan/20' 
                                : 'text-gray-400 hover:bg-white/5 hover:text-white'
                            }`}
                        >
                            <div className={`p-2 rounded-md ${category === cat.id ? 'bg-white/20' : 'bg-void-950'}`}>
                                {cat.icon}
                            </div>
                            <div>
                                <div className="text-sm">{cat.label}</div>
                                <div className={`text-[10px] ${category === cat.id ? 'text-void-800' : 'text-gray-600'}`}>{cat.desc}</div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            <div className="glass-card p-6 rounded-xl border-l-4 border-l-yellow-500 bg-yellow-500/5">
                <h3 className="font-bold text-white flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-yellow-500" /> Dikkat
                </h3>
                <p className="text-xs text-gray-300 leading-relaxed">
                Yanlış kategori seçimi yanıt süresini uzatabilir. Lütfen sorununuzla en alakalı başlığı seçtiğinizden emin olun.
                </p>
            </div>
        </div>

        {/* Support Form */}
        <div className="lg:col-span-8">
          <form onSubmit={handleSubmit} className="glass-card p-8 rounded-2xl animate-fade-in">
            <h3 className="text-xl font-bold text-white mb-6 border-b border-white/5 pb-4">
                {categories.find(c => c.id === category)?.label} Formu
            </h3>
            
            <div className="space-y-6">
              
              {/* Dynamic Fields based on Category */}
              {category === 'ban_appeal' && (
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Ban ID (Cezalı Ekranda Yazar)</label>
                    <input 
                        type="text" 
                        required
                        value={formData.banId}
                        onChange={(e) => setFormData({...formData, banId: e.target.value})}
                        className="w-full bg-void-950 border border-void-700 rounded-xl py-3 px-4 text-white focus:border-axion-cyan focus:outline-none transition-colors"
                        placeholder="#BAN-12345"
                    />
                  </div>
              )}

              {category === 'refund' && (
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">İşlem ID / Sipariş No</label>
                    <input 
                        type="text" 
                        required
                        value={formData.transactionId}
                        onChange={(e) => setFormData({...formData, transactionId: e.target.value})}
                        className="w-full bg-void-950 border border-void-700 rounded-xl py-3 px-4 text-white focus:border-axion-cyan focus:outline-none transition-colors"
                        placeholder="TRX-987654321"
                    />
                  </div>
              )}

              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">Konu Başlığı</label>
                <input 
                  type="text" 
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  className="w-full bg-void-950 border border-void-700 rounded-xl py-3 px-4 text-white focus:border-axion-cyan focus:outline-none transition-colors"
                  placeholder="Kısaca sorununuzu özetleyin..."
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">
                    {category === 'bug' ? 'Hata Detayları ve Oluşma Adımları' : 
                     category === 'ban_appeal' ? 'Savunmanız' : 'Mesajınız'}
                </label>
                <textarea 
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  rows={6}
                  className="w-full bg-void-950 border border-void-700 rounded-xl p-4 text-white focus:border-axion-cyan focus:outline-none transition-colors resize-none"
                  placeholder="Detaylı bir açıklama yapın..."
                ></textarea>
              </div>

              {(category === 'ban_appeal' || category === 'bug') && (
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Kanıt (Resim/Video Linki)</label>
                    <input 
                        type="url" 
                        value={formData.evidence}
                        onChange={(e) => setFormData({...formData, evidence: e.target.value})}
                        className="w-full bg-void-950 border border-void-700 rounded-xl py-3 px-4 text-white focus:border-axion-cyan focus:outline-none transition-colors"
                        placeholder="https://imgur.com/..."
                    />
                  </div>
              )}

              <div className="flex justify-end pt-4">
                <Button variant="primary" className="w-full md:w-auto">
                  Talebi Gönder <Send className="w-4 h-4" />
                </Button>
              </div>

            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Support;