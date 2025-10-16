import PostItem from './PostItem';

interface Post {
  id: string;
  title: string;
  content: string;
  authorId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface PostListProps {
  posts: Post[];
}

const PostList = ({ posts }: PostListProps) => {
  if (!posts || posts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📝</div>
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
          No posts yet
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Be the first to share something amazing!
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <PostItem
          key={post.id}
          id={post.id}
          title={post.title}
          content={post.content}
          authorId={post.authorId}
          createdAt={post.createdAt}
          updatedAt={post.updatedAt}
        />
      ))}
    </div>
  );
};

export default PostList;
