import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Users, Terminal, ShoppingBag, Settings, ShieldAlert, Ban, MicOff, Coins, Search, RefreshCw, Cpu, Activity, DollarSign, MessageSquare, Crown, UserCheck, UserX, Crown as CrownIcon, Send, X, WifiOff } from 'lucide-react';
import { User, SupportTicket, UserRole, SupportTicketReply } from '../types';
import Button from './Button';
import { useToast } from '../contexts/ToastContext';

interface AdminPanelProps {
  user: User;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ user }) => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'console' | 'support-tickets' | 'settings' | 'players'>('dashboard');
  const [webhookUrl, setWebhookUrl] = useState<string>('');
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [allTickets, setAllTickets] = useState<SupportTicket[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [isReplying, setIsReplying] = useState(false);
  const [serverPlayers, setServerPlayers] = useState<Array<{ name: string; playTime?: string }>>([]);
  const [serverStatus, setServerStatus] = useState<{ online: boolean; players: number; max: number; loading: boolean }>({
    online: false,
    players: 0,
    max: 0,
    loading: true
  });
  const [logs, setLogs] = useState<string[]>([
    "[14:20:01 INFO]: AxionCore enabled.",
    "[14:20:05 INFO]: Loading skyblock worlds...",
    "[14:20:10 WARN]: Lag detected in world 'ASkyBlock_nether'",
    "[14:21:00 INFO]: Player Jexa joined the game.",
    "[14:21:05 INFO]: [AuthMe] Jexa logged in!",
  ]);

  // Fake logs generator
  useEffect(() => {
    const interval = setInterval(() => {
        const actions = ["INFO", "WARN", "ERROR"];
        const messages = [
            "Saving player data...",
            "Block broken at x:100 y:64 z:200",
            "Async chat thread started",
            "Player executed command /is go",
            "Connection reset by peer"
        ];
        const randomAction = actions[Math.floor(Math.random() * actions.length)];
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        const time = new Date().toLocaleTimeString();
        
        setLogs(prev => [...prev.slice(-15), `[${time} ${randomAction}]: ${randomMessage}`]);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Fetch server players and status
  useEffect(() => {
    const fetchServerData = async () => {
      try {
        // Sunucu portu 25574 olarak güncellendi
        const response = await fetch('https://api.mcsrvstat.us/2/play.axioncraft.himsey.com:25574');
        const data = await response.json();
        
        setServerStatus({
          online: data.online || false,
          players: data.online && data.players ? data.players.online : 0,
          max: data.online && data.players ? data.players.max : 0,
          loading: false
        });

        if (activeTab === 'players' && data.online && data.players && data.players.list) {
          // Map players with mock playtime (gerçek API'den gelmiyorsa)
          const players = data.players.list.map((playerName: string) => ({
            name: playerName,
            playTime: `${Math.floor(Math.random() * 24)} Sa, ${Math.floor(Math.random() * 60)} Dk` // Mock data - gerçek API'den gelmiyorsa
          }));
          setServerPlayers(players);
        } else if (activeTab === 'players') {
          setServerPlayers([]);
        }
      } catch (error) {
        console.error('Failed to fetch server data', error);
        setServerStatus(prev => ({ ...prev, loading: false, online: false }));
        if (activeTab === 'players') {
          setServerPlayers([]);
        }
      }
    };

    fetchServerData();
    const interval = setInterval(fetchServerData, 30000); // Her 30 saniyede bir güncelle
    return () => clearInterval(interval);
  }, [activeTab]);

  // Load all users and tickets
  useEffect(() => {
    // Load webhook URL from localStorage
    const savedWebhookUrl = localStorage.getItem('webhook_url');
    if (savedWebhookUrl) {
      setWebhookUrl(savedWebhookUrl);
    }

    // Load users from localStorage
    const users: User[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('axion_user')) {
        try {
          const userData = JSON.parse(localStorage.getItem(key) || '{}');
          if (userData.username) {
            // Load support tickets for this user
            const tickets = JSON.parse(localStorage.getItem(`support_tickets_${userData.username}`) || '[]');
            userData.supportTickets = tickets;
            users.push(userData);
          }
        } catch (e) {
          // Skip invalid entries
        }
      }
    }
    setAllUsers(users);

    // Load all tickets
    const tickets: SupportTicket[] = [];
    users.forEach(u => {
      if (u.supportTickets) {
        tickets.push(...u.supportTickets);
      }
    });
    setAllTickets(tickets.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
  }, []);

  if (!user.isAdmin && !user.isOwner) {
      return (
          <div className="min-h-screen flex items-center justify-center pt-24 text-red-500">
              <ShieldAlert className="w-12 h-12 mb-4" />
              <h1 className="text-2xl font-bold">Erişim Reddedildi</h1>
          </div>
      );
  }

  const handleRoleChange = (username: string, newRole: UserRole) => {
    const updatedUsers = allUsers.map(u => {
      if (u.username === username) {
        const updated = { ...u, role: newRole, isAdmin: newRole === 'admin' || newRole === 'owner', isOwner: newRole === 'owner' };
        localStorage.setItem('axion_user', JSON.stringify(updated));
        showToast(`${username} kullanıcısının rolü ${newRole} olarak güncellendi.`, 'success');
        return updated;
      }
      return u;
    });
    setAllUsers(updatedUsers);
  };

  const handleTicketStatusChange = (ticketId: string, newStatus: SupportTicket['status']) => {
    const updatedTickets = allTickets.map(t => {
      if (t.id === ticketId) {
        return { ...t, status: newStatus, updatedAt: new Date().toISOString() };
      }
      return t;
    });
    setAllTickets(updatedTickets);

    // Update in localStorage
    allUsers.forEach(u => {
      if (u.supportTickets) {
        const updated = u.supportTickets.map(t => 
          t.id === ticketId ? { ...t, status: newStatus, updatedAt: new Date().toISOString() } : t
        );
        localStorage.setItem(`support_tickets_${u.username}`, JSON.stringify(updated));
      }
    });

    showToast('Talep durumu güncellendi.', 'success');
  };

  const handleReply = (ticketId: string) => {
    if (!replyMessage.trim()) {
      showToast('Lütfen bir mesaj yazın!', 'error');
      return;
    }

    const reply: SupportTicketReply = {
      id: `REPLY-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      userId: user.username,
      username: user.username,
      message: replyMessage,
      createdAt: new Date().toISOString(),
      isStaff: true
    };

    const updatedTickets = allTickets.map(t => {
      if (t.id === ticketId) {
        const replies = t.replies || [];
        return { ...t, replies: [...replies, reply], status: 'in_progress' as SupportTicket['status'], updatedAt: new Date().toISOString() };
      }
      return t;
    });
    setAllTickets(updatedTickets);

    // Update in localStorage
    allUsers.forEach(u => {
      if (u.supportTickets) {
        const updated = u.supportTickets.map(t => {
          if (t.id === ticketId) {
            const replies = t.replies || [];
            return { ...t, replies: [...replies, reply], status: 'in_progress' as SupportTicket['status'], updatedAt: new Date().toISOString() };
          }
          return t;
        });
        localStorage.setItem(`support_tickets_${u.username}`, JSON.stringify(updated));
      }
    });

    setReplyMessage('');
    setIsReplying(false);
    setSelectedTicket(null);
    showToast('Yanıt başarıyla gönderildi!', 'success');
  };

  // Simulate webhook for new tickets - checks for new tickets every 3 seconds
  useEffect(() => {
    if (activeTab !== 'support-tickets') return;

    const checkForNewTickets = () => {
      const newTickets: SupportTicket[] = [];
      allUsers.forEach(u => {
        if (u.supportTickets) {
          u.supportTickets.forEach(ticket => {
            // Check if ticket is new (created in last 10 seconds) and not already in allTickets
            const ticketTime = new Date(ticket.createdAt).getTime();
            const now = Date.now();
            const isNew = (now - ticketTime) < 10000;
            const exists = allTickets.some(t => t.id === ticket.id);
            
            if (isNew && !exists) {
              newTickets.push(ticket);
            }
          });
        }
      });

      if (newTickets.length > 0) {
        setAllTickets(prev => [...newTickets, ...prev].sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ));
        showToast(`${newTickets.length} yeni destek talebi webhook ile alındı!`, 'info');
      }
    };

    const interval = setInterval(checkForNewTickets, 3000);
    return () => clearInterval(interval);
  }, [allUsers, allTickets, activeTab, showToast]);

  const renderDashboard = () => (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
          <div className="glass-card p-6 rounded-xl border-l-4 border-l-green-500">
              <div className="flex justify-between items-start">
                  <div>
                      <p className="text-gray-400 text-sm font-bold uppercase">Aktif Oyuncular</p>
                      <h3 className="text-3xl font-black text-white mt-1">
                        {serverStatus.loading ? '...' : serverStatus.online ? serverStatus.players.toLocaleString() : '0'}
                      </h3>
                  </div>
                  <Users className="w-8 h-8 text-green-500 opacity-50" />
              </div>
              <div className="mt-4 w-full bg-void-950 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-green-500 h-full rounded-full transition-all duration-500" 
                    style={{ width: `${serverStatus.max > 0 ? (serverStatus.players / serverStatus.max) * 100 : 0}%` }}
                  ></div>
              </div>
          </div>

          <div className="glass-card p-6 rounded-xl border-l-4 border-l-axion-cyan">
              <div className="flex justify-between items-start">
                  <div>
                      <p className="text-gray-400 text-sm font-bold uppercase">Aylık Ciro</p>
                      <h3 className="text-3xl font-black text-white mt-1">₺15,420</h3>
                  </div>
                  <DollarSign className="w-8 h-8 text-axion-cyan opacity-50" />
              </div>
              <div className="mt-4 text-xs text-green-400 flex items-center gap-1">
                  <Activity className="w-3 h-3" /> Geçen aya göre +%12
              </div>
          </div>

          <div className="glass-card p-6 rounded-xl border-l-4 border-l-red-500">
              <div className="flex justify-between items-start">
                  <div>
                      <p className="text-gray-400 text-sm font-bold uppercase">Sunucu Yükü (TPS)</p>
                      <h3 className="text-3xl font-black text-white mt-1">19.85</h3>
                  </div>
                  <Cpu className="w-8 h-8 text-red-500 opacity-50" />
              </div>
              <div className="mt-4 w-full bg-void-950 h-2 rounded-full overflow-hidden">
                  <div className="bg-green-500 w-[95%] h-full rounded-full"></div>
              </div>
          </div>

          <div className="glass-card p-6 rounded-xl md:col-span-3">
              <h3 className="font-bold text-white mb-4">Son İşlemler</h3>
              <table className="w-full text-left text-sm text-gray-400">
                  <thead className="bg-void-950/50 text-gray-200 uppercase text-xs">
                      <tr>
                          <th className="p-3">Kullanıcı</th>
                          <th className="p-3">İşlem</th>
                          <th className="p-3">Tutar</th>
                          <th className="p-3">Tarih</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                      <tr>
                          <td className="p-3 text-white font-bold">Ahmet123</td>
                          <td className="p-3">VIP Satın Alımı</td>
                          <td className="p-3 text-green-400">+40 TL</td>
                          <td className="p-3">Az önce</td>
                      </tr>
                      <tr>
                          <td className="p-3 text-white font-bold">CraftMaster</td>
                          <td className="p-3">Spawner Kasası</td>
                          <td className="p-3 text-green-400">+45 TL</td>
                          <td className="p-3">5 dk önce</td>
                      </tr>
                  </tbody>
              </table>
          </div>
      </div>
  );

  const renderUsers = () => {
    const filteredUsers = allUsers.filter(u => 
      u.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getRoleBadge = (role?: UserRole) => {
      const badges: Record<UserRole, { bg: string; text: string; label: string }> = {
        owner: { bg: 'bg-red-500/20', text: 'text-red-400', label: 'OWNER' },
        admin: { bg: 'bg-purple-500/20', text: 'text-purple-400', label: 'ADMIN' },
        staff: { bg: 'bg-blue-500/20', text: 'text-blue-400', label: 'STAFF' },
        mvp: { bg: 'bg-axion-gold/20', text: 'text-axion-gold', label: 'MVP' },
        vip: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', label: 'VIP' },
        player: { bg: 'bg-gray-500/20', text: 'text-gray-400', label: 'OYUNCU' }
      };
      const badge = badges[role || 'player'];
      return <span className={`${badge.bg} ${badge.text} text-[10px] px-2 py-1 rounded font-bold`}>{badge.label}</span>;
    };

    return (
      <div className="glass-card rounded-xl overflow-hidden animate-fade-in">
          <div className="p-6 border-b border-white/5 flex flex-col md:flex-row justify-between gap-4">
              <h3 className="text-xl font-bold text-white">Kullanıcı Yönetimi</h3>
              <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input 
                    type="text" 
                    placeholder="Kullanıcı ara..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-void-950 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:border-axion-cyan outline-none" 
                  />
              </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-400">
                <thead className="bg-void-950/50 text-gray-200 uppercase text-xs">
                    <tr>
                        <th className="p-4">Kullanıcı</th>
                        <th className="p-4">Rol</th>
                        <th className="p-4">Rütbe</th>
                        <th className="p-4">Kredi</th>
                        <th className="p-4">Rol Değiştir</th>
                        <th className="p-4 text-right">İşlemler</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                    {filteredUsers.map((u) => (
                      <tr key={u.username} className="hover:bg-white/5 transition-colors">
                          <td className="p-4 flex items-center gap-3">
                              <img src={u.avatar} alt={u.username} className="w-8 h-8 rounded" />
                              <span className="text-white font-bold">{u.username}</span>
                          </td>
                          <td className="p-4">{getRoleBadge(u.role)}</td>
                          <td className="p-4"><span className="bg-gray-700 text-white text-[10px] px-2 py-1 rounded font-bold">{u.rank}</span></td>
                          <td className="p-4 text-axion-cyan font-mono">{u.credits}</td>
                          <td className="p-4">
                            {(user.isOwner || user.isAdmin) && (
                              <select
                                value={u.role || 'player'}
                                onChange={(e) => handleRoleChange(u.username, e.target.value as UserRole)}
                                className="bg-void-950 border border-white/10 rounded px-2 py-1 text-xs text-white focus:border-axion-cyan outline-none"
                                disabled={u.role === 'owner' && !user.isOwner}
                              >
                                <option value="player">Oyuncu</option>
                                <option value="vip">VIP</option>
                                <option value="mvp">MVP</option>
                                <option value="staff">Staff</option>
                                {user.isOwner && <option value="admin">Admin</option>}
                                {user.isOwner && <option value="owner">Owner</option>}
                              </select>
                            )}
                          </td>
                          <td className="p-4 flex justify-end gap-2">
                              <button className="p-2 hover:bg-red-500/20 text-red-500 rounded" title="Banla"><Ban className="w-4 h-4" /></button>
                              <button className="p-2 hover:bg-yellow-500/20 text-yellow-500 rounded" title="Mutele"><MicOff className="w-4 h-4" /></button>
                              <button className="p-2 hover:bg-green-500/20 text-green-500 rounded" title="Kredi Ver"><Coins className="w-4 h-4" /></button>
                          </td>
                      </tr>
                    ))}
                    {filteredUsers.length === 0 && (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-gray-500">
                          Kullanıcı bulunamadı.
                        </td>
                      </tr>
                    )}
                </tbody>
            </table>
          </div>
      </div>
    );
  };

  const renderSupportTickets = () => {
    const canAccess = user.isOwner || user.isAdmin || user.role === 'staff';
    
    if (!canAccess) {
      return (
        <div className="text-center py-12 text-red-400">
          <ShieldAlert className="w-12 h-12 mx-auto mb-4" />
          <p>Bu sayfaya sadece Owner, Admin veya Staff erişebilir.</p>
        </div>
      );
    }

    const getStatusColor = (status: SupportTicket['status']) => {
      switch (status) {
        case 'open': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/50';
        case 'in_progress': return 'bg-blue-500/10 text-blue-400 border-blue-500/50';
        case 'resolved': return 'bg-green-500/10 text-green-400 border-green-500/50';
        case 'closed': return 'bg-gray-500/10 text-gray-400 border-gray-500/50';
        default: return 'bg-gray-500/10 text-gray-400 border-gray-500/50';
      }
    };

    return (
      <div className="space-y-4 animate-fade-in">
        <div className="glass-card p-6 rounded-xl">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-axion-cyan" />
            Tüm Destek Talepleri ({allTickets.length})
          </h3>
        </div>

        {allTickets.map((ticket) => (
          <div key={ticket.id} className="glass-card rounded-xl p-6 border border-white/5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h4 className="text-lg font-bold text-white">{ticket.subject}</h4>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(ticket.status)}`}>
                    {ticket.status === 'open' ? 'Açık' : ticket.status === 'in_progress' ? 'İnceleniyor' : ticket.status === 'resolved' ? 'Çözüldü' : 'Kapatıldı'}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                  <span className="font-bold text-white">{ticket.username}</span>
                  <span>#{ticket.id}</span>
                  <span>{ticket.category}</span>
                  <span>{new Date(ticket.createdAt).toLocaleDateString('tr-TR')}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <select
                  value={ticket.status}
                  onChange={(e) => handleTicketStatusChange(ticket.id, e.target.value as SupportTicket['status'])}
                  className="bg-void-950 border border-white/10 rounded px-3 py-2 text-sm text-white focus:border-axion-cyan outline-none"
                >
                  <option value="open">Açık</option>
                  <option value="in_progress">İnceleniyor</option>
                  <option value="resolved">Çözüldü</option>
                  <option value="closed">Kapatıldı</option>
                </select>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedTicket(ticket);
                    setIsReplying(true);
                  }}
                  className="!px-3 !py-2 text-xs"
                >
                  <Send className="w-4 h-4" /> Yanıt Ver
                </Button>
              </div>
            </div>
            <div className="bg-void-950/50 rounded-lg p-4 mb-4">
              <p className="text-gray-300 whitespace-pre-wrap">{ticket.message}</p>
            </div>
            
            {/* Replies */}
            {ticket.replies && ticket.replies.length > 0 && (
              <div className="mt-4 space-y-3">
                <h5 className="text-sm font-bold text-gray-400 uppercase">Yanıtlar</h5>
                {ticket.replies.map((reply) => (
                  <div key={reply.id} className={`bg-void-950/50 rounded-lg p-4 border ${reply.isStaff ? 'border-axion-cyan/30' : 'border-white/5'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white">{reply.username}</span>
                        {reply.isStaff && (
                          <span className="text-[10px] bg-axion-cyan/20 text-axion-cyan px-2 py-0.5 rounded">STAFF</span>
                        )}
                      </div>
                      <span className="text-xs text-gray-500">{new Date(reply.createdAt).toLocaleString('tr-TR')}</span>
                    </div>
                    <p className="text-gray-300 text-sm whitespace-pre-wrap">{reply.message}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Reply Form */}
            {selectedTicket?.id === ticket.id && isReplying && (
              <div className="mt-4 p-4 bg-void-950/50 rounded-lg border border-axion-cyan/30">
                <div className="flex items-center justify-between mb-3">
                  <h5 className="text-sm font-bold text-white">Yanıt Yaz</h5>
                  <button
                    onClick={() => {
                      setIsReplying(false);
                      setSelectedTicket(null);
                      setReplyMessage('');
                    }}
                    className="text-gray-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <textarea
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  placeholder="Yanıtınızı yazın..."
                  rows={4}
                  className="w-full bg-void-900 border border-void-700 rounded-lg p-3 text-white focus:border-axion-cyan focus:outline-none resize-none mb-3"
                />
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsReplying(false);
                      setSelectedTicket(null);
                      setReplyMessage('');
                    }}
                    className="!px-4 !py-2"
                  >
                    İptal
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => handleReply(ticket.id)}
                    className="!px-4 !py-2"
                  >
                    <Send className="w-4 h-4" /> Gönder
                  </Button>
                </div>
              </div>
            )}

            {ticket.banId && <div className="mt-2 text-sm text-gray-400">Ban ID: <span className="text-white">{ticket.banId}</span></div>}
            {ticket.transactionId && <div className="mt-2 text-sm text-gray-400">İşlem ID: <span className="text-white">{ticket.transactionId}</span></div>}
            {ticket.evidence && (
              <div className="mt-2 text-sm text-gray-400">
                Kanıt: <a href={ticket.evidence} target="_blank" rel="noopener noreferrer" className="text-axion-cyan hover:underline">{ticket.evidence}</a>
              </div>
            )}
          </div>
        ))}

        {allTickets.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Henüz destek talebi yok.</p>
          </div>
        )}
      </div>
    );
  };

  const renderPlayers = () => {
    return (
      <div className="space-y-6 animate-fade-in">
        {/* Server Status */}
        <div className="glass-card rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Users className="w-6 h-6 text-axion-cyan" />
              play.axioncraft.himsey.com
            </h3>
            <div className="flex items-center gap-2">
              {serverStatus.online ? (
                <span className="flex items-center gap-2 text-green-400">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                  Çevrimiçi
                </span>
              ) : (
                <span className="flex items-center gap-2 text-red-400">
                  <span className="w-2 h-2 rounded-full bg-red-500"></span>
                  Çevrimdışı
                </span>
              )}
            </div>
          </div>
          
          {serverStatus.loading ? (
            <div className="text-center py-8 text-gray-400">
              <RefreshCw className="w-8 h-8 mx-auto mb-2 animate-spin" />
              <p>Sunucu bilgileri yükleniyor...</p>
            </div>
          ) : serverStatus.online ? (
            <>
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400 text-sm">Oyuncu Sayısı</span>
                  <span className="text-white font-bold text-lg">
                    {serverStatus.players} / {serverStatus.max}
                  </span>
                </div>
                <div className="w-full bg-void-950 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-axion-blue to-axion-cyan h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${serverStatus.max > 0 ? (serverStatus.players / serverStatus.max) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>

              {/* Players List */}
              {serverPlayers.length > 0 ? (
                <div className="mt-6">
                  <h4 className="text-sm font-bold text-gray-400 uppercase mb-3">Çevrimiçi Oyuncular ({serverPlayers.length})</h4>
                  <div className="space-y-2 max-h-[500px] overflow-y-auto">
                    {serverPlayers.map((player, index) => (
                      <div key={index} className="bg-void-950/50 rounded-lg p-4 border border-white/5 hover:border-axion-cyan/30 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <img 
                              src={`https://visage.surgeplay.com/face/32/${player.name}`} 
                              alt={player.name}
                              className="w-10 h-10 rounded"
                            />
                            <div>
                              <p className="text-white font-bold">{player.name}</p>
                              <p className="text-xs text-gray-400">
                                Oynama Süresi: {player.playTime || '0 Sa, 0 Dk'}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-500"></span>
                            <span className="text-xs text-gray-400">Çevrimiçi</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Şu anda çevrimiçi oyuncu yok.</p>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8 text-red-400">
              <WifiOff className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Sunucu çevrimdışı veya erişilemiyor.</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderConsole = () => (
      <div className="bg-void-950 rounded-xl border border-white/10 p-4 font-mono text-xs md:text-sm h-[500px] overflow-y-auto animate-fade-in shadow-inner shadow-black">
          {logs.map((log, i) => (
              <div key={i} className={`mb-1 ${log.includes("WARN") ? 'text-yellow-400' : log.includes("ERROR") ? 'text-red-400' : 'text-gray-300'}`}>
                  {log}
              </div>
          ))}
          <div className="mt-4 flex gap-2">
              <span className="text-green-500">{'>'}</span>
              <input type="text" className="bg-transparent outline-none text-white w-full" placeholder="Komut gir..." />
          </div>
      </div>
  );

  const renderSettings = () => {
    if (!user.isOwner && !user.isAdmin) {
      return (
        <div className="text-center py-12 text-red-400">
          <ShieldAlert className="w-12 h-12 mx-auto mb-4" />
          <p>Bu sayfaya sadece Owner veya Admin erişebilir.</p>
        </div>
      );
    }

    const handleSaveWebhook = () => {
      if (webhookUrl && !webhookUrl.startsWith('http://') && !webhookUrl.startsWith('https://')) {
        showToast('Geçerli bir URL girin! (http:// veya https:// ile başlamalı)', 'error');
        return;
      }
      localStorage.setItem('webhook_url', webhookUrl);
      showToast('Webhook URL başarıyla kaydedildi!', 'success');
    };

    const handleTestWebhook = async () => {
      if (!webhookUrl || !webhookUrl.trim()) {
        showToast('Önce webhook URL\'si girin!', 'error');
        return;
      }

      try {
        const testData = {
          content: '🧪 **Webhook Test Mesajı**',
          embeds: [
            {
              title: 'Test Başarılı!',
              description: 'Webhook bağlantınız çalışıyor. Destek talepleri artık Discord kanalınıza gönderilecek.',
              color: 0x00ff00, // Green
              timestamp: new Date().toISOString()
            }
          ]
        };

        const response = await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(testData)
        });

        if (response.ok) {
          showToast('Webhook testi başarılı! Discord kanalınızı kontrol edin.', 'success');
        } else {
          const errorText = await response.text();
          console.error('Webhook error:', errorText);
          showToast(`Webhook testi başarısız: ${response.status} - ${response.statusText}`, 'error');
        }
      } catch (error: any) {
        console.error('Webhook test error:', error);
        showToast(`Webhook testi başarısız! ${error.message || 'URL\'yi kontrol edin.'}`, 'error');
      }
    };

    return (
      <div className="space-y-6 animate-fade-in">
        <div className="glass-card rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Settings className="w-6 h-6 text-axion-cyan" />
            Webhook Ayarları
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-400 uppercase mb-2">
                Webhook URL
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  placeholder="https://discord.com/api/webhooks/..."
                  className="flex-1 bg-void-950 border border-void-700 rounded-xl py-3 px-4 text-white focus:border-axion-cyan focus:outline-none transition-colors"
                />
                <Button
                  variant="primary"
                  onClick={handleSaveWebhook}
                  className="!px-6"
                >
                  Kaydet
                </Button>
                <Button
                  variant="outline"
                  onClick={handleTestWebhook}
                  className="!px-6"
                >
                  Test Et
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Destek talepleri oluşturulduğunda bu webhook URL'sine POST isteği gönderilir.
              </p>
            </div>

            {webhookUrl && (
              <div className="bg-void-950/50 rounded-lg p-4 border border-axion-cyan/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-white mb-1">Mevcut Webhook URL</p>
                    <p className="text-xs text-gray-400 break-all">{webhookUrl}</p>
                  </div>
                  <button
                    onClick={() => {
                      setWebhookUrl('');
                      localStorage.removeItem('webhook_url');
                      showToast('Webhook URL silindi!', 'info');
                    }}
                    className="text-red-400 hover:text-red-300 text-sm"
                  >
                    Sil
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="glass-card rounded-xl p-6 border-l-4 border-l-blue-500">
          <h4 className="text-lg font-bold text-white mb-3">Webhook Formatı</h4>
          <p className="text-sm text-gray-400 mb-4">
            Destek talebi oluşturulduğunda webhook'a gönderilecek veri formatı:
          </p>
          <pre className="bg-void-950 rounded-lg p-4 text-xs text-gray-300 overflow-x-auto">
{`{
  "type": "support_ticket",
  "ticket": {
    "id": "TICKET-123456",
    "username": "KullanıcıAdı",
    "category": "bug",
    "subject": "Talep Başlığı",
    "message": "Talep mesajı...",
    "status": "open",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}`}
          </pre>
        </div>
      </div>
    );
  };

  return (
    <div className="pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full md:w-64 flex-shrink-0">
            <div className="glass-card rounded-xl p-4 sticky top-24">
                <div className="flex items-center gap-3 mb-6 px-2">
                    <img src={user.avatar} className="w-10 h-10 rounded-lg" />
                    <div>
                        <div className="font-bold text-white">{user.username}</div>
                        <div className="text-xs text-red-400 font-bold uppercase">Yönetici</div>
                    </div>
                </div>
                <nav className="space-y-1">
                    <button onClick={() => setActiveTab('dashboard')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'dashboard' ? 'bg-axion-cyan text-void-950' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                        <LayoutDashboard className="w-4 h-4" /> Genel Bakış
                    </button>
                    <button onClick={() => setActiveTab('users')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'users' ? 'bg-axion-cyan text-void-950' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                        <Users className="w-4 h-4" /> Oyuncular
                    </button>
                    <button onClick={() => setActiveTab('console')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'console' ? 'bg-axion-cyan text-void-950' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                        <Terminal className="w-4 h-4" /> Konsol
                    </button>
                    {(user.isOwner || user.isAdmin || user.role === 'staff') && (
                      <button onClick={() => setActiveTab('support-tickets')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'support-tickets' ? 'bg-axion-cyan text-void-950' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                          <MessageSquare className="w-4 h-4" /> Destek Talepleri
                      </button>
                    )}
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
                        <ShoppingBag className="w-4 h-4" /> Market Ayarları
                    </button>
                    {(user.isOwner || user.isAdmin) && (
                      <button onClick={() => setActiveTab('settings')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'settings' ? 'bg-axion-cyan text-void-950' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                          <Settings className="w-4 h-4" /> Site Ayarları
                      </button>
                    )}
                </nav>
            </div>
        </div>

        {/* Content */}
        <div className="flex-1">
            <h2 className="text-2xl font-bold text-white mb-6 capitalize">
              {activeTab === 'dashboard' ? 'Genel Bakış' : 
               activeTab === 'users' ? 'Kullanıcı Yönetimi' : 
               activeTab === 'console' ? 'Sunucu Konsolu' : 
               activeTab === 'support-tickets' ? 'Destek Talepleri' :
               activeTab === 'settings' ? 'Site Ayarları' :
               activeTab === 'players' ? 'Sunucu Oyuncuları' :
               ''}
            </h2>
            {activeTab === 'dashboard' && renderDashboard()}
            {activeTab === 'users' && renderUsers()}
            {activeTab === 'console' && renderConsole()}
            {activeTab === 'support-tickets' && renderSupportTickets()}
            {activeTab === 'settings' && renderSettings()}
            {activeTab === 'players' && renderPlayers()}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;