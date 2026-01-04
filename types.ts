
export enum Tool {
  HOME = 'home',
  FORUM = 'forum',
  GRID = 'grid',
  COLOR = 'color',
  AI = 'ai',
  QR = 'qr',
  LEADERBOARD = 'leaderboard',
  STATS = 'stats'
}

export interface ChatMessage {
  id?: string;
  user: string;
  msg: string;
  time: number;
  role: 'user' | 'developer';
}

export interface VisitorStats {
  visitors: number;
}

export interface FeatureStats {
  [key: string]: { count: number };
}

export interface DailyStats {
  [date: string]: VisitorStats;
}

export interface GlobalStats {
  daily: DailyStats;
  total: { count: number };
  features: FeatureStats;
}
