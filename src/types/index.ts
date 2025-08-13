export interface User {
  id: string;
  displayName: string;
  email: string;
  photoURL: string;
  country: string;
  phoneVerified: boolean;
  kycLevel: number;
  reputation: number;
  createdAt: number;
  stats: {
    challengesCreated: number;
    challengesWon: number;
    winRate: number;
    totalEarnings: number;
    totalVotes: number;
  };
  votesUsedToday: number;
  maxVotesPerDay: number;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  category: string;
  hostId: string;
  hostName: string;
  entryFee: number;
  maxParticipants: number;
  status: 'signup' | 'submission' | 'voting' | 'closed';
  timeline: {
    signupStart: number;
    submitDeadline: number;
    votingStart: number;
    votingEnd: number;
  };
  pool: {
    gross: number;
    commission: number;
    net: number;
  };
  rules: string[];
  createdAt: number;
  entries: number;
  tags: string[];
}

export interface Entry {
  id: string;
  challengeId: string;
  userId: string;
  userName: string;
  videoURL: string;
  thumbURL: string;
  description: string;
  approved: boolean;
  createdAt: number;
  votesCount: number;
  isVideo?: boolean;
}

export interface Vote {
  id: string;
  voterId: string;
  entryId: string;
  createdAt: number;
  weight: number;
}

export interface Transaction {
  id: string;
  type: 'ENTRY' | 'PRIZE' | 'TIP' | 'WITHDRAW';
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  challengeId?: string;
  method?: string;
  createdAt: number;
}

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}