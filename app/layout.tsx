import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Motive Care | Personal Health Coach",
  description:
    "수면, 운동, 식단을 함께 관리하는 개인 건강 코치 웹 사이트. 하루 루틴, 주간 리포트, 맞춤 코칭 플랜을 한곳에서 제공합니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
