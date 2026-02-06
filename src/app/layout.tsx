import type { Metadata } from "next";
import { ThemeProvider } from "@/context/ThemeContext"; 
import localFont from "next/font/local";
import Header from "@/components/Header";
import "./globals.css";


const pretendard = localFont({
  src: "../../node_modules/pretendard/dist/web/variable/woff2/PretendardVariable.woff2",
  display: "swap",
  variable: "--font-pretendard", // CSS 변수 이름 설정
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
    <html lang="ko">
      <body>
        <ThemeProvider>
          <Header />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}