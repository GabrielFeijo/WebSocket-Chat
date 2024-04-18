import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Suspense } from 'react';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'Real Time Chat',
	description: 'Simple chat application created with Next.js and Socket.io',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='pt-BR'>
			<body className={inter.className}>
				<Suspense>{children}</Suspense>
			</body>
		</html>
	);
}
