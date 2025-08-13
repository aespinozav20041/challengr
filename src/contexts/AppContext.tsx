import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Challenge, Entry, Vote, Transaction, Toast } from '../types';

interface AppContextType {
  // Auth & User
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  
  // Challenges
  challenges: Challenge[];
  createChallenge: (challenge: Omit<Challenge, 'id' | 'createdAt' | 'pool' | 'entries'>) => string;
  joinChallenge: (challengeId: string) => Promise<boolean>;
  
  // Entries
  entries: Entry[];
  submitEntry: (challengeId: string, videoFile: File, description: string) => Promise<boolean>;
  
  // Voting
  votes: Vote[];
  castVote: (entryId: string) => boolean;
  getRemainingVotes: () => number;
  
  // Wallet
  wallet: { balance: number; pending: number };
  transactions: Transaction[];
  withdraw: (amount: number, method: string) => Promise<boolean>;
  
  // UI State
  currentView: string;
  setCurrentView: (view: string) => void;
  
  // Notifications
  toasts: Toast[];
  showToast: (message: string, type: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [votes, setVotes] = useState<Vote[]>([]);
  const [wallet, setWallet] = useState({ balance: 0, pending: 0 });
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [currentView, setCurrentView] = useState('home');
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedChallenges = localStorage.getItem('challenges');
    const savedEntries = localStorage.getItem('entries');
    const savedVotes = localStorage.getItem('votes');
    const savedWallet = localStorage.getItem('wallet');
    const savedTransactions = localStorage.getItem('transactions');

    if (savedUser) setUser(JSON.parse(savedUser));
    if (savedChallenges) setChallenges(JSON.parse(savedChallenges));
    if (savedEntries) setEntries(JSON.parse(savedEntries));
    if (savedVotes) setVotes(JSON.parse(savedVotes));
    if (savedWallet) setWallet(JSON.parse(savedWallet));
    if (savedTransactions) setTransactions(JSON.parse(savedTransactions));

    // Initialize with sample data if empty
    if (!savedChallenges) {
      initializeSampleData();
    }
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    if (user) localStorage.setItem('user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('challenges', JSON.stringify(challenges));
  }, [challenges]);

  useEffect(() => {
    localStorage.setItem('entries', JSON.stringify(entries));
  }, [entries]);

  useEffect(() => {
    localStorage.setItem('votes', JSON.stringify(votes));
  }, [votes]);

