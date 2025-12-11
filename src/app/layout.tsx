import { Navbar } from '@/components/shared/Navbar';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/context/authProvider';
import type { Metadata } from 'next';
import { SessionProvider } from 'next-auth/react';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { auth } from '@/auth';

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

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <SessionProvider >
          <AuthProvider>
            <Navbar />
            {children}
          </AuthProvider>
        </SessionProvider>
        <Toaster />
      </body>
    </html>
  );
}
