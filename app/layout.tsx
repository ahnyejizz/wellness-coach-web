import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Motive Care | Personal Health Coach",
  description: "수면, 운동, 식단을 함께 관리하는 개인 웰니스 코치 웹 사이트",
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
