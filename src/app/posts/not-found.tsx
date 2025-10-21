import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
      <h2 className="text-3xl font-bold text-foreground mb-2">
        Post Not Found
      </h2>
      <p className="text-muted-foreground mb-6 max-w-md">
        The post you’re looking for doesn’t exist or may have been removed.
      </p>
      <Link
        href="/posts"
        className="inline-flex items-center gap-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-4 py-2 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
      >
        <ArrowLeft className="w-4 h-4" />
        Return Post
      </Link>
    </div>
  );
}
