import { create } from 'zustand';

export interface UserProfile {
  username: string;
  displayName: string;
  bio?: string | null;
  avatarUrl?: string | null;
  dmPrivacy?: 'EVERYONE' | 'MUTUAL_FOLLOWS' | 'CLOSED';
  pushEnabled?: boolean;
  quietHoursStart?: string | null;
  quietHoursEnd?: string | null;
  reputationScore?: number;
}

export interface AuthUser {
  id: string;
  email: string;
  role: 'MEMBER' | 'MODERATOR' | 'CRISIS_LEAD' | 'SUPER_ADMIN';
  quizVerified: boolean;
  quizCompletedAt?: string | null;
  profile: UserProfile;
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isAuthModalOpen: boolean;
  authModalTab: 'login' | 'register';
  isQuizModalOpen: boolean;
  isProfileModalOpen: boolean;

  setAuth: (user: AuthUser, token: string) => void;
  logout: () => void;
  setQuizVerified: (verified: boolean) => void;
  updateProfile: (profile: Partial<UserProfile>) => void;
  openAuthModal: (tab?: 'login' | 'register') => void;
  closeAuthModal: () => void;
  openQuizModal: () => void;
  closeQuizModal: () => void;
  openProfileModal: () => void;
  closeProfileModal: () => void;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isAuthModalOpen: false,
  authModalTab: 'register',
  isQuizModalOpen: false,
  isProfileModalOpen: false,

  setAuth: (user, token) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('ease_bloom_token', token);
      localStorage.setItem('ease_bloom_user', JSON.stringify(user));
    }
    set({ user, token, isAuthenticated: true, isAuthModalOpen: false });
    // If user is not quiz verified, automatically trigger the soft-gate quiz modal!
    if (!user.quizVerified) {
      set({ isQuizModalOpen: true });
    }
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('ease_bloom_token');
      localStorage.removeItem('ease_bloom_user');
    }
    set({ user: null, token: null, isAuthenticated: false, isProfileModalOpen: false, isQuizModalOpen: false });
  },

  setQuizVerified: (verified) => {
    set((state) => {
      if (!state.user) return state;
      const updatedUser = { ...state.user, quizVerified: verified };
      if (typeof window !== 'undefined') {
        localStorage.setItem('ease_bloom_user', JSON.stringify(updatedUser));
      }
      return { user: updatedUser, isQuizModalOpen: false };
    });
  },

  updateProfile: (updatedProfile) => {
    set((state) => {
      if (!state.user) return state;
      const updatedUser = {
        ...state.user,
        profile: { ...state.user.profile, ...updatedProfile },
      };
      if (typeof window !== 'undefined') {
        localStorage.setItem('ease_bloom_user', JSON.stringify(updatedUser));
      }
      return { user: updatedUser };
    });
  },

  openAuthModal: (tab = 'register') => set({ isAuthModalOpen: true, authModalTab: tab }),
  closeAuthModal: () => set({ isAuthModalOpen: false }),
  openQuizModal: () => set({ isQuizModalOpen: true }),
  closeQuizModal: () => set({ isQuizModalOpen: false }),
  openProfileModal: () => set({ isProfileModalOpen: true }),
  closeProfileModal: () => set({ isProfileModalOpen: false }),

  initialize: () => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('ease_bloom_token');
      const userJson = localStorage.getItem('ease_bloom_user');
      if (token && userJson) {
        try {
          const user = JSON.parse(userJson);
          set({ user, token, isAuthenticated: true });
        } catch {
          localStorage.removeItem('ease_bloom_token');
          localStorage.removeItem('ease_bloom_user');
        }
      }
    }
  },
}));
