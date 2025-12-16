import { auth } from '@/auth';
import { Navbar } from '@/components/shared/Navbar';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/context/authProvider';
import XSessionProvider from '@/provider/XSessionProvider';
import type { Metadata } from 'next';
import { SessionProvider } from 'next-auth/react';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'MyApp - Learn Next.js',
  description: 'This is my Next.js app',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const session = await auth();


  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <SessionProvider session={session} >
          <XSessionProvider propsData={session}>
          <AuthProvider>
            <Navbar />
            {children}
          </AuthProvider>
        </XSessionProvider>
        </SessionProvider>
        <Toaster />
      </body>
    </html>
  );
}
