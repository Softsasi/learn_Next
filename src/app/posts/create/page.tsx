import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import PostForm from '../_componets/PostForm';

const CreatePostPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto mb-8">
          <Button variant="ghost" asChild className="gap-2 hover:bg-white/50 dark:hover:bg-gray-800/50 transition-colors">
            <Link href="/posts">
              <ArrowLeft className="w-4 h-4" />
              Back to Feed
            </Link>
          </Button>
        </div>
        <PostForm />
      </div>
    </div>
  );
};

export default CreatePostPage;
