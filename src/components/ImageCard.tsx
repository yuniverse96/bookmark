import { useSaveStore } from '@/store/useSaveStore';

interface ImageCardProps {
  imageUrl: string;
  title: string;
  size: 'square' | 'vertical';
}

export default function ImageCard({ imageUrl, title, size }: ImageCardProps) {
  const openSaveModal = useSaveStore((state) => state.openSaveModal);
  const aspectClass = size === 'square' ? 'aspect-square' : 'aspect-[2/3]';

  return (
    <div className="mb-4 break-inside-avoid group relative cursor-pointer overflow-hidden rounded-xl">
      <div className={`relative w-full ${aspectClass} bg-gray-200`}>
        <img
          src={imageUrl}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
 
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
          <div className="flex justify-end">
          <button 
              onClick={(e) => {
                e.stopPropagation(); // 카드 클릭 이벤트와 겹치지 않게 방지
                openSaveModal({ imageUrl, title });
              }}
              className="bg-sub-green text-white px-4 py-2 rounded-full text-xs font-bold"
            >
              save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}