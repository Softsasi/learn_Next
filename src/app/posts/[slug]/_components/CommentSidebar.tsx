'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ReactionType } from '@/generated/prisma';
import { formatDistanceToNow } from 'date-fns';
import {
  ExternalLink,
  Reply,
  ThumbsUp,
  X
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import { memo, useCallback, useEffect, useMemo, useState, useTransition } from 'react';
import { toast } from 'sonner';
import { addComment, getComments, toggleCommentReaction } from '../../_actions';

interface CommentSidebarProps {
  postId: string;
  isOpen: boolean;
  onClose: () => void;
  commentCount: number;
  onCommentAdded?: () => void;
}

const REACTION_EMOJIS: Record<ReactionType, string> = {
  LIKE: '👍',
  LOVE: '❤️',
  CLAP: '👏',
  WOW: '😮',
  SAD: '😢',
  ANGRY: '😡',
};

export const CommentSidebar = ({
  postId,
  isOpen,
  onClose,
  commentCount: initialCommentCount,
  onCommentAdded,
}: CommentSidebarProps) => {
  const { data: session } = useSession();
  const [comments, setComments] = useState<any[]>([]);
  const [totalComments, setTotalComments] = useState(initialCommentCount);
  const [newComment, setNewComment] = useState('');
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(true);

  const fetchComments = useCallback(async () => {
    setIsLoading(true);
    const result = await getComments(postId);
    if (result.success) {
      setComments(result.comments || []);
      if (result.totalCount !== undefined) {
        setTotalComments(result.totalCount);
      }
    } else {
      toast.error(result.error || 'Failed to load comments');
    }
    setIsLoading(false);
  }, [postId]);

  useEffect(() => {
    if (isOpen) {
      fetchComments();
    }
  }, [isOpen, fetchComments]);

  const handleSubmitComment = useCallback(async (content: string, parentId?: string) => {
    if (!content.trim()) return;

    startTransition(async () => {
      const result = await addComment(postId, content, parentId);
      if (result.success) {
        if (!parentId) setNewComment('');
        setActiveReplyId(null);
        toast.success(parentId ? 'Reply added!' : 'Comment added!');
        onCommentAdded?.();
        fetchComments();
      } else {
        toast.error(result.error || 'Failed to add comment');
      }
    });
  }, [postId, onCommentAdded, fetchComments]);

  const handleReaction = useCallback(async (commentId: string, type: ReactionType) => {
    const result = await toggleCommentReaction(commentId, type);
    if (result.success) {
      fetchComments();
    } else {
      toast.error(result.error || 'Failed to react');
    }
  }, [fetchComments]);

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        className="w-full sm:max-w-[480px] h-full flex flex-col p-0 gap-0 border-l dark:border-gray-800 shadow-2xl will-change-transform"
      >
        <SheetHeader className="px-6 py-4 flex flex-row items-center justify-between border-b bg-white dark:bg-gray-950 shrink-0">
          <SheetTitle className="text-lg font-black tracking-tight">
            Comments <span className="text-gray-400 ml-1">({totalComments})</span>
          </SheetTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-900"
          >
            <X className="w-4 h-4" />
          </Button>
        </SheetHeader>

        <ScrollArea className="flex-1">
          <div className="p-6 space-y-8 pb-24">
            {/* Input Section at Top */}
            <div className="space-y-4 bg-white dark:bg-gray-950 rounded-xl border border-gray-200 dark:border-gray-800 p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <Avatar className="w-7 h-7 ring-1 ring-gray-100 dark:ring-gray-800">
                  <AvatarImage src={session?.user?.image || ''} />
                  <AvatarFallback className="bg-blue-50 text-blue-600 text-[10px] font-bold">
                    {session?.user?.name?.[0] || 'U'}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                  {session?.user?.name || 'Anonymous User'}
                </span>
              </div>

              <div className="relative">
                <Textarea
                  placeholder="Ask a question to spark a conversation"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="min-h-20 w-full resize-none border-none bg-transparent p-0 focus-visible:ring-0 text-[15px] placeholder:text-gray-400 leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-900">
                <button className="text-[11px] font-bold text-gray-400 hover:text-gray-600 flex items-center gap-1.5 transition-colors">
                  <ExternalLink className="w-3 h-3" />
                  Code of conduct
                </button>
                <Button
                  disabled={isPending || !newComment.trim()}
                  onClick={() => handleSubmitComment(newComment)}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-5 font-bold shadow-sm transition-all active:scale-95"
                >
                  {isPending && !activeReplyId ? 'Posting...' : 'Comment'}
                </Button>
              </div>
            </div>

            {/* Comments List */}
            <div className="space-y-6">
              {isLoading ? (
                <div className="space-y-6">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse flex gap-4">
                      <div className="w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-900" />
                      <div className="flex-1 space-y-3">
                        <div className="h-3 w-24 bg-gray-100 dark:bg-gray-900 rounded-full" />
                        <div className="h-16 bg-gray-100 dark:bg-gray-900 rounded-xl" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : comments.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
                  <img
                    src="https://cdn.hashnode.com/res/hashnode/image/upload/v1625554634580/6v-6v-6v.png"
                    alt="No comments"
                    className="w-32 h-auto opacity-50 grayscale"
                  />
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">No comments yet</h3>
                    <p className="text-xs text-gray-500 font-medium">
                      Be the first one to share your thoughts!
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-8">
                  {comments.map((comment) => (
                    <CommentItem
                      key={comment.id}
                      comment={comment}
                      activeReplyId={activeReplyId}
                      setActiveReplyId={setActiveReplyId}
                      onReplySubmit={handleSubmitComment}
                      onReact={handleReaction}
                      isPending={isPending}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};interface CommentItemProps {
  comment: any;
  activeReplyId: string | null;
  setActiveReplyId: (id: string | null) => void;
  onReplySubmit: (content: string, parentId: string) => Promise<void>;
  onReact: (commentId: string, type: ReactionType) => void;
  isReply?: boolean;
  isPending?: boolean;
}

const CommentItem = memo(({
  comment,
  activeReplyId,
  setActiveReplyId,
  onReplySubmit,
  onReact,
  isReply = false,
  isPending = false
}: CommentItemProps) => {
  const { data: session } = useSession();
  const authorName = `${comment.author.firstName} ${comment.author.lastName}`;
  const [replyContent, setReplyContent] = useState('');
  const [isReactionPopoverOpen, setIsReactionPopoverOpen] = useState(false);
  const isActive = activeReplyId === comment.id;

  const userReaction = useMemo(() =>
    comment.commentReactions?.find((r: any) => r.userId === session?.user?.id)?.type as ReactionType | undefined,
    [comment.commentReactions, session?.user?.id]
  );

  return (
    <div className={`flex gap-3 group ${isReply ? 'ml-9 mt-4' : ''}`}>
      <Avatar className="w-8 h-8 ring-1 ring-gray-100 dark:ring-gray-800 shrink-0">
        <AvatarImage src={comment.author.avatarUrl} />
        <AvatarFallback className="bg-gray-100 text-gray-600 text-[10px] font-bold">
          {comment.author.firstName[0]}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 space-y-1.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[13px] font-bold text-gray-900 dark:text-gray-100 hover:text-blue-600 cursor-pointer transition-colors">
              {authorName}
            </span>
            <span className="text-[10px] font-medium text-gray-400">
              • {formatDistanceToNow(new Date(comment.createdAt))} ago
            </span>
          </div>
        </div>

        <div className="text-[14px] text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
          {comment.content}
        </div>

        <div className="flex items-center gap-4 pt-0.5">
          <Popover open={isReactionPopoverOpen} onOpenChange={setIsReactionPopoverOpen}>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <PopoverTrigger asChild>
                    <button
                      className={`group/btn flex items-center gap-1 transition-all ${userReaction ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                      {userReaction ? (
                        <span className="text-sm leading-none">{REACTION_EMOJIS[userReaction]}</span>
                      ) : (
                        <ThumbsUp className="w-3.5 h-3.5 group-hover/btn:scale-110 transition-transform" />
                      )}
                      <span className="text-[11px] font-bold">{comment.commentReactions?.length || 0}</span>
                    </button>
                  </PopoverTrigger>
                </TooltipTrigger>
                <TooltipContent side="top" className="bg-gray-900 text-white border-none py-1 px-2">
                  <p className="text-[10px] font-bold">React</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <PopoverContent
              side="top"
              align="start"
              sideOffset={4}
              className="w-fit p-1 rounded-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-gray-200 dark:border-gray-800 shadow-lg"
            >
              <div className="flex items-center gap-0.5">
                {(Object.entries(REACTION_EMOJIS) as [ReactionType, string][]).map(([type, emoji]) => (
                  <Button
                    key={type}
                    variant="ghost"
                    size="icon"
                    className={`w-7 h-7 rounded-full text-base hover:scale-125 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all ${userReaction === type ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
                    onClick={() => {
                      onReact(comment.id, type);
                      setIsReactionPopoverOpen(false);
                    }}
                  >
                    {emoji}
                  </Button>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          <button
            onClick={() => {
              setActiveReplyId(isActive ? null : comment.id);
              setReplyContent('');
            }}
            className={`flex items-center gap-1 text-[11px] font-bold transition-all ${isActive ? 'text-blue-600' : 'text-gray-400 hover:text-blue-600'}`}
          >
            <Reply className="w-3.5 h-3.5" />
            {isActive ? 'Cancel' : 'Reply'}
          </button>
        </div>

        {/* Inline Reply Input */}
        {isActive && (
          <div className="mt-3 space-y-2 bg-gray-50/50 dark:bg-gray-900/30 p-3 rounded-lg border border-gray-100 dark:border-gray-800 animate-in fade-in slide-in-from-top-1 duration-200">
            <Textarea
              placeholder={`Reply to ${authorName}...`}
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              className="min-h-12 w-full resize-none border-none bg-transparent p-0 focus-visible:ring-0 text-[13px] placeholder:text-gray-400"
              autoFocus
            />
            <div className="flex justify-end pt-2 border-t border-gray-100 dark:border-gray-800">
              <Button
                size="sm"
                disabled={isPending || !replyContent.trim()}
                onClick={() => onReplySubmit(replyContent, comment.id)}
                className="h-7 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold rounded-md px-3"
              >
                {isPending ? 'Replying...' : 'Reply'}
              </Button>
            </div>
          </div>
        )}

        {comment.replies && comment.replies.length > 0 && (
          <div className="space-y-4 pt-1">
            {comment.replies.map((reply: any) => (
              <CommentItem
                key={reply.id}
                comment={reply}
                activeReplyId={activeReplyId}
                setActiveReplyId={setActiveReplyId}
                onReplySubmit={onReplySubmit}
                onReact={onReact}
                isReply={true}
                isPending={isPending}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
});CommentItem.displayName = 'CommentItem';
