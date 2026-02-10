import type { Metadata } from "next";
import { ThemeProvider } from "@/context/ThemeContext"; 
import localFont from "next/font/local";
import Header from "@/components/Header";
import SaveModal from '@/components/SaveModal';
import AuthSession from "@/components/AuthSession"; 
import GoTop from "@/components/GoTop";
import "./globals.css";

const pretendard = localFont({
  src: "../../node_modules/pretendard/dist/web/variable/woff2/PretendardVariable.woff2",
  display: "swap",
  variable: "--font-pretendard",
});

export const metadata: Metadata = {
  title: "Keepic",
  description: "Keepic - bookmark my image",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={pretendard.variable}>
      <body className="font-pretendard">
        <ThemeProvider>
          {/* AuthSession이 로그인 상태를 전역으로 관리*/}
          <AuthSession> 
              <Header />
              {children}
              <GoTop/>
              <SaveModal />
          </AuthSession>
        </ThemeProvider>
      </body>
    </html>
  );
}