'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { Image as ImageIcon, Link as LinkIcon, Plus, Send, Tag, X } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const PostForm = () => {
  const [state, setState] = useState({
    title: '',
    content: '',
    slug: '',
    published: false,
    thumbnail: '',
    tags: [] as string[],
    imageUrls: [] as string[],
    authorId: '',
  });

  const [tagInput, setTagInput] = useState('');
  const [imageUrlInput, setImageUrlInput] = useState('');

  const session = useSession();

  const router = useRouter();

  useEffect(() => {
    const user = session.data?.user;

    if (user && user.id) {
      setState((prev) => ({ ...prev, authorId: user.id }));
    }
  }, []);

  const slugify = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setState((prev) => ({
      ...prev,
      title,
      slug: slugify(title),
    }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setState((prev) => ({ ...prev, [name]: value }));
  };

  const handleTogglePublished = () => {
    setState((prev) => ({ ...prev, published: !prev.published }));
  };

  const addTag = () => {
    if (tagInput.trim() && !state.tags.includes(tagInput.trim())) {
      setState((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setState((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const addImageUrl = () => {
    if (imageUrlInput.trim() && !state.imageUrls.includes(imageUrlInput.trim())) {
      setState((prev) => ({
        ...prev,
        imageUrls: [...prev.imageUrls, imageUrlInput.trim()],
      }));
      setImageUrlInput('');
    }
  };

  const removeImageUrl = (urlToRemove: string) => {
    setState((prev) => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((url) => url !== urlToRemove),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!state.authorId) {
      toast.error('You must be logged in to create a post');
      return;
    }

    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    if (!slugRegex.test(state.slug)) {
      toast.error('Slug can only contain lowercase letters, numbers, and hyphens');
      return;
    }

    const res = await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(state),
    });

    const data = await res.json();

    if (data.code !== 201) {
      toast.error(`Error: ${data.error || 'Could not create post'}`);
      return;
    }

    toast.success('Post created successfully!');
    router.push('/posts');
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <form onSubmit={handleSubmit}>
          <Card className="border-none shadow-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-md">
            <CardHeader className="space-y-1">
              <CardTitle className="text-3xl font-bold tracking-tight text-center">
                ✍️ Create New Post
              </CardTitle>
              <CardDescription className="text-center text-lg">
                Share your thoughts and ideas with the world.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Title & Slug */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    Title
                  </label>
                  <Input
                    placeholder="Enter a catchy title..."
                    value={state.title}
                    onChange={handleTitleChange}
                    required
                    className="h-12 text-lg rounded-xl border-gray-200 dark:border-gray-700 focus:ring-blue-500/20"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    Slug
                  </label>
                  <Input
                    placeholder="post-slug"
                    value={state.slug}
                    onChange={(e) => setState(prev => ({ ...prev, slug: e.target.value }))}
                    required
                    className="h-12 font-mono text-sm bg-gray-50/50 dark:bg-gray-800/20 rounded-xl border-gray-200 dark:border-gray-700"
                  />
                </div>
              </div>

              {/* Content */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Content</label>
                <textarea
                  name="content"
                  placeholder="Write your story here..."
                  value={state.content}
                  onChange={handleChange}
                  required
                  rows={10}
                  className="w-full p-4 rounded-xl border border-input bg-transparent text-base shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 focus-visible:border-blue-500 transition-all disabled:cursor-not-allowed disabled:opacity-50 min-h-[200px] dark:bg-gray-800/30"
                />
              </div>

              {/* Thumbnail & Published */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-blue-500" /> Thumbnail URL
                  </label>
                  <Input
                    name="thumbnail"
                    placeholder="https://example.com/image.jpg"
                    value={state.thumbnail}
                    onChange={handleChange}
                    className="h-11 rounded-xl"
                    type='url'
                  />
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl border bg-gray-50/50 dark:bg-gray-800/30 border-gray-200 dark:border-gray-700">
                  <div className="space-y-0.5">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Published</label>
                    <p className="text-xs text-muted-foreground">
                      Make this post visible to everyone.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={state.published}
                    onChange={handleTogglePublished}
                    className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                </div>
              </div>

              {/* Tags */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <Tag className="w-4 h-4 text-blue-500" /> Tags
                </label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a tag (press Enter)..."
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    className="h-11 rounded-xl"

                  />
                  <Button type="button" onClick={addTag} variant="secondary" className="h-11 px-6 rounded-xl">
                    <Plus className="w-4 h-4 mr-2" /> Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 min-h-10 p-3 rounded-xl bg-gray-50/50 dark:bg-gray-800/30 border border-dashed border-gray-300 dark:border-gray-700">
                  {state.tags.length === 0 && (
                    <span className="text-sm text-muted-foreground italic px-2">No tags added yet...</span>
                  )}
                  {state.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider border border-blue-100 dark:border-blue-900/50"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="hover:text-blue-800 dark:hover:text-blue-200 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Additional Images */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <LinkIcon className="w-4 h-4 text-blue-500" /> Additional Image URLs
                </label>
                <div className="flex gap-2">
                  <Input
                    placeholder="https://example.com/another-image.jpg"
                    value={imageUrlInput}
                    onChange={(e) => setImageUrlInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addImageUrl())}
                    className="h-11 rounded-xl"
                    type='url'
                  />
                  <Button type="button" onClick={addImageUrl} variant="secondary" className="h-11 px-6 rounded-xl">
                    <Plus className="w-4 h-4 mr-2" /> Add
                  </Button>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {state.imageUrls.map((url) => (
                    <div
                      key={url}
                      className="flex items-center justify-between p-3 rounded-xl border bg-white dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 shadow-sm"
                    >
                      <span className="text-sm truncate max-w-[85%] font-mono text-gray-600 dark:text-gray-400">{url}</span>
                      <button
                        type="button"
                        onClick={() => removeImageUrl(url)}
                        className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="h-12 px-8"
              >
                Cancel
              </Button>
              <Button type="submit" className="h-12 px-10 bg-blue-600 hover:bg-blue-700 text-white">
                <Send className="w-4 h-4 mr-2" /> Publish Post
              </Button>
            </CardFooter>
          </Card>
        </form>
      </motion.div>
    </div>
  );
};

export default PostForm;
