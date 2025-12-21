import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { format } from 'date-fns';
import { Calendar, MapPin, MessageSquare, PenTool, ThumbsUp } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getUserPosts, getUserProfile } from '../_actions';

type tParams = Promise<{ id: string }>;

export default async function UserProfilePage({ params }: { params: tParams }) {
  const { id } = await params;

  const [profileRes, postsRes] = await Promise.all([
    getUserProfile(id),
    getUserPosts(id)
  ]);

  if (!profileRes.success || !profileRes.user) {
    notFound();
  }

  const { user } = profileRes;
  const posts = postsRes.posts || [];
  const fullName = `${user.firstName} ${user.lastName}`;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header/Cover Area */}
      <div className="h-48 md:h-64 bg-gradient-to-r from-blue-600 to-indigo-700" />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Sidebar: Profile Info */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="p-6 border-none shadow-xl shadow-gray-200/50 dark:shadow-none dark:bg-gray-900 rounded-3xl overflow-hidden">
              <div className="flex flex-col items-center text-center space-y-4">
                <Avatar className="w-32 h-32 ring-4 ring-white dark:ring-gray-800 shadow-2xl">
                  <AvatarImage src={user.avatarUrl || ''} />
                  <AvatarFallback className="bg-blue-100 text-blue-600 text-3xl font-black">
                    {user.firstName[0]}
                  </AvatarFallback>
                </Avatar>

                <div className="space-y-1">
                  <h1 className="text-2xl font-black text-gray-900 dark:text-gray-100">
                    {fullName}
                  </h1>
                  <p className="text-sm font-bold text-blue-600 uppercase tracking-wider">
                    {user.authUser?.role || 'Member'}
                  </p>
                </div>

                {user.bio && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                    {user.bio}
                  </p>
                )}

                <div className="w-full pt-4 flex flex-col gap-3">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl py-6 shadow-lg shadow-blue-500/20">
                    Follow Author
                  </Button>
                  <Button variant="outline" className="w-full border-gray-200 dark:border-gray-800 font-bold rounded-xl py-6">
                    Message
                  </Button>
                </div>

                <div className="w-full pt-6 border-t border-gray-100 dark:border-gray-800 space-y-4">
                  <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400 font-medium">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    Joined {format(new Date(user.authUser?.createdAt || user.createdAt), 'MMMM yyyy')}
                  </div>
                  {user.address && (
                    <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400 font-medium">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      {user.address}
                    </div>
                  )}
                </div>
              </div>
            </Card>

            {/* Stats Card */}
            <Card className="p-6 border-none shadow-xl shadow-gray-200/50 dark:shadow-none dark:bg-gray-900 rounded-3xl">
              <h3 className="text-sm font-black text-gray-900 dark:text-gray-100 uppercase tracking-widest mb-6">
                Activity Stats
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-2xl text-center">
                  <p className="text-2xl font-black text-blue-600">{user._count.posts}</p>
                  <p className="text-[10px] font-bold text-blue-400 uppercase">Stories</p>
                </div>
                <div className="p-4 bg-indigo-50 dark:bg-indigo-950/30 rounded-2xl text-center">
                  <p className="text-2xl font-black text-indigo-600">{user._count.postReactions}</p>
                  <p className="text-[10px] font-bold text-indigo-400 uppercase">Reactions</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Main Content: Posts */}
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black text-gray-900 dark:text-gray-100">
                Published Stories
              </h2>
              <div className="h-1 flex-1 mx-6 bg-gray-200 dark:bg-gray-800 rounded-full opacity-50" />
            </div>

            {posts.length === 0 ? (
              <div className="bg-white dark:bg-gray-900 rounded-4xl p-12 text-center border border-dashed border-gray-200 dark:border-gray-800">
                <PenTool className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">No stories yet</h3>
                <p className="text-sm text-gray-500">This author hasn't published any stories yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {posts.map((post) => (
                  <Link key={post.id} href={`/posts/${post.slug}`}>
                    <Card className="group p-5 border-none shadow-lg hover:shadow-2xl transition-all duration-300 dark:bg-gray-900 rounded-3xl overflow-hidden">
                      <div className="flex flex-col md:flex-row gap-6">
                        {post.thumbnail && (
                          <div className="w-full md:w-48 h-32 shrink-0 rounded-2xl overflow-hidden">
                            <img
                              src={post.thumbnail}
                              alt={post.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          </div>
                        )}
                        <div className="flex-1 space-y-3">
                          <div className="flex items-center gap-2">
                            {post.tags.slice(0, 2).map(tag => (
                              <span key={tag} className="text-[10px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 dark:bg-blue-950/50 px-2 py-1 rounded-md">
                                {tag}
                              </span>
                            ))}
                            <span className="text-[10px] font-bold text-gray-400 ml-auto">
                              {format(new Date(post.createdAt), 'MMM d, yyyy')}
                            </span>
                          </div>
                          <h3 className="text-xl font-black text-gray-900 dark:text-gray-100 group-hover:text-blue-600 transition-colors line-clamp-2">
                            {post.title}
                          </h3>
                          <div className="flex items-center gap-4 pt-2">
                            <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500">
                              <ThumbsUp className="w-3.5 h-3.5" />
                              {post.likeCount}
                            </div>
                            <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500">
                              <MessageSquare className="w-3.5 h-3.5" />
                              {post.commentCount}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}
