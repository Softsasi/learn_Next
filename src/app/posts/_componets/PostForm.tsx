'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const PostForm = () => {
  const [state, setState] = useState({
    title: '',
    content: '',
    authorId: '',
  });

  useEffect(() => {
    const userData = localStorage.getItem('user');
    const user = userData ? JSON.parse(userData) : null;

    if (user && user.userId) {
      setState((prev) => ({ ...prev, authorId: user.userId }));
    }
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(state),
    });

    const data = await res.json();
    console.log('response', data);

    setState({ title: '', content: '', authorId: state.authorId });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-xl bg-white/70 dark:bg-gray-900/60 backdrop-blur-lg
                   border border-gray-200/50 dark:border-gray-700/50
                   rounded-2xl shadow-lg p-8"
      >
        <h1 className="text-3xl font-semibold text-gray-800 dark:text-gray-100 text-center mb-8">
          ✍️ Create a New Post
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="group">
            <label
              htmlFor="title"
              className="block mb-2 text-sm font-medium text-gray-600 dark:text-gray-300"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              className="w-full px-4 py-3 rounded-xl bg-gray-50/80 dark:bg-gray-800/70
                         border border-gray-300 dark:border-gray-700
                         focus:ring-2 focus:ring-blue-500 focus:border-transparent
                         outline-none text-gray-800 dark:text-gray-100
                         placeholder:text-gray-400 dark:placeholder:text-gray-500
                         transition-all duration-200"
              placeholder="Enter post title..."
              required
              onChange={handleChange}
              value={state.title}
            />
          </div>

          {/* Content */}
          <div className="group">
            <label
              htmlFor="content"
              className="block mb-2 text-sm font-medium text-gray-600 dark:text-gray-300"
            >
              Content
            </label>
            <textarea
              id="content"
              name="content"
              className="w-full px-4 py-3 rounded-xl bg-gray-50/80 dark:bg-gray-800/70
                         border border-gray-300 dark:border-gray-700
                         focus:ring-2 focus:ring-blue-500 focus:border-transparent
                         outline-none text-gray-800 dark:text-gray-100
                         placeholder:text-gray-400 dark:placeholder:text-gray-500
                         resize-none transition-all duration-200"
              placeholder="Write something inspiring..."
              required
              rows={6}
              onChange={handleChange}
              value={state.content}
            />
          </div>

          {/* Author ID */}
          <input
            type="text"
            id="authorId"
            name="authorId"
            value={state.authorId}
            onChange={handleChange}
            hidden
          />

          {/* Button */}
          <div className="flex justify-end">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-xl
                         hover:bg-blue-700 focus:ring-4 focus:ring-blue-300
                         dark:focus:ring-blue-800 transition-all shadow-md"
            >
              🚀 Publish Post
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default PostForm;
