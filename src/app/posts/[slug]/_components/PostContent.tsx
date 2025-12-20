interface PostContentProps {
  content: string;
}

export const PostContent = ({ content }: PostContentProps) => {
  return (
    <div className="prose prose-lg dark:prose-invert max-w-none">
      <div className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap font-medium">
        {content}
      </div>
    </div>
  );
};
