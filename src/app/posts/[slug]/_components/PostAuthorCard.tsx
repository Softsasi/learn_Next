import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';

interface Author {
  id: string;
  firstName: string;
  lastName: string;
  bio: string | null;
  avatarUrl: string | null;
}

interface PostAuthorCardProps {
  author: Author | null;
}

export const PostAuthorCard = ({ author }: PostAuthorCardProps) => {
  if (!author) return null;

  return (
    <Card className="bg-gray-50 dark:bg-gray-900/50 border-none shadow-none rounded-3xl overflow-hidden">
      <CardContent className="p-8">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left">
          <Avatar className="w-20 h-20 border-4 border-white dark:border-gray-800 shadow-xl">
            {author.avatarUrl && <AvatarImage src={author.avatarUrl} alt={`${author.firstName} ${author.lastName}`} />}
            <AvatarFallback className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 font-black text-xl">
              {author.firstName[0]}{author.lastName[0]}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-3">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-black text-gray-900 dark:text-gray-100">
                  Written by {author.firstName} {author.lastName}
                </h3>
                <p className="text-sm font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">
                  Content Creator
                </p>
              </div>
              <Link href={`/users/${author.id}`}>
                <Button variant="outline" className="rounded-full font-bold text-xs px-6">
                  View Profile
                </Button>
              </Link>
            </div>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
              {author.bio || "This author hasn't shared a bio yet, but their stories speak for themselves."}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
