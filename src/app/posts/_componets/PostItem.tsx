'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, User } from 'lucide-react';
import Link from 'next/link';

interface PostItemProps {
  id: string;
  title: string;
  content: string;
  authorId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const PostItem = ({
  id,
  title,
  content,
  authorId,
  createdAt,
  updatedAt,
}: PostItemProps) => {
  const formatDate = (date: Date | string | undefined) => {
    if (!date) return 'Unknown date';

    // Convert string to Date object
    const parsedDate = typeof date === 'string' ? new Date(date) : date;

    // Guard against invalid date values
    if (isNaN(parsedDate.getTime())) return 'Invalid date';

    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(parsedDate);
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-semibold text-gray-800 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {title}
          </CardTitle>
          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
            <User className="w-3 h-3 mr-1" />
            {authorId}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
          {content}
        </p>
        <div className="flex justify-between items-center">
          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
            <Calendar className="w-3 h-3 mr-1" />
            {formatDate(createdAt)}
            {updatedAt && createdAt && updatedAt > createdAt && ' (updated)'}
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href={`/posts/${id}`}>Read More</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export const PostItemSkeleton = () => {
  return (
    <Card className="group transition-all duration-300 border-gray-200/50 dark:border-gray-700/50 overflow-hidden animate-pulse">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-semibold text-gray-300 dark:text-gray-600 h-6 w-3/4 bg-gray-200 rounded-sm" />
          <div className="flex items-center text-xs text-gray-400">
            <User className="w-3 h-3 mr-1 text-gray-400" />
            <div className="h-3 w-12 bg-gray-200 rounded-sm" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
          <span className="block h-3 bg-gray-200 rounded-sm mb-2" />
          <span className="block h-3 bg-gray-200 rounded-sm mb-2 w-5/6" />
          <span className="block h-3 bg-gray-200 rounded-sm w-2/3" />
        </p>
        <div className="flex justify-between items-center">
          <div className="flex items-center text-xs text-gray-400">
            <Calendar className="w-3 h-3 mr-1 text-gray-400" />
            <div className="h-3 w-20 bg-gray-200 rounded-sm" />
          </div>
          <div className="h-8 w-20 border border-gray-300 rounded-md bg-gray-100" />
        </div>
      </CardContent>
    </Card>
  );
};

export default PostItem;
