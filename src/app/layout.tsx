import type { Metadata } from "next";

import "lenis/dist/lenis.css";

import { SmoothScrollProvider } from "@/components/smooth-scroll-provider";

import "./globals.css";

export const metadata: Metadata = {
  title: "Kim Jaegwan Portfolio",
  description: "Portfolio landing hero for Kim Jaegwan.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </body>
    </html>
  );
}
