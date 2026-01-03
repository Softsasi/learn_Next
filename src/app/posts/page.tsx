
import PostList from './_componets/PostList';
import PostsHeader from './_componets/PostsHeader';

const PostPage = async () => {

// check authentication

  // is user admin ? true: false

  


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
      <div className="container mx-auto px-4 py-8">
        <PostsHeader />
        <PostList  />
      </div>
    </div>
  );
};

export default PostPage;
