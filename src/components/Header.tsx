"use client";
import Link from 'next/link';
import { useAuthStore } from '@/store/useAuthStore';
import AuthControl from './AuthControl';

export default function Header() {
    const { isLoggedIn, logout, login, user, isLoading } = useAuthStore();

    return (
        <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white text-sub-green">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <div className="logo">
                    <Link href="/" className="text-[30px] font-bold font-school cursor-pointer">
                        Keepic
                    </Link>
                </div>
               
                <nav className="relative"> 
                    <ul className="flex gap-6 text-sm font-medium items-center text-main-green">
                        <li className="hover:text-sub-green cursor-pointer">bookmark</li>
                        <li>
                            <AuthControl />
                        </li>

                    </ul>
                </nav>
            </div>
        </header>
    );
}