export interface NavItem {
  label: string;
  id: string;
  icon?: any;
}

export interface Feature {
  title: string;
  description: string;
  icon: any;
}

export interface StoreItem {
  id: number;
  name: string;
  price: number;
  image: string;
  perks: { label: string; icon?: any; tooltip?: string }[];
  category: 'vip' | 'keys' | 'spawner' | 'boost';
  tag?: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface NewsItem {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  image: string;
  category: string;
}

export interface UserTransaction {
  id: string;
  item: string;
  amount: number;
  date: string;
  status: 'completed' | 'pending' | 'failed';
}

export interface User {
  username: string;
  avatar: string;
  coins: number; // Oyun içi para
  credits: number; // Site kredisi
  rank: string;
  isAdmin?: boolean; // New Admin Flag
  joinDate: string;
  stats: {
    playTime: string;
    kills: number;
    deaths: number;
    islandLevel: number;
  };
  history: UserTransaction[];
}

export type SupportCategory = 'skyblock' | 'account' | 'bug' | 'refund' | 'ban_appeal' | 'other';

export interface SupportTicketReply {
  id: string;
  userId: string;
  username: string;
  message: string;
  createdAt: string;
  isStaff: boolean;
}

export interface SupportTicket {
  id: string;
  userId: string;
  username: string;
  category: SupportCategory;
  subject: string;
  message: string;
  banId?: string;
  transactionId?: string;
  evidence?: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  createdAt: string;
  updatedAt: string;
  replies?: SupportTicketReply[];
}

export type UserRole = 'owner' | 'admin' | 'staff' | 'mvp' | 'vip' | 'player';

export interface User {
  username: string;
  avatar: string;
  coins: number; // Oyun içi para
  credits: number; // Site kredisi
  rank: string;
  role?: UserRole; // Yeni: Kullanıcı rolü
  isAdmin?: boolean; // New Admin Flag
  isOwner?: boolean; // Owner Flag
  joinDate: string;
  stats: {
    playTime: string;
    kills: number;
    deaths: number;
    islandLevel: number;
  };
  history: UserTransaction[];
  supportTickets?: SupportTicket[]; // Yeni: Destek talepleri
  twoFactorEnabled?: boolean; // 2FA aktif mi
  twoFactorSecret?: string; // 2FA secret key
}