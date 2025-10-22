'use client';

import { useEffect, useState } from 'react';
import PostItem from './PostItem';

interface Post {
  id: string;
  title: string;
  content: string;
  authorId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface PostListProps {
  posts: Post[];
}

const PostList = () => {
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          'http://localhost:3000/api/posts?page=1&limit=15'
        );
        const data = await response.json();
        console.log(data);

        setPosts(data);
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  if (!posts || posts.length === 0) {
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
    </div>
  );
};

export default PostList;
