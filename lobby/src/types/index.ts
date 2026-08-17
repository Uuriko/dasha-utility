export type Tier = 'public' | 'advanced' | 'full';

export interface LobbyUser {
  wallet: string;
  displayName?: string;
  tier: Tier;
  balance: number;
  lastSeen: string;
  createdAt: string;
  isAdmin?: boolean;
  isTimedOutUntil?: string;
  customStatus?: string;
}

export interface Room {
  id: string;
  slug: string;
  name: string;
  description?: string;
  minTierToPost: Tier;
  slowModeSeconds?: number;
  isLocked?: boolean;
  createdAt: string;
  order: number;
}

export interface Reaction {
  emoji: string;
  wallets: string[];
  count: number;
}

export interface Message {
  id: string;
  roomId: string;
  wallet: string;
  content: string;
  imageUrl?: string;
  replyToId?: string;
  createdAt: string;
  editedAt?: string;
  isPinned?: boolean;
  reactions: Reaction[];
  user?: LobbyUser;
  replyTo?: Message;
}

export interface Presence {
  wallet: string;
  roomId?: string;
  lastActive: string;
  isOnline: boolean;
  user?: LobbyUser;
}

export const TIER_THRESHOLDS = { advanced: 50_000, full: 150_000 } as const;
export const ALLOWED_EMOJIS = ['👍', '👎', '❤️', '😂', '🔥', '💀', '👀', '✨'] as const;
