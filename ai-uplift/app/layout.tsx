import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Uplift",
  description: "AI 활용율을 높이는 단계적 도구",
};

const NAV_ITEMS = [
  { href: "/", label: "입력 & Tips" },
  { href: "/cases", label: "활용 사례" },
  { href: "/retro", label: "회고 & 다음 시도" },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="min-h-screen">
        <header className="border-b border-border bg-background sticky top-0 z-10">
          <div className="mx-auto max-w-5xl px-4 py-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
            <h1 className="text-lg font-bold tracking-tight">AI Uplift</h1>
            <nav aria-label="primary" className="flex gap-2 sm:gap-4 flex-wrap text-sm">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-md px-3 py-1.5 hover:bg-accent transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-5xl px-4 py-6">{children}</main>
      </body>
    </html>
  );
}
