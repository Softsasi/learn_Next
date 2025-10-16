'use client';

import useUserData from '@/hooks/useUserData';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, LogIn, PenTool } from 'lucide-react';
import PostForm from '../_componets/PostForm';

const CreatePostPage = () => {
  const user = useUserData();

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="flex justify-center">
            <div className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-full">
              <PenTool className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
              Sign In Required
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              You must be signed in to create and share posts with the community.
            </p>
          </div>

          <Button asChild className="gap-2">
            <Link href="/signin">
              <LogIn className="w-4 h-4" />
              Sign In
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button variant="ghost" asChild className="gap-2">
            <Link href="/posts">
              <ArrowLeft className="w-4 h-4" />
              Back to Posts
            </Link>
          </Button>
        </div>

        <PostForm />
      </div>
    </div>
  );
};

export default CreatePostPage;
