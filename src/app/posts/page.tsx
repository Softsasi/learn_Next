import { prisma } from '@/lib/prisma';
import Link from 'next/link';

const PostPage = async () => {
  const post = await prisma.post.findMany();

  if (!post) {
    return <div>No posts found</div>;
  }

  return (
    <div className="text-3xl font-bold underline">
      <Link
        href="/posts/create"
        className="text-3xl font-semibold text-gray-800 dark:text-gray-100 text-center mb-8"
      >
        Create a New Post
      </Link>

      <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 text-center mb-8">
        All Posts
      </h1>

      <ul className="space-y-4">
        {post.map((p) => (
          <li
            key={p.id}
            className="p-4 border border-gray-200/50 dark:border-gray-700/50 rounded-2xl shadow-lg"
          >
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
              {p.title}
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-300">{p.content}</p>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Author ID: {p.authorId}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PostPage;
