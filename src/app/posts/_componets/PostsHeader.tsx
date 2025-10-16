import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus, FileText } from 'lucide-react';

const PostsHeader = () => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
          <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
            All Posts
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Discover and share amazing stories
          </p>
        </div>
      </div>

      <Button asChild className="gap-2">
        <Link href="/posts/create">
          <Plus className="w-4 h-4" />
          Create Post
        </Link>
      </Button>
    </div>
  );
};

export default PostsHeader;
