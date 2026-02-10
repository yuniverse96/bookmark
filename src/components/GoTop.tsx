"use client";
import { useEffect, useState } from "react";

export default function GoTop() {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // 300px 이상 내려오면 버튼 노출
      if (window.scrollY > 300) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 버튼이 보여야 할 때만 렌더링
  if (!showButton) return null;

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-8 right-8 z-[50] size-[45px] border-2 border-main-green bg-white/80 backdrop-blur-sm text-main-green font-bold rounded-full shadow-md hover:scale-110 transition-all flex items-center justify-center uppercase text-[10px]"
    >
      top
    </button>
  );
}