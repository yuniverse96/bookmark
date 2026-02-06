"use client";
import Link from 'next/link';
import { useAuthStore } from '@/store/useAuthStore';


export default function Header(){
    const { isLoggedIn, logout, login } = useAuthStore();

    return(
        <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 text-sub-green">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <div className="logo">
                    <Link href="/" className="text-[30px] font-bold font-school cursor-pointer">
                        Keepic
                    </Link>
                </div>
               
                <nav>
                    <ul className="flex gap-6 text-sm font-medium text-main-green">
                        <li className="hover:text-sub-green cursor-pointer">bookmark</li>
                        <li 
                            onClick={isLoggedIn ? logout : login} 
                            className="cursor-pointer hover:text-sub-green"
                        >
                            {isLoggedIn ? "logout" : "login"}
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    );
}

