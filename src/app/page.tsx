'use client';

import { useEffect, useRef } from 'react';
import { usePixabayImages } from "@/hooks/usePixabayImages";
import ImageCard from "@/components/ImageCard";

export default function HomePage() {
  const { items, loading, hasMore, setPage, category, setCategory } = usePixabayImages('all');
  const observerRef = useRef<HTMLDivElement>(null);

  const categories = [
    { label: '전체', value: 'all' },
    { label: '동물', value: 'animal' },
    { label: '음식', value: 'korean food' },
    { label: '서울', value: 'seoul' }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          setPage(prev => prev + 1);
        }
      },
      { threshold: 0.5 }
    );
    if (observerRef.current) observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [hasMore, loading]);

  return (
    <main className="container mx-auto px-4 py-8">
      {/* 탭 메뉴 */}
      <div className="flex gap-2 mb-10 overflow-x-auto pb-4 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setCategory(cat.value)}
            className={`px-6 py-2 rounded-full border transition-all whitespace-nowrap ${
              category === cat.value ? 'bg-black text-white' : 'bg-white text-gray-600'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* 이미지 그리드 (Pixabay -> webformatURL) */}
      <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
        {items.map((item, idx) => (
          <ImageCard
            key={`${item.id}-${idx}`}
            imageUrl={item.webformatURL}
            title={item.tags}
            size={idx % 3 === 0 ? "vertical" : "square"}
          />
        ))}
      </div>

      {/* 무한 스크롤 바닥 감지 및 로딩 표시기 */}
      <div 
        ref={observerRef} 
        className="w-full py-12 mt-8 flex flex-col items-center justify-center text-gray-500 font-school"
      >
        {loading && (
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
            <p>loading...</p>
          </div>
        )}
        {!hasMore && items.length > 0 && (
          <p className="font-medium">end</p>
        )}
        {!loading && items.length === 0 && (
          <p>해당 카테고리의 이미지가 없습니다.</p>
        )}
      </div>
    </main>
  );
}