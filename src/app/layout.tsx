import type { Metadata, Viewport } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "TripMate — 여행 계획을 한곳에서",
  description:
    "여행 일정, 장소, 지도·블로그 링크, 예산을 한 화면에서 관리하는 여행 계획 앱",
};

export const viewport: Viewport = {
  themeColor: "#f7f3fa",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className="h-full">
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
