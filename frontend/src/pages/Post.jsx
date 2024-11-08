import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import CommentSection from '../components/CommentSection';

export default function Post() {
  const location = useLocation();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [postId, setPostId] = useState(null);

  useEffect(() => {
    const query = location.search;
    const url = new URLSearchParams(query);
    setPostId(url.get("postId"));
    async function getPost() {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:3000/api/v1/posts?postId=${url.get("postId")}`);
        setPost(response.data.posts[0]);
      } catch (error) {
        console.error(error);
        setError("Failed to load the post. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    getPost();
  }, [location.search]);

  return (
    <div className="flex flex-col items-center p-4 bg-gradient-to-r from-blue-200 to-purple-200 dark:from-gray-900 dark:to-gray-800 min-h-screen">
      {loading ? (
        <div className="text-lg text-gray-500 dark:text-gray-300 animate-pulse">Loading...</div>
      ) : error ? (
        <div className="text-lg text-red-500 dark:text-red-400">{error}</div>
      ) : (
        post && (
          <div className="bg-gray-600 dark:bg-gray-900 p-6 rounded-lg shadow-lg w-full sm:w-3/4 lg:w-1/2">
            <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">{post.title}</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              Posted by <span className="font-medium">{post.authorName || 'Unknown Author'}</span> on {new Date(post.createdAt).toLocaleDateString()}
            </p>
            <div 
              dangerouslySetInnerHTML={{ __html: post.content }} 
              className="prose lg:prose-xl dark:prose-invert max-w-none mb-8 text-gray-800 dark:text-gray-200 leading-relaxed"
            />
          </div>
        )
      )}
      <div>
        <CommentSection postId={postId} />
      </div>
    </div>
  );
}
