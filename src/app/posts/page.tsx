import { prisma } from '@/lib/prisma';
import PostsHeader from './_componets/PostsHeader';
import PostList from './_componets/PostList';

const PostPage = async () => {
  const posts = await prisma.post.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
      <div className="container mx-auto px-4 py-8">
        <PostsHeader />
        <PostList posts={posts} />
      </div>
    </div>
  );
};

export default PostPage;
