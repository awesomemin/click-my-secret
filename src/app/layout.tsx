import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';

const pretendard = localFont({
  src: './fonts/PretendardVariable.woff2',
  display: 'swap',
});

export const metadata: Metadata = {
  title: '내 비밀을 눌러봐',
  description:
    '이번 크리스마스, 가장 많이 클릭한 친구에게만 내 비밀을 공유해보세요.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${pretendard.className} bg-background text-white`}
    >
      <body className="px-10">{children}</body>
    </html>
  );
}
