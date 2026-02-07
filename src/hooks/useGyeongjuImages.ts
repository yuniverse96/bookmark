import { useState, useEffect, useCallback } from 'react';

export function useGyeongjuImages(initialLocation = '전체') {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [location, setLocation] = useState(initialLocation);

  // 탭이 변경되면 모든 데이터를 초기화하고 1페이지부터 다시 시작
  useEffect(() => {
    setItems([]);
    setPage(1);
    setHasMore(true);
  }, [location]);

  const fetchImages = useCallback(async () => {
    // 이미 로딩 중이거나 더 가져올 데이터가 없으면 중단.
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const rawKey = process.env.NEXT_PUBLIC_DATA_PORTAL_KEY;
      // 무한 스크롤을 위해 한 번에 20개씩 가져옵니다.
      const url = `https://apis.data.go.kr/5050000/dwtwTrrstrService/getDwtwTrrstr?serviceKey=${rawKey}&pageNo=${page}&numOfRows=20&_type=json`;

      const res = await fetch(url);
      const data = await res.json();
      
      const rawItems = data.response?.body?.items?.item || [];
      const itemsArray = Array.isArray(rawItems) ? rawItems : [rawItems];

      if (itemsArray.length === 0 || (itemsArray.length === 1 && !itemsArray[0].CON_UID)) {
        // 더 이상 가져올 데이터가 없는 경우
        setHasMore(false);
      } else {
        setItems((prev) => {
          const combined = [...prev, ...itemsArray];
          // UID 중복 제거 (공공데이터 특유의 데이터 중복 방지)
          return combined.filter((v, i, a) => a.findIndex(t => t.CON_UID === v.CON_UID) === i);
        });
      }
    } catch (err) {
      console.error("데이터 로드 중 오류 발생:", err);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [page, loading, hasMore, location]);

  // 페이지 번호나 위치가 바뀔 때마다 데이터를 요청.
  useEffect(() => {
    fetchImages();
  }, [page, location]);

  return { items, loading, hasMore, setPage, location, setLocation };
}