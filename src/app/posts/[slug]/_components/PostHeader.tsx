import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';
import { Calendar, Clock } from 'lucide-react';
import Image from 'next/image';

interface Author {
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
}

interface PostHeaderProps {
  title: string;
  author: Author | null;
  createdAt: Date;
  thumbnail: string | null;
  tags: string[];
  content: string;
}

export const PostHeader = ({
  title,
  author,
  createdAt,
  thumbnail,
  tags,
  content,
}: PostHeaderProps) => {
  const readTime = Math.max(1, Math.ceil(content.split(' ').length / 200));

  return (
    <header className="space-y-8">
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="px-3 py-1 text-xs font-bold uppercase tracking-wider">
              {tag}
            </Badge>
          ))}
        </div>

        <h1 className="text-4xl md:text-6xl font-black tracking-tight text-gray-900 dark:text-gray-100 leading-[1.1]">
          {title}
        </h1>

        <div className="flex items-center justify-between py-6 border-y border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-4">
            <Avatar className="w-12 h-12 border-2 border-white dark:border-gray-800 shadow-md">
              {author?.avatarUrl && <AvatarImage src={author.avatarUrl} alt={`${author.firstName} ${author.lastName}`} />}
              <AvatarFallback className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 font-bold">
                {author ? `${author.firstName[0]}${author.lastName[0]}` : '??'}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-base font-bold text-gray-900 dark:text-gray-100">
                {author ? `${author.firstName} ${author.lastName}` : 'Anonymous'}
              </span>
              <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {formatDate(createdAt.toISOString())}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {readTime} min read
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {thumbnail && (
        <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl border border-gray-100 dark:border-gray-800">
          <Image
            src={thumbnail}
            alt={title}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 1280px) 100vw, 1200px"
          />
        </div>
      )}
    </header>
  );
};
