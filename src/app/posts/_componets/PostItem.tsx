import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, User } from 'lucide-react';

interface PostItemProps {
  id: string;
  title: string;
  content: string;
  authorId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const PostItem = ({ id, title, content, authorId, createdAt, updatedAt }: PostItemProps) => {
  const formatDate = (date: Date | undefined) => {
    if (!date) return 'Unknown date';
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
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
            <Link href={`/posts/${id}`}>
              Read More
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PostItem;
