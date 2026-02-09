import { create } from 'zustand';
import { auth, googleProvider } from '@/lib/firebase';
import { signInWithPopup, signOut, User } from 'firebase/auth';

interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  login: () => Promise<User | undefined>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoggedIn: false,
  isLoading: true,
  
  //AuthSession에서 사용할 함수
  setUser: (user) => set({ 
    user: user, 
    isLoggedIn: !!user,
    isLoading: false
  }),

  login: async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      set({ 
        user: result.user, 
        isLoggedIn: true, 
        isLoading: false 
      });
      return result.user;
    } catch (error) {
      console.error("로그인 에러:", error);
      throw error;
    }
  },

  logout: async () => {
    try {
      await signOut(auth);
      set({ user: null, isLoggedIn: false });
    } catch (error) {
      console.error("로그아웃 에러:", error);
    }
  },
}));