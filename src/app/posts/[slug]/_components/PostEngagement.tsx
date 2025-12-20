'use client';

import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ReactionType } from '@/generated/prisma';
import { Bookmark, Eye, MessageSquare, Share2, ThumbsUp } from 'lucide-react';
import { useEffect, useState, useTransition } from 'react';
import { toast } from 'sonner';
import { getBookmarkStatus, getPostReaction, incrementViewCount, toggleBookmark, toggleReaction } from '../../_actions';

interface PostEngagementProps {
  postId: string;
  likeCount: number;
  commentCount: number;
  viewCount: number;
}

const REACTION_EMOJIS: Record<ReactionType, string> = {
  LIKE: '👍',
  LOVE: '❤️',
  CLAP: '👏',
  WOW: '😮',
  SAD: '😢',
  ANGRY: '😡',
};

export const PostEngagement = ({
  postId,
  likeCount: initialLikeCount,
  commentCount,
  viewCount: initialViewCount,
}: PostEngagementProps) => {
  const [likes, setLikes] = useState(initialLikeCount);
  const [views, setViews] = useState(initialViewCount);
  const [userReaction, setUserReaction] = useState<ReactionType | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [isReactionPopoverOpen, setIsReactionPopoverOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      // 1. Check localStorage to prevent duplicate views without bloating cookies
      const viewedPosts = JSON.parse(localStorage.getItem('viewed_posts') || '{}');
      const lastViewed = viewedPosts[postId];
      const now = Date.now();
      const ONE_DAY = 24 * 60 * 60 * 1000;

      const shouldIncrementView = !lastViewed || (now - lastViewed > ONE_DAY);

      const [bookmarkRes, reactionRes, viewRes] = await Promise.all([
        getBookmarkStatus(postId),
        getPostReaction(postId),
        shouldIncrementView ? incrementViewCount(postId) : Promise.resolve({ success: false })
      ]);

      setIsBookmarked(bookmarkRes.bookmarked);
      setUserReaction(reactionRes.reaction);

      if (viewRes.success) {
        setViews(prev => prev + 1);
        // Update localStorage
        viewedPosts[postId] = now;
        localStorage.setItem('viewed_posts', JSON.stringify(viewedPosts));
      }
    };
    fetchData();
  }, [postId]);

  const handleReaction = async (type: ReactionType) => {
    setIsReactionPopoverOpen(false);

    // Optimistic UI update
    const isRemoving = userReaction === type;
    const oldReaction = userReaction;

    setUserReaction(isRemoving ? null : type);
    if (isRemoving) {
      setLikes(prev => prev - 1);
    } else if (!oldReaction) {
      setLikes(prev => prev + 1);
    }

    startTransition(async () => {
      const result = await toggleReaction(postId, type);

      if ('error' in result && result.error) {
        toast.error(result.error);
        // Rollback
        setUserReaction(oldReaction);
        if (isRemoving) setLikes(prev => prev + 1);
        else if (!oldReaction) setLikes(prev => prev - 1);
        return;
      }

      if ('reacted' in result) {
        setUserReaction(result.reacted ? (result.type as ReactionType) : null);
        toast.success(result.reacted ? `Reacted with ${REACTION_EMOJIS[type]}` : 'Reaction removed');
      }
    });
  };

  const handleBookmark = async () => {
    startTransition(async () => {
      const result = await toggleBookmark(postId);

      if ('error' in result && result.error) {
        toast.error(result.error);
        return;
      }

      if ('bookmarked' in result) {
        setIsBookmarked(!!result.bookmarked);
        toast.success(result.bookmarked ? 'Added to bookmarks' : 'Removed from bookmarks');
      }
    });
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard!');
  };

  return (
    <div className="sticky bottom-8 left-0 right-0 flex justify-center z-50 px-4">
      <div className="flex items-center gap-2 p-2 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-200 dark:border-gray-800 rounded-full shadow-2xl">
        <div className="flex items-center px-2 gap-1 border-r border-gray-100 dark:border-gray-800 mr-1">
          <Eye className="w-4 h-4 text-gray-400" />
          <span className="text-xs font-bold text-gray-500">{views}</span>
        </div>

        <Popover open={isReactionPopoverOpen} onOpenChange={setIsReactionPopoverOpen}>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`rounded-full gap-2 transition-all ${userReaction ? 'text-blue-600 bg-blue-50 dark:bg-blue-950/20' : 'text-gray-600 dark:text-gray-400'}`}
                  >
                    {userReaction ? (
                      <span className="text-lg leading-none">{REACTION_EMOJIS[userReaction]}</span>
                    ) : (
                      <ThumbsUp className="w-4 h-4" />
                    )}
                    <span className="font-bold text-xs">{likes}</span>
                  </Button>
                </PopoverTrigger>
              </TooltipTrigger>
              <TooltipContent side="top" className="bg-gray-900 text-white border-none">
                <p className="text-xs font-bold">React to this post</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <PopoverContent
            side="top"
            align="center"
            sideOffset={12}
            className="w-fit p-1.5 rounded-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-gray-200 dark:border-gray-800 shadow-xl"
          >
            <div className="flex items-center gap-1">
              {(Object.entries(REACTION_EMOJIS) as [ReactionType, string][]).map(([type, emoji]) => (
                <Button
                  key={type}
                  variant="ghost"
                  size="icon"
                  className={`w-10 h-10 rounded-full text-xl hover:scale-125 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all ${userReaction === type ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
                  onClick={() => handleReaction(type)}
                >
                  {emoji}
                </Button>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        <Button
          variant="ghost"
          size="sm"
          className="rounded-full gap-2 text-gray-600 dark:text-gray-400"
        >
          <MessageSquare className="w-4 h-4" />
          <span className="font-bold text-xs">{commentCount}</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          disabled={isPending}
          className={`rounded-full ${isBookmarked ? 'text-blue-600 bg-blue-50 dark:bg-blue-950/20' : 'text-gray-600 dark:text-gray-400'}`}
          onClick={handleBookmark}
        >
          <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="rounded-full text-gray-600 dark:text-gray-400"
          onClick={handleShare}
        >
          <Share2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
