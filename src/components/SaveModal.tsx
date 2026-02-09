"use client";
import { useSaveStore } from '@/store/useSaveStore';
import { useState } from 'react';

export default function SaveModal() {
  const { isOpen, imageData, closeSaveModal } = useSaveStore();
  const [newCategory, setNewCategory] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleClose = () => {
    setIsCreating(false);  // 생성 모드 해제
    setNewCategory('');    // 입력 필드 비우기
    closeSaveModal();      // Zustand 스토어 닫기
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
                {/* 실제로는 여기서 categories.map()을 돌릴 거예요 */}
                {['여행', '인테리어', '배경화면'].map((cat) => (
                  <button
                    key={cat}
                    className="w-full text-left py-2 px-4 hover:bg-main-green hover:text-white rounded-xl transition-colors font-medium flex justify-between items-center group"
                  >
                    <span>{cat}</span>
                    <span className="text-xs text-white opacity-0 group-hover:opacity-100 font-bold">저장</span>
                  </button>
                ))}
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