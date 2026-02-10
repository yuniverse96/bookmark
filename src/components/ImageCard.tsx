"use client";
import {useState} from "react"
import { useAuthStore } from '@/store/useAuthStore'; // Auth 스토어
import { useSaveStore } from '@/store/useSaveStore';

interface ImageCardProps {
  imageUrl: string;
  title: string;
  size: 'square' | 'vertical';
  btnName : 'save'| 'remove';
  onAction?: () => void;
}

export default function ImageCard({ imageUrl, title, size, btnName = 'save', onAction }: ImageCardProps) {
  const { isLoggedIn, login } = useAuthStore();
  const openSaveModal = useSaveStore((state) => state.openSaveModal);
  const aspectClass = size === 'square' ? 'aspect-square' : 'aspect-[2/3]';
  //mo대응
  const [isTouched, setIsTouched] = useState(false);


  const handleButtonClick = async (e: React.MouseEvent) => {
    e.stopPropagation();

    // 1. save 버튼일 때
    if (btnName === 'save') {
        //로그인 여부 체크
        if (!isLoggedIn) {
          if (confirm("로그인이 필요한 기능입니다. 로그인하시겠습니까?")) {
            try {
              await login(); 
              openSaveModal({ imageUrl, title }); 
            } catch (error) {
              console.error("로그인 중 오류가 발생했습니다.", error);
            }
          }
          return;
        }
        // 모달 열기
        openSaveModal({ imageUrl, title });
    } 
    // 2. remove 버튼일 때
    else if (btnName === 'remove') {
      if (confirm("정말 삭제하시겠습니까?") && onAction) {
        onAction();
      }
    }
  };


  return (
    <div className="mb-4 break-inside-avoid group relative cursor-pointer overflow-hidden rounded-xl">
      <div 
        className={`relative w-full ${aspectClass} bg-gray-200`}
        onClick={() => setIsTouched(!isTouched)}
        // PC에서 마우스가 나가면 상태 초기화 (혹시 클릭했더라도 사라지게)
        onMouseLeave={() => setIsTouched(false)}
      >
        <img
          src={imageUrl}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
 
        <div className={`
              absolute inset-0 bg-black/20 transition-opacity flex flex-col justify-between p-3
              ${isTouched ? 'opacity-100' : 'opacity-0'} // 터치 상태면 강제 노출
              group-hover:opacity-100 // PC에선 호버 시 노출
            `}
        >
          <div className="flex justify-end">
          <button 
              onClick={handleButtonClick}
              className="bg-sub-green text-white px-4 py-2 rounded-full text-xs font-bold"
            >
              {btnName}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}