"use client";

import { useSaveStore } from '@/store/useSaveStore';
import { useSaveImage } from '@/hooks/useSaveImage';
import { useState } from 'react';

export default function SaveModal() {
  const { isOpen, imageData, closeSaveModal } = useSaveStore();
  const { categories, createCategory, saveImage } = useSaveImage(isOpen);
  const [newCategory, setNewCategory] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleClose = () => {
    setIsCreating(false);  // 생성 모드 해제
    setNewCategory('');    // 입력 필드 비우기
    closeSaveModal();      // Zustand 스토어 닫기
  };

  const handleSave = async (catName: string) => {
    if (!imageData) return;
  
    const success = await saveImage(catName, {
      imageUrl: imageData.imageUrl,
      title: imageData.title
    });
  
    if (success) {
      alert(`${catName}에 저장되었습니다!`);
      closeSaveModal();
    }
  };
  
  // 모달이 닫혀있으면 아무것도 렌더링하지 않음
  if (!isOpen || !imageData) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative bg-white rounded-3xl p-6 w-[95%] h-[70%] max-w-sm shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className='w-full h-full overflow-x-hidden overflow-y-auto'>
            
            <div className="text-center mb-2">
              <h2 className="text-m font-bold text-sub-green">보관함에 저장</h2>
            </div>

            {/*이미지 미리보기*/}
            <div className="flex items-center gap-4 p-3 bg-green-50 rounded-2xl mb-4">
              <img
                src={imageData.imageUrl}
                alt="preview"
                className="w-20 h-20 object-cover rounded-xl shadow-sm"
              />
              <p className="font-semibold text-gray-700 truncate">{imageData.title || "이름 없는 이미지"}</p>
            </div>

            {/*새 카테고리 생성 입력창 */}
            <div className="border-t py-4">
              {isCreating ? (
                <div className="flex flex-col gap-2">
                  <input
                    autoFocus
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="카테고리 이름..."
                    className="flex-1 bg-white border-2 border-gray-200 rounded-xl px-4 py-2 text-sm focus:border-2 focus:border-sub-green transition-all outline-none"
                  />
                  <button
                    className="bg-sub-green text-white px-4 py-2 rounded-xl text-sm font-bold"
                    onClick={() => {// 여기에 Firestore 로직 추가
                        createCategory(newCategory);
                        setIsCreating(false);
                        setNewCategory('');
                    }}
                  >
                    생성
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsCreating(true)}
                  className="w-full py-3 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 font-bold text-sm hover:border-sub-green hover:text-sub-green transition-all"
                >
                  + 새 카테고리 만들기
                </button>
              )}
            </div>
            {/*카테고리 리스트 */}
            <div className="categories">
              <p className="text-xs font-bold text-sub-green px-1 uppercase tracking-wider">내 카테고리</p>
              <div className="my-4 ">

              {categories.length > 0 ? (
                    //카테고리 있을때
                    categories.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => handleSave(cat.name)}
                        className="w-full text-left py-2 px-4 hover:bg-main-green hover:text-white rounded-xl transition-colors font-medium flex justify-between items-center group"
                    >
                        <span>{cat.name}</span>
                        <span className="text-xs text-white opacity-0 group-hover:opacity-100 font-bold">저장</span>
                    </button>
                    ))
                ) : (
                    //카테고리가 없을 때
                    <div className="py-8 text-center">
                        <p className="text-gray-400 text-sm font-medium">생성된 카테고리가 없어요.</p>
                        <p className="text-gray-300 text-xs mt-1">새 카테고리를 만들어보세요! ✨</p>
                    </div>
                )}
              </div>
            </div>
          
         
        </div>
        {/* 닫기 버튼 */}
        <button
            onClick={handleClose}
            className="btn-close absolute top-[-30px] right-[0]"
        >
        </button>
      </div>
    </div>
  );
}