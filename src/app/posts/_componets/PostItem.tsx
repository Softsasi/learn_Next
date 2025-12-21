'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { logger } from '@/lib/logger';
import { isValidUrl } from '@/utils/url';
import { Calendar, Clock, Eye, MessageSquare, ThumbsUp } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface Author {
  id: string;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
}

interface PostItemProps {
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

const PostItem = ({
  id,
  title,
  content,
  author,
  createdAt,
  updatedAt,
  slug,
  thumbnail,
  tags,
  likeCount,
  commentCount,
  viewCount,
}: PostItemProps) => {
  const formatDate = (date: string | undefined) => {
    if (!date) return 'Unknown date';
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) return 'Invalid date';

    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(parsedDate);
  };


  logger.debug('Rendering PostItem:', { id, title, slug });

  // Simple read time calculation (avg 200 words per minute)
  const readTime = Math.max(1, Math.ceil(content.split(' ').length / 200));

  return (
    <Card className="group flex flex-col h-full hover:shadow-2xl transition-all duration-500 border-gray-200/60 dark:border-gray-800/60 overflow-hidden bg-white dark:bg-gray-950/50 backdrop-blur-sm">
      {/* Thumbnail Section */}
      <div className="relative aspect-video overflow-hidden bg-gray-100 dark:bg-gray-900">
        {isValidUrl(thumbnail) ? (
          <Image
            src={thumbnail!}
            alt={title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
            <span className="text-6xl font-black text-blue-200 dark:text-blue-900/30 select-none">
              {title[0]}
            </span>
          </div>
        )}

        {/* Overlay Tags */}
        <div className="absolute top-4 left-4 flex flex-wrap gap-2 z-10">
          {tags.slice(0, 2).map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider border-none shadow-sm"
            >
              {tag}
            </Badge>
          ))}
        </div>

        {/* Read Time Overlay */}
        <div className="absolute bottom-4 right-4 z-10">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-medium">
            <Clock className="w-3 h-3" />
            {readTime} min read
          </div>
        </div>
      </div>

      <CardHeader className="p-6 pb-3 space-y-4">
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10 border-2 border-white dark:border-gray-800 shadow-sm">
            {isValidUrl(author.avatarUrl) && (
              <AvatarImage src={author.avatarUrl!} alt={`${author.firstName} ${author.lastName}`} />
            )}
            <AvatarFallback className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 font-bold text-xs">
              {author.firstName[0]}{author.lastName[0]}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-gray-900 dark:text-gray-100 leading-none mb-1">
              {author.firstName} {author.lastName}
            </span>
            <div className="flex items-center text-[11px] text-gray-500 dark:text-gray-400 font-medium">
              <Calendar className="w-3 h-3 mr-1 opacity-70" />
              {formatDate(createdAt)}
            </div>
          </div>
        </div>

        <Link href={`/posts/${slug}`} className="block group/title">
          <CardTitle className="text-xl font-extrabold leading-tight text-gray-900 dark:text-gray-100 group-hover/title:text-blue-600 dark:group-hover/title:text-blue-400 transition-colors line-clamp-2">
            {title}
          </CardTitle>
        </Link>
      </CardHeader>

      <CardContent className="px-6 pb-6 pt-0 flex flex-col grow">
        <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400 mb-6 line-clamp-3 grow">
          {content}
        </p>

        <div className="space-y-4">
          <Separator className="bg-gray-100 dark:bg-gray-800" />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-5 text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-1.5 group/stat cursor-default">
                <ThumbsUp className="w-4 h-4 group-hover/stat:text-blue-500 transition-colors" />
                <span className="text-xs font-bold">{likeCount}</span>
              </div>
              <div className="flex items-center gap-1.5 group/stat cursor-default">
                <MessageSquare className="w-4 h-4 group-hover/stat:text-green-500 transition-colors" />
                <span className="text-xs font-bold">{commentCount}</span>
              </div>
              <div className="flex items-center gap-1.5 group/stat cursor-default">
                <Eye className="w-4 h-4 group-hover/stat:text-purple-500 transition-colors" />
                <span className="text-xs font-bold">{viewCount}</span>
              </div>
            </div>

            <Button
              variant="link"
              size="sm"
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 p-0 h-auto font-bold text-xs uppercase tracking-wider"
              asChild
            >
              <Link href={`/posts/${slug}`} className="group inline-flex items-center">
                Read More
                <span className="ml-1 group-hover:translate-x-1 transition-transform inline-block">→</span>
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const PostItemSkeleton = () => {
  return (
    <Card className="group flex flex-col h-full border-gray-200/60 dark:border-gray-800/60 overflow-hidden animate-pulse bg-white dark:bg-gray-950/50">
      <div className="aspect-video bg-gray-200 dark:bg-gray-900" />
      <CardHeader className="p-6 pb-3 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-900" />
          <div className="flex flex-col gap-2">
            <div className="h-3 w-24 bg-gray-200 dark:bg-gray-900 rounded" />
            <div className="h-2 w-16 bg-gray-200 dark:bg-gray-900 rounded" />
          </div>
        </div>
        <div className="space-y-2">
          <div className="h-5 w-full bg-gray-200 dark:bg-gray-900 rounded" />
          <div className="h-5 w-2/3 bg-gray-200 dark:bg-gray-900 rounded" />
        </div>
      </CardHeader>
      <CardContent className="px-6 pb-6 pt-0">
        <div className="space-y-2 mb-6">
          <div className="h-3 w-full bg-gray-200 dark:bg-gray-900 rounded" />
          <div className="h-3 w-full bg-gray-200 dark:bg-gray-900 rounded" />
          <div className="h-3 w-4/5 bg-gray-200 dark:bg-gray-900 rounded" />
        </div>
        <div className="space-y-4">
          <div className="h-px w-full bg-gray-100 dark:bg-gray-800" />
          <div className="flex justify-between items-center">
            <div className="flex gap-4">
              <div className="h-4 w-8 bg-gray-200 dark:bg-gray-900 rounded" />
              <div className="h-4 w-8 bg-gray-200 dark:bg-gray-900 rounded" />
              <div className="h-4 w-8 bg-gray-200 dark:bg-gray-900 rounded" />
            </div>
            <div className="h-4 w-16 bg-gray-200 dark:bg-gray-900 rounded" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PostItem;
