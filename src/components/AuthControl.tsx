"use client";

import { useState, useEffect, useRef } from 'react';
import { useAuthStore } from '@/store/useAuthStore';

export default function AuthControl() {
    const { isLoggedIn, logout, login, user, isLoading } = useAuthStore();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const popoverRef = useRef<HTMLDivElement>(null);

    const showProfile = isLoggedIn || isLoading;
    const hasPhoto = !!user?.photoURL;

    // 바깥 클릭 및 스크롤 시 닫기 로직
    useEffect(() => {
        const handleClose = (e: MouseEvent) => {
            if (isMenuOpen && popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
                setIsMenuOpen(false);
            }
        };
        const handleScroll = () => isMenuOpen && setIsMenuOpen(false);

        if (isMenuOpen) {
            window.addEventListener('mousedown', handleClose);
            window.addEventListener('scroll', handleScroll);
        }
        return () => {
            window.removeEventListener('mousedown', handleClose);
            window.removeEventListener('scroll', handleScroll);
        };
    }, [isMenuOpen]);

    return (
        <div className="relative" ref={popoverRef}>
            {/* 상단 프로필/로그인 버튼 영역 */}
            <div 
                className="cursor-pointer"
                onClick={() => !isLoading && setIsMenuOpen(!isMenuOpen)}
            >
                {showProfile ? (
                    <div className="img_box size-[40px] rounded-full overflow-hidden border border-gray-100 flex items-center justify-center">
                        {isLoading ? (
                            <div className="w-full h-full bg-gray-200 animate-pulse" />
                        ) : hasPhoto ? (
                            <img src={user.photoURL!} alt="profile" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-main-green text-white flex items-center justify-center text-xs font-bold">
                                {user?.displayName?.charAt(0) || "U"}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="hover:text-sub-green font-medium">login</div>
                )}
            </div>

            {/* 드롭다운 메뉴 */}
            {isMenuOpen && (
                <div className="log_pop w-60 p-4 bg-white text-foreground border border-gray-200 absolute top-[50px] right-0 shadow-lg rounded-xl z-50">
                    {isLoggedIn ? (
                        <div className="flex flex-col gap-3">
                            <p className="text-gray-600 font-bold border-b pb-2">{user?.displayName}님</p>
                            <p onClick={() => { logout(); setIsMenuOpen(false); }} className="cursor-pointer hover:text-red-500">
                                Logout
                            </p>
                        </div>
                    ) : (
                        <p onClick={() => { login(); setIsMenuOpen(false); }} className="cursor-pointer font-bold">
                            Login with Google
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}