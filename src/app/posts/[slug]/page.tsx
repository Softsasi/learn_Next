import { prisma } from '@/lib/prisma';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PostAuthorCard } from './_components/PostAuthorCard';
import { PostContent } from './_components/PostContent';
import { PostEngagement } from './_components/PostEngagement';
import { PostHeader } from './_components/PostHeader';

type tParams = Promise<{ slug: string }>;

interface Author {
  id: string;
  firstName: string;
  lastName: string;
  bio: string | null;
  avatarUrl: string | null;
  email?: string;
}

interface Post {
  id: string;
  title: string;
  content: string;
  published: boolean;
  thumbnail: string | null;
  tags: string[];
  slug: string;
  createdAt: Date;
  updatedAt: Date;
  likeCount: number;
  commentCount: number;
  viewCount: number;
  author: Author | null;
}

const PostPage = async ({ params }: { params: tParams }) => {
  const { slug } = await params;

  const post = await prisma.post.findUnique({
    where: {
      slug,
    },
    include: {
      author: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          bio: true,
          avatarUrl: true,
        }
      },
    },
  }) as Post | null;

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl border-b border-gray-100 dark:border-gray-900">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <Link
            href="/posts"
            className="group inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Stories
          </Link>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-12 md:py-20 space-y-16">
        <PostHeader
          title={post.title}
          author={post.author}
          createdAt={post.createdAt}
          thumbnail={post.thumbnail}
          tags={post.tags}
          content={post.content}
        />

        <PostContent content={post.content} />

        <div className="space-y-12">
          <PostAuthorCard author={post.author} />

          {/* Call to Action */}
          <div className="relative overflow-hidden bg-blue-600 rounded-4xl p-8 md:p-12 text-white text-center shadow-2xl shadow-blue-500/20">
            <div className="relative z-10 space-y-6">
              <h3 className="text-2xl md:text-4xl font-black">
                Enjoyed this story?
              </h3>
              <p className="text-blue-100 text-lg font-medium max-w-md mx-auto">
                Join our community of writers and share your own amazing stories with the world.
              </p>
              <Link
                href="/posts/create"
                className="inline-block bg-white text-blue-600 px-10 py-4 rounded-full font-black hover:bg-blue-50 transition-all hover:scale-105 active:scale-95 shadow-xl"
              >
                Start Writing Now
              </Link>
            </div>
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-64 h-64 bg-indigo-400/20 rounded-full blur-3xl" />
          </div>
        </div>
      </main>

      <PostEngagement
        postId={post.id}
        likeCount={post.likeCount}
        commentCount={post.commentCount}
        viewCount={post.viewCount}
      />
    </div>
  );
};

export default PostPage;
