import { prisma } from '@/lib/prisma';
import { formatDate } from '@/lib/utils';
import { ArrowLeft, Calendar, User } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

type tParams = Promise<{ id: string }>;

export interface postType {
  id: string;
  title: string;
  content: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
  author?: Author;
}

export interface Author {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  createdAt: string;
  updatedAt: string;
}

const page = async ({ params }: { params: tParams }) => {
  const { id } = await params;

  const post = (await prisma.post.findUnique({
    where: {
      id,
    },
    include: {
      author: true,
    },
  })) as unknown as postType | null;

  console.log(post);

  if (!post) {
    notFound();
  }

  const authorName = post.author
    ? `${post.author.firstName} ${post.author.lastName}`
    : 'Unknown Author';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Navigation */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/posts"
            className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Posts
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="mb-10">
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 leading-tight mb-6">
            {post.title}
          </h1>

          {/* Meta Information */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 pb-8 border-b border-slate-200">
            {/* Author Info */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900">
                  {authorName}
                </p>
                <p className="text-xs text-slate-500">{post.author?.email}</p>
              </div>
            </div>

            {/* Date Info */}
            <div className="flex items-center gap-2 text-slate-600 sm:ml-auto">
              <Calendar className="w-5 h-5 text-slate-400" />
              <time className="text-sm font-medium">
                {formatDate(new Date(post.createdAt).toISOString())}
              </time>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="prose prose-slate max-w-none mb-12">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 sm:p-10">
            <div className="text-slate-700 leading-relaxed text-lg whitespace-pre-wrap">
              {post.content}
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="grid grid-cols-2 gap-4 sm:gap-6 mb-12">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-1">
              Published
            </p>
            <p className="text-sm text-blue-900 font-medium">
              {formatDate(new Date(post.createdAt).toISOString())}
            </p>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
            <p className="text-xs font-semibold text-purple-600 uppercase tracking-wide mb-1">
              Last Updated
            </p>
            <p className="text-sm text-purple-900 font-medium">
              {formatDate(new Date(post.updatedAt).toISOString())}
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-8 text-white text-center">
          <h3 className="text-xl font-bold mb-2">
            Want to share your thoughts?
          </h3>
          <p className="text-blue-100 mb-6">
            Join our community and start writing your own posts
          </p>
          <Link
            href="/posts/create"
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
          >
            Create a Post
          </Link>
        </div>
      </article>
    </div>
  );
};

export default page;
