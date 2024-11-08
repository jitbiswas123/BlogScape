import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import { FaUserCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Avatar } from 'flowbite-react';

// Enhanced PostCard component
function PostCard({ post }) {
  const navigate=useNavigate()
  return (
    <div onClick={()=>navigate(`/post/?postId=${post._id}`)} className="bg-white dark:bg-gray-900  cursor-pointer rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105 hover:shadow-2xl mb-8">
      <div className="relative">
        <img src={post.titleImage} alt={post.title} className="w-full h-56 object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-70"></div>
        <div className="absolute bottom-4 left-4 text-white text-sm font-semibold">{post.category}</div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">{post.title}</h3>
        {/* <p className="text-gray-700 dark:text-gray-400 mt-2">{post.content}</p> */}
        <div className="flex items-center mt-4 gap-2 text-sm text-gray-500 dark:text-gray-400">
          <Avatar
          img={post.authorDp}
          rounded={true}
          />
          <span>Posted by {post.authorName}</span>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [posts, setPosts] = useState([]);

  // Example posts data with images
  useEffect(() => {
    async function getPosts(){
      try {
        const response= await axios.get("http://localhost:3000/api/v1/posts")
        setPosts((pre)=>response.data.posts)
        
      } catch (error) {
          toast.error(error.message)
      }
    }
      getPosts()
  }, []);
  console.log(posts);
  
  return (
    <div>
      <Header />

      {/* Hero Section */}
      <section
        className="relative bg-cover bg-center h-[75vh] flex flex-col justify-center items-center text-center"
        style={{ backgroundImage: "url('https://source.unsplash.com/random/1600x900?inspiration')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-transparent to-gray-900 opacity-80"></div>
        <div className="relative z-10 text-white px-6 max-w-2xl mx-auto">
          <h1 className="text-5xl text-gray-800 dark:text-gray-300 sm:text-6xl font-extrabold mb-4 tracking-wider leading-tight">
            Welcome to Our Inspiring Blog
          </h1>
          <p className="text-lg sm:text-xl text-gray-800 dark:text-gray-300 mb-8">
            Discover unique stories, insights, and tips from our vibrant community.
          </p>
        </div>
      </section>

      {/* Posts Section */}
      <section className="max-w-7xl mx-auto py-16 px-6">
        <h2 className="text-4xl font-bold text-gray-800 dark:text-gray-200 mb-12 text-center">Latest Posts</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {posts.length > 0 ? (
            posts.map((post) => <PostCard key={post._id}  post={post} />)
          ) : (
            <p className="text-gray-600 dark:text-gray-400 text-center">No posts available.</p>
          )}
        </div>
      </section>
    </div>
  );
}
