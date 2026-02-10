"use client"
import Link from 'next/link';
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { useAuthStore } from "@/store/useAuthStore";
import { collection, query, where, onSnapshot, orderBy, doc, deleteDoc } from "firebase/firestore";
import ImageCard from "@/components/ImageCard";

export default function BookMark() {
    const [isLoading, setIsLoading] = useState(true);
    const { user } = useAuthStore();
    const [categories, setCategories] = useState<{id: string, name: string}[]>([]);
    const [savedImages, setSavedImages] = useState<any[]>([]);
    const [selectedCategory, setSelectedCategory] = useState("전체");
    const [isOpen, setIsOpen] = useState(false); // 커스텀 드롭다운 열림 상태

    

    useEffect(() => {
        if (!user) {
            setIsLoading(false); 
            return;
        }
        setIsLoading(true);
    
        // 카테고리 로드
        const catQuery = query(collection(db, "users", user.uid, "categories"), orderBy("createdAt", "desc"));
        const unsubCats = onSnapshot(catQuery, (snapshot) => {
            const list = snapshot.docs.map(doc => ({ id: doc.id, name: doc.data().name }));
            setCategories([{ id: "all", name: "전체" }, ...list]);
        });
    
        // 이미지 로드
        let imgQuery = query(collection(db, "users", user.uid, "savedImages"), orderBy("savedAt", "desc"));
        if (selectedCategory !== "전체") {
            imgQuery = query(
                collection(db, "users", user.uid, "savedImages"),
                where("category", "==", selectedCategory),
                orderBy("savedAt", "desc")
            );
        }
    
        const unsubImgs = onSnapshot(imgQuery, (snapshot) => {
            const imgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setSavedImages(imgs);
            setIsLoading(false);

        }, (error) => {
            console.error("인덱스 빌드 중이거나 에러 발생:", error);
            setIsLoading(false);
        });
    
        return () => { unsubCats(); unsubImgs(); };
    }, [user, selectedCategory]);

    // 저장된 이미지 삭제
    const handleDelete = async (docId: string) => {
        try {
          await deleteDoc(doc(db, "users", user!.uid, "savedImages", docId));
        } catch (error) {
          console.error("삭제 실패:", error);
        }
      };


    return (
        <main className="container mx-auto px-4">
            <h1 className="text-2xl font-bold my-8 text-main-green">Bookmarks</h1>

            {/*커스텀 셀렉트 옵션 드롭다운 */}
            <div className="relative w-48 mb-10">
                <button 
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full bg-white border border-gray-200 px-4 py-2 rounded-xl flex justify-between items-center shadow-sm"
                >
                    <span className="font-medium text-gray-700">{selectedCategory}</span>
                    <span className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}>▼</span>
                </button>

                {isOpen && (
                    <ul className="absolute z-20 w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden">
                        {categories.map((cat) => (
                            <li 
                                key={cat.id}
                                onClick={() => {
                                    setSelectedCategory(cat.name);
                                    setIsOpen(false);
                                }}
                                className="px-4 py-2 hover:bg-main-green hover:text-white cursor-pointer transition-colors"
                            >
                                {cat.name}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/*카테고리별 이미지 노출  */}
            <div className="catrgori_imgs">
                {isLoading ? (
                    //로딩중
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="aspect-[2/3] bg-gray-100 animate-pulse rounded-xl" />
                    ))}
                    </div>
                ) : savedImages.length > 0 ? (

                    <div className="columns-2 md:columns-3 lg:columns-4 gap-4">
                    {savedImages.map((img) => (
                        <div key={img.id} className="mb-4">
                        <ImageCard 
                            imageUrl={img.imageUrl} 
                            title={img.title} 
                            size="vertical" 
                            btnName="remove"
                            onAction={() => handleDelete(img.id)}
                        />
                        </div>
                    ))}
                    </div>
                ) : (
                    //데이터가없을 때
                    <div className="text-center py-20 flex flex-col items-center justify-center">
                        <div className="bg-point-green rounded-full p-6 mb-4">
                            <span className="text-4xl font-school text-sub-green">ㅠ_ㅠ</span>
                        </div>
                        <p className="text-gray-500 font-medium text-lg">
                            이 카테고리에는 아직 저장된 이미지가 없어요.
                        </p>
                        <p className="text-gray-400 text-sm mt-1 mb-8">
                            마음에 드는 이미지를 찾아 보관함에 담아보세요!
                        </p>
                        
                        {/* 메인으로 이동하는 버튼 */}
                        <Link 
                            href="/" 
                            className="bg-main-green text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-opacity-90 transition-all hover:-translate-y-1"
                        >
                            이미지 보러가기
                        </Link>
                    </div>
                )}
                </div>
        </main>
    );
}