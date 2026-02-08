"use client";
import { useEffect } from 'react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useAuthStore } from '@/store/useAuthStore';

export default function AuthSession({ children }: { children: React.ReactNode }) {
  //setUser 가져옴
  const setUser = useAuthStore((state) => state.setUser); 

  useEffect(() => {
    // Firebase 로그인 상태 감시
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe(); 
  }, [setUser]);

  return <>{children}</>;
}