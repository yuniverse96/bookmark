import { useState, useEffect, useCallback } from 'react';

export function usePixabayImages(initialCategory = 'gyeongju') {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [category, setCategory] = useState(initialCategory);

  const fetchImages = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const API_KEY = process.env.NEXT_PUBLIC_PIXABAY_KEY;
      // category가 '전체'면 'all'로 검색하게 설정
      const searchTerm = category === '전체' ? 'all' : category;
      
      const url = `https://pixabay.com/api/?key=${API_KEY}&q=${encodeURIComponent(searchTerm)}&image_type=photo&page=${page}&per_page=20`;

      const res = await fetch(url);
      const data = await res.json();

      if (data.hits.length === 0) {
        setHasMore(false);
      } else {
        setItems((prev) => [...prev, ...data.hits]);
      }
    } catch (err) {
      console.error("Pixabay 로드 실패:", err);
    } finally {
      setLoading(false);
    }
  }, [page, category, loading, hasMore]);

  // 카테고리 변경 시 초기화
  useEffect(() => {
    setItems([]);
    setPage(1);
    setHasMore(true);
  }, [category]);

  useEffect(() => {
    fetchImages();
  }, [page, category]);

  return { items, loading, hasMore, setPage, category, setCategory };
}