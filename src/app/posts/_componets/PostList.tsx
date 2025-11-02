'use client';

import AppConfig from '@/config/appConfig';
import { useEffect, useRef, useState } from 'react';
import PostItem, { PostItemSkeleton } from './PostItem';

interface Post {
  id: string;
  title: string;
  content: string;
  authorId: string;
  createdAt?: Date;
  updatedAt?: Date;
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
  const isFetchingRef = useRef(false); // Prevents duplicate requests

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
      isFetchingRef.current = false; // release lock
    }
  };

  // Initial load
  useEffect(() => {
    if (nextPageUrl) fetchPosts(nextPageUrl);
  }, []);

  // Infinite scroll observer
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

  // --- UI states ---

  if (error) {
    return <div className="text-center text-red-600">Error: {error}</div>;
  }

  if (loading && posts.length === 0) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <PostItemSkeleton key={`skeleton-${i}`} />
        ))}
      </div>
    );
  }

  if (!posts.length && !loading) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📝</div>
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
          No posts yet
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Be the first to share something amazing!
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <PostItem
            key={post.id}
            id={post.id}
            title={post.title}
            content={post.content}
            authorId={post.authorId}
            createdAt={post.createdAt}
            updatedAt={post.updatedAt}
          />
        ))}

        {loading &&
          posts.length > 0 &&
          Array.from({ length: 3 }).map((_, i) => (
            <PostItemSkeleton key={`loading-skel-${i}`} />
          ))}
      </div>

      <div ref={observerRef} className="h-10 flex justify-center items-center">
        {!nextPageUrl && !loading && (
          <span className="text-gray-400">No more posts</span>
        )}
      </div>
    </>
  );
};

export default PostList;