  useEffect(() => {
    localStorage.setItem('wallet', JSON.stringify(wallet));
  }, [wallet]);

  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  const initializeSampleData = () => {
    const sampleChallenges: Challenge[] = [
      {
        id: '1',
        title: '🤪 Best Dad Joke Challenge',
        description: 'Share your most cringe-worthy dad joke! Make us laugh and groan at the same time.',
        category: 'Comedy',
        hostId: 'host1',
        hostName: 'JokeMaster',
        entryFee: 2,
        maxParticipants: 20,
        status: 'voting',
        timeline: {
          signupStart: Date.now() - 86400000 * 3,
          submitDeadline: Date.now() - 86400000,
          votingStart: Date.now() - 86400000,
          votingEnd: Date.now() + 86400000
        },
        pool: { gross: 40, commission: 2.8, net: 37.2 },
        rules: ['Keep it family friendly', 'Original jokes only', 'Max 60 seconds'],
        createdAt: Date.now() - 86400000 * 3,
        entries: 8,
        tags: ['dad-jokes', 'comedy', 'family-friendly']
      },
      {
        id: '2',
        title: '🎭 Celebrity Impression Showdown',
        description: 'Do your best celebrity impression! Bonus points for creativity and accuracy.',
        category: 'Impressions',
        hostId: 'host2',
        hostName: 'ImpressionKing',
        entryFee: 3,
        maxParticipants: 15,
        status: 'submission',
        timeline: {
          signupStart: Date.now() - 86400000 * 2,
          submitDeadline: Date.now() + 86400000,
          votingStart: Date.now() + 86400000,
          votingEnd: Date.now() + 86400000 * 3
        },
        pool: { gross: 36, commission: 2.52, net: 33.48 },
        rules: ['No offensive content', 'Must be recognizable celebrity', 'Clear audio required'],
        createdAt: Date.now() - 86400000 * 2,
        entries: 12,
        tags: ['impressions', 'celebrity', 'acting']
      },
      {
        id: '3',
        title: '🤖 Robot Dance Battle',
        description: 'Show us your best robot dance moves! Get funky with it!',
        category: 'Dance',
        hostId: 'host3',
        hostName: 'DanceBot',
        entryFee: 1.5,
        maxParticipants: 25,
        status: 'signup',
        timeline: {
          signupStart: Date.now(),
          submitDeadline: Date.now() + 86400000 * 2,
          votingStart: Date.now() + 86400000 * 2,
          votingEnd: Date.now() + 86400000 * 4
        },
        pool: { gross: 0, commission: 0, net: 0 },
        rules: ['Must include robot moves', 'Background music allowed', 'Be creative!'],
        createdAt: Date.now(),
        entries: 0,
        tags: ['dance', 'robot', 'moves']
      }
    ];
    setChallenges(sampleChallenges);

    const sampleEntries: Entry[] = [
      {
        id: '1',
        challengeId: '1',
        userId: 'user1',
        userName: 'FunnyGuy',
        videoURL: 'https://images.pexels.com/photos/3771115/pexels-photo-3771115.jpeg',
        thumbURL: 'https://images.pexels.com/photos/3771115/pexels-photo-3771115.jpeg?w=200',
        description: 'Why don\'t scientists trust atoms? Because they make up everything!',
        approved: true,
        createdAt: Date.now() - 86400000,
        votesCount: 15,
        isVideo: false
      },
      {
        id: '2',
        challengeId: '1',
        userId: 'user2',
        userName: 'DadJokesPro',
        videoURL: 'https://images.pexels.com/photos/4348401/pexels-photo-4348401.jpeg',
        thumbURL: 'https://images.pexels.com/photos/4348401/pexels-photo-4348401.jpeg?w=200',
        description: 'I used to hate facial hair, but then it grew on me!',
        approved: true,
        createdAt: Date.now() - 86400000,
        votesCount: 23,
        isVideo: false
      }
    ];
    setEntries(sampleEntries);
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate login
    const newUser: User = {
      id: 'user_' + Date.now(),
      displayName: email.split('@')[0],
      email,
      photoURL: `https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?w=100`,
      country: 'US',
      phoneVerified: false,
      kycLevel: 0,
      reputation: 100,
      createdAt: Date.now(),
      stats: {
        challengesCreated: 0,
        challengesWon: 0,
        winRate: 0,
        totalEarnings: 0,
        totalVotes: 0
      },
      votesUsedToday: 0,
      maxVotesPerDay: 20
    };
    setUser(newUser);
    setWallet({ balance: 25.50, pending: 12.30 });
    return true;
  };

