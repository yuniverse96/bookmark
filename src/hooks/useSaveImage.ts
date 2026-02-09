// hooks/useSaveImage.ts
import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { useAuthStore } from '@/store/useAuthStore';
import { 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  serverTimestamp 
} from 'firebase/firestore';

export const useSaveImage = (isOpen: boolean) => {
  const { user } = useAuthStore();
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(false);

  //카테고리 목록 실시간 가져오기
  useEffect(() => {
    if (!isOpen || !user) return;

    const categoriesRef = collection(db, 'users', user.uid, 'categories');
    const q = query(categoriesRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name
      }));
      setCategories(list);
    });

    return () => unsubscribe();
  }, [isOpen, user]);

  //새 카테고리 생성
  const createCategory = async (name: string) => {
    if (!user || !name.trim()) return;
    try {
      const ref = collection(db, 'users', user.uid, 'categories');
      await addDoc(ref, {
        name,
        createdAt: serverTimestamp(),
      });
    } catch (e) {
      console.error("카테고리 생성 실패:", e);
    }
  };

  //이미지 저장
  const saveImage = async (categoryName: string, imageData: { imageUrl: string; title: string }) => {
    if (!user) return;
    setLoading(true);
    try {
      const ref = collection(db, 'users', user.uid, 'savedImages');
      await addDoc(ref, {
        ...imageData,
        category: categoryName,
        savedAt: serverTimestamp(),
      });
      return true; // 성공 시 true 반환
    } catch (e) {
      console.error("이미지 저장 실패:", e);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { categories, createCategory, saveImage, loading };
};