'use client';

import { useAuth } from '@/context/authProvider';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export function Navbar() {
  const route = useRouter();
  const { user, logout } = useAuth();

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">L</span>
            </div>
            <span className="font-semibold text-lg">LearnHub</span>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Home
            </Link>
            <Link
              href="/learn"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Learn
            </Link>
            <Link
              href="/posts"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Posts
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Contact
            </Link>
          </div>
        </div>

        {user ? (
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300" onClick={()=> {
              route.push('/profile');
            }}>
              Hello, {user.email}
            </span>

            <button
              className={cn(
                'text-sm font-medium text-white bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 px-4 py-2 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md'
              )}
              onClick={() => {
                logout();
                route.push('/signin');
              }}
            >
              Sign Out
            </button>
          </div>
        ) : (
          <div className="flex items-center space-x-4">
            <Link
              href="/signin"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className={cn(
                'text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-4 py-2 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md'
              )}
            >
              Get Started
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
