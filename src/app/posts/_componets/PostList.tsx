'use client';

import AppConfig from '@/config/appConfig';
import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import PostItem, { PostItemSkeleton } from './PostItem';

interface Author {
  id: string;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
}

interface Post {
  id: string;
  title: string;
  content: string;
  author: Author;
  createdAt: string;
  updatedAt: string;
  slug: string;
  thumbnail: string | null;
  tags: string[];
  likeCount: number;
  commentCount: number;
  viewCount: number;
}

interface ApiResponse {
  posts: Post[];
  meta: {
    currentPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    itemsPerPage: number;
    totalItems: number;
    totalPages: number;
    startItem: number;
    endItem: number;
  };
  links: {
    next: string | null;
    prev: string | null;
    first: string | null;
    last: string | null;
  };
}

const PostList = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nextPageUrl, setNextPageUrl] = useState<string | null>(
    `${AppConfig.apiUrl}/posts?page=1&limit=15`
  );

  const observerRef = useRef<HTMLDivElement | null>(null);
  const isFetchingRef = useRef(false);

  const fetchPosts = async (url: string) => {
    if (!url || isFetchingRef.current) return;

    try {
      isFetchingRef.current = true;
      setLoading(true);

      const response = await fetch(url);
      const data: ApiResponse = await response.json();

      setPosts((prev) => [...prev, ...data.posts]);
      setNextPageUrl(data.links.next);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  };

  useEffect(() => {
    if (nextPageUrl && posts.length === 0) fetchPosts(nextPageUrl);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0];
      if (
        entry.isIntersecting &&
        nextPageUrl &&
        !loading &&
        !isFetchingRef.current
      ) {
        fetchPosts(nextPageUrl);
      }
    });

    const node = observerRef.current;
    if (node) observer.observe(node);

    return () => {
      if (node) observer.unobserve(node);
    };
  }, [nextPageUrl, loading]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 text-red-600 rounded-full flex items-center justify-center mb-4">
          <span className="text-2xl">⚠️</span>
        </div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">Something went wrong</h3>
        <p className="text-gray-500 dark:text-gray-400 max-w-xs">{error}</p>
      </div>
    );
  }

  if (loading && posts.length === 0) {
    return (
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <PostItemSkeleton key={`skeleton-${i}`} />
        ))}
      </div>
    );
  }

  if (!posts.length && !loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <div className="text-7xl mb-6 grayscale opacity-50">📝</div>
        <h3 className="text-2xl font-black text-gray-900 dark:text-gray-100 mb-3">
          No stories found
        </h3>
        <p className="text-gray-500 dark:text-gray-400 max-w-sm">
          We couldn't find any posts at the moment. Check back later or be the first to share something!
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: (index % 15) * 0.05 }}
          >
            <PostItem
              id={post.id}
              title={post.title}
              content={post.content}
              author={post.author}
              createdAt={post.createdAt}
              updatedAt={post.updatedAt}
              slug={post.slug}
              thumbnail={post.thumbnail}
              tags={post.tags}
              likeCount={post.likeCount}
              commentCount={post.commentCount}
              viewCount={post.viewCount}
            />
          </motion.div>
        ))}

        {loading &&
          posts.length > 0 &&
          Array.from({ length: 3 }).map((_, i) => (
            <PostItemSkeleton key={`loading-skel-${i}`} />
          ))}
      </div>

      <div ref={observerRef} className="mt-20 mb-12 flex flex-col items-center justify-center gap-6">
        {!nextPageUrl && !loading && posts.length > 0 && (
          <div className="flex flex-col items-center gap-4">
            <div className="h-px w-32 bg-linear-to-r from-transparent via-gray-200 to-transparent dark:via-gray-800" />
            <span className="text-sm font-bold text-gray-400 dark:text-gray-600 uppercase tracking-widest">
              End of stories
            </span>
          </div>
        )}
        {loading && posts.length > 0 && (
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
            <div className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:-0.3s]" />
            <div className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:-0.15s]" />
            <div className="w-2 h-2 bg-current rounded-full animate-bounce" />
          </div>
        )}
      </div>
    </>
  );
};

export default PostList;
