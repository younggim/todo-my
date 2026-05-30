import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import Link from 'next/link';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'Philo-Agent',
  description: '철학자 페르소나와의 대화 및 개념 지도 탐색',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <header className="flex h-14 items-center justify-between border-b border-[#d4c4c0] bg-white px-6">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-lg font-bold tracking-tight text-[#8C2822]">
                philo-agent
              </span>
              <span className="hidden text-xs text-gray-400 sm:block">
                규정 이론 + 가추 기반 개념 지도
              </span>
            </Link>
            <nav className="flex items-center gap-1">
              <NavLink href="/" label="🗨️ 철학자 대화" />
              <NavLink href="/concept-map" label="🗺️ 개념 지도" />
            </nav>
          </header>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="rounded-lg px-3 py-1.5 text-sm font-medium text-gray-600 transition-colors hover:bg-[#fdf5f4] hover:text-[#8C2822]"
    >
      {label}
    </Link>
  );
}
