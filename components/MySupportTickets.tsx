import React, { useState, useEffect } from 'react';
import { MessageSquare, Clock, CheckCircle, XCircle, AlertCircle, Search, Filter } from 'lucide-react';
import { User, SupportTicket } from '../types';
import { useToast } from '../contexts/ToastContext';

interface MySupportTicketsProps {
  user: User;
  onUpdate: (updatedUser: Partial<User>) => void;
}

const MySupportTickets: React.FC<MySupportTicketsProps> = ({ user, onUpdate }) => {
  const { showToast } = useToast();
  const [tickets, setTickets] = useState<SupportTicket[]>(user.supportTickets || []);
  const [filter, setFilter] = useState<'all' | 'open' | 'in_progress' | 'resolved' | 'closed'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Load tickets from localStorage
    const savedTickets = localStorage.getItem(`support_tickets_${user.username}`);
    if (savedTickets) {
      const parsedTickets = JSON.parse(savedTickets);
      setTickets(parsedTickets);
      onUpdate({ supportTickets: parsedTickets });
    }
  }, [user.username, onUpdate]);

  const filteredTickets = tickets.filter(ticket => {
    const matchesFilter = filter === 'all' || ticket.status === filter;
    const matchesSearch = ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.message.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (status: SupportTicket['status']) => {
    switch (status) {
      case 'open': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/50';
      case 'in_progress': return 'bg-blue-500/10 text-blue-400 border-blue-500/50';
      case 'resolved': return 'bg-green-500/10 text-green-400 border-green-500/50';
      case 'closed': return 'bg-gray-500/10 text-gray-400 border-gray-500/50';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/50';
    }
  };

  const getStatusIcon = (status: SupportTicket['status']) => {
    switch (status) {
      case 'open': return <Clock className="w-4 h-4" />;
      case 'in_progress': return <AlertCircle className="w-4 h-4" />;
      case 'resolved': return <CheckCircle className="w-4 h-4" />;
      case 'closed': return <XCircle className="w-4 h-4" />;
      default: return <MessageSquare className="w-4 h-4" />;
    }
  };

  const getStatusLabel = (status: SupportTicket['status']) => {
    switch (status) {
      case 'open': return 'Açık';
      case 'in_progress': return 'İnceleniyor';
      case 'resolved': return 'Çözüldü';
      case 'closed': return 'Kapatıldı';
      default: return status;
    }
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      skyblock: 'Genel Destek',
      account: 'Hesap Sorunu',
      bug: 'Bug Bildir',
      refund: 'Market / İade',
      ban_appeal: 'Ban İtiraz',
      other: 'Diğer'
    };
    return labels[category] || category;
  };

  if (tickets.length === 0) {
    return (
      <div className="pt-24 pb-20 max-w-4xl mx-auto px-4">
        <div className="text-center py-20">
          <MessageSquare className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Henüz Destek Talebiniz Yok</h2>
          <p className="text-gray-400 mb-6">Destek talebi oluşturmak için Destek sayfasını ziyaret edin.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white mb-2 flex items-center gap-3">
          <MessageSquare className="w-8 h-8 text-axion-cyan" />
          Destek Taleplerim
        </h1>
        <p className="text-gray-400">Tüm destek taleplerinizi buradan görüntüleyebilirsiniz.</p>
      </div>

      {/* Filters and Search */}
      <div className="glass-card p-4 rounded-xl mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Talep ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-void-950 border border-void-700 rounded-lg py-2 pl-10 pr-4 text-white focus:border-axion-cyan focus:outline-none transition-colors"
          />
        </div>
        <div className="flex gap-2">
          {(['all', 'open', 'in_progress', 'resolved', 'closed'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === status
                  ? 'bg-axion-cyan text-void-950'
                  : 'bg-void-950 text-gray-400 hover:text-white hover:bg-void-800'
              }`}
            >
              {status === 'all' ? 'Tümü' : getStatusLabel(status)}
            </button>
          ))}
        </div>
      </div>

      {/* Tickets List */}
      <div className="space-y-4">
        {filteredTickets.map((ticket) => (
          <div
            key={ticket.id}
            className="glass-card rounded-xl p-6 hover:border-axion-cyan/30 transition-all border border-white/5"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-bold text-white">{ticket.subject}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1 ${getStatusColor(ticket.status)}`}>
                    {getStatusIcon(ticket.status)}
                    {getStatusLabel(ticket.status)}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                  <span className="flex items-center gap-1">
                    <MessageSquare className="w-4 h-4" />
                    {getCategoryLabel(ticket.category)}
                  </span>
                  <span>#{ticket.id}</span>
                  <span>{new Date(ticket.createdAt).toLocaleDateString('tr-TR')}</span>
                </div>
              </div>
            </div>

            <div className="bg-void-950/50 rounded-lg p-4 mb-4">
              <p className="text-gray-300 whitespace-pre-wrap">{ticket.message}</p>
            </div>

            {ticket.banId && (
              <div className="mb-2 text-sm">
                <span className="text-gray-400">Ban ID: </span>
                <span className="text-white font-mono">{ticket.banId}</span>
              </div>
            )}

            {ticket.transactionId && (
              <div className="mb-2 text-sm">
                <span className="text-gray-400">İşlem ID: </span>
                <span className="text-white font-mono">{ticket.transactionId}</span>
              </div>
            )}

            {ticket.evidence && (
              <div className="mb-2 text-sm">
                <span className="text-gray-400">Kanıt: </span>
                <a href={ticket.evidence} target="_blank" rel="noopener noreferrer" className="text-axion-cyan hover:underline">
                  {ticket.evidence}
                </a>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredTickets.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400">Aradığınız kriterlere uygun talep bulunamadı.</p>
        </div>
      )}
    </div>
  );
};

export default MySupportTickets;

