// src/app/page.tsx
export const dynamic = "force-dynamic";
import ImageCard from "@/components/ImageCard";

async function getEcoImages() {
  const rawKey = process.env.NEXT_PUBLIC_DATA_PORTAL_KEY;
  if (!rawKey) {
    console.error("API 키가 설정되지 않았습니다.");
    return [];
  }

  const randomPage = Math.floor(Math.random() * 17) + 1;
  const url = `https://apis.data.go.kr/5050000/dwtwTrrstrService/getDwtwTrrstr?serviceKey=${rawKey}&pageNo=${randomPage}&numOfRows=40&_type=json`;
  
  try {
    const res = await fetch(url, { 
      next: { revalidate: 60 }, 
      headers: { 'Accept': 'application/json' }
    });

    if (!res.ok) throw new Error(`HTTP 에러! 상태코드: ${res.status}`);

    const data = await res.json();
    
    const items = data.response?.body?.items?.item || [];
    return Array.isArray(items) ? items : [items];

  } catch (error) {
    console.error("데이터 로드 실패:", error);
    return [];
  }
}

//이미지 랜덤 믹스
function shuffle(array: any[]) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}


export default async function HomePage() {
  const rawItems = await getEcoImages(); 
  
  // 불러온 40개의 데이터를 랜덤하게 섞음
  const items = shuffle(rawItems);

  //경주시 이미지 포털의 실제 정적 파일 경로
  const IMAGE_BASE_URL = "https://www.gyeongju.go.kr/upload/content/";
  
  return (
    <main className="container mx-auto px-2 py-4">
      <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-3">
        {items.length > 0 ? (
          items.map((item: any, index: number) => {
            //필드명
            const fileName = item.CON_IMGFILENAME;
            if (!fileName) return null;
            const imageUrl = `${IMAGE_BASE_URL}${fileName}`;

            return (
              <ImageCard
                key={item.CON_UID || index} 
                imageUrl={imageUrl} 
                title={item.CON_TITLE} 
                size={index % 3 === 0 ? "vertical" : "square"}
              />
            );
          })
        ) : (
          <div className="text-center py-20">데이터를 불러오는 중...</div>
        )}
      </div>
    </main>
  );
}