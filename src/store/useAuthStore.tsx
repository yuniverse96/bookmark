import { create } from 'zustand';

interface AuthState {
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false, // 초기값: 로그아웃 상태
  login: () => set({ isLoggedIn: true }),
  logout: () => set({ isLoggedIn: false }),
}));