  const logout = () => {
    setUser(null);
    setWallet({ balance: 0, pending: 0 });
    setCurrentView('home');
    localStorage.removeItem('user');
    localStorage.removeItem('wallet');
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...updates });
    }
  };

  const createChallenge = (challengeData: Omit<Challenge, 'id' | 'createdAt' | 'pool' | 'entries'>): string => {
    const newChallenge: Challenge = {
      ...challengeData,
      id: 'challenge_' + Date.now(),
      createdAt: Date.now(),
      pool: { gross: 0, commission: 0, net: 0 },
      entries: 0
    };
    setChallenges(prev => [newChallenge, ...prev]);
    showToast('Challenge created successfully!', 'success');
    return newChallenge.id;
  };

  const joinChallenge = async (challengeId: string): Promise<boolean> => {
    if (!user) return false;
    
    const challenge = challenges.find(c => c.id === challengeId);
    if (!challenge) return false;

    if (wallet.balance < challenge.entryFee) {
      showToast('Insufficient balance to join challenge', 'error');
      return false;
    }

    // Deduct entry fee
    setWallet(prev => ({ ...prev, balance: prev.balance - challenge.entryFee }));
    
    // Add transaction
    const transaction: Transaction = {
      id: 'tx_' + Date.now(),
      type: 'ENTRY',
      amount: -challenge.entryFee,
      status: 'completed',
      challengeId,
      createdAt: Date.now()
    };
    setTransactions(prev => [transaction, ...prev]);

    // Update challenge pool
    setChallenges(prev => prev.map(c => 
      c.id === challengeId 
        ? { ...c, pool: { gross: c.pool.gross + challenge.entryFee, commission: (c.pool.gross + challenge.entryFee) * 0.07, net: (c.pool.gross + challenge.entryFee) * 0.93 } }
        : c
    ));

    showToast('Successfully joined challenge!', 'success');
    return true;
  };

  const submitEntry = async (challengeId: string, videoFile: File, description: string): Promise<boolean> => {
    if (!user) return false;

    // Simulate video upload
    const newEntry: Entry = {
      id: 'entry_' + Date.now(),
      challengeId,
      userId: user.id,
      userName: user.displayName,
      videoURL: URL.createObjectURL(videoFile),
      thumbURL: URL.createObjectURL(videoFile),
      description,
      approved: true,
      createdAt: Date.now(),
      votesCount: 0,
      isVideo: true
    };

    setEntries(prev => [newEntry, ...prev]);
    
    // Update challenge entries count
    setChallenges(prev => prev.map(c => 
      c.id === challengeId 
        ? { ...c, entries: c.entries + 1 }
        : c
    ));

    showToast('Entry submitted successfully!', 'success');
    return true;
  };

  const castVote = (entryId: string): boolean => {
    if (!user) return false;
    
    const remainingVotes = getRemainingVotes();
    if (remainingVotes <= 0) {
      showToast('You\'ve used all your votes for today!', 'error');
      return false;
    }

    // Check if user already voted for this entry
    const existingVote = votes.find(v => v.voterId === user.id && v.entryId === entryId);
    if (existingVote) {
      showToast('You\'ve already voted for this entry!', 'error');
      return false;
    }

    const newVote: Vote = {
      id: 'vote_' + Date.now(),
      voterId: user.id,
      entryId,
      createdAt: Date.now(),
      weight: 1
    };

    setVotes(prev => [newVote, ...prev]);
    
    // Update entry vote count
    setEntries(prev => prev.map(e => 
      e.id === entryId 
        ? { ...e, votesCount: e.votesCount + 1 }
        : e
    ));

    // Update user's daily vote count
    updateUser({ votesUsedToday: user.votesUsedToday + 1 });
    
    showToast('Vote cast successfully!', 'success');
    return true;
  };

  const getRemainingVotes = (): number => {
    if (!user) return 0;
    return user.maxVotesPerDay - user.votesUsedToday;
  };

  const withdraw = async (amount: number, method: string): Promise<boolean> => {
    if (!user) return false;
    
    if (wallet.balance < amount) {
      showToast('Insufficient balance for withdrawal', 'error');
      return false;
    }

    if (amount < 5) {
      showToast('Minimum withdrawal amount is $5', 'error');
      return false;
    }

    // Deduct from balance and add to pending
    setWallet(prev => ({ 
      balance: prev.balance - amount, 
      pending: prev.pending + amount 
    }));

    // Add transaction
    const transaction: Transaction = {
      id: 'tx_' + Date.now(),
      type: 'WITHDRAW',
      amount: -amount,
      status: 'pending',
      method,
      createdAt: Date.now()
    };
    setTransactions(prev => [transaction, ...prev]);

    showToast('Withdrawal requested successfully!', 'success');
    return true;
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    const toast: Toast = {
      id: 'toast_' + Date.now(),
      message,
      type
    };
    setToasts(prev => [toast, ...prev]);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      removeToast(toast.id);
    }, 5000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <AppContext.Provider
      value={{
        user,
        login,
        logout,
        updateUser,
        challenges,
        createChallenge,
        joinChallenge,
        entries,
        submitEntry,
        votes,
        castVote,
        getRemainingVotes,
        wallet,
        transactions,
        withdraw,
        currentView,
        setCurrentView,
        toasts,
        showToast,
        removeToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};