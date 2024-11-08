import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {useDispatch, useSelector} from "react-redux"
import { Table } from 'flowbite-react';
import { Link, useNavigate } from 'react-router-dom';
import {toast} from "react-toastify"
import { login } from '../redux/userSlice';

export default function Blog() {
    const [posts, setPosts] = useState(null);
    const {user}=useSelector(state=>state.user)
    const dispatch=useDispatch()
    const navigate=useNavigate()
    async function getPosts() {
        try {
            const response = await axios.get(`http://localhost:3000/api/v1/posts?userId=${user._id}`, {
                withCredentials: true,
            });
            setPosts(response.data.posts);
        } catch (error) {
            if(error.response && error.response.data.message==="Unauthorized") {
                toast.error("login first")
                navigate("/login")
                dispatch(login(null))
                return
            }
            console.error("Failed to fetch posts", error);
        }
    }

    useEffect(() => {
        getPosts();
    }, []);

    async function deleteHandler(post) {
        if(!post){
            return
        }
        try {
            const response= await axios.delete(`http://localhost:3000/api/v1/posts/${post._id}`,{
                withCredentials:true
            })
            toast.success("Post deleted successfully!")
            setPosts((prev) => prev.filter((p) => p._id!== post._id));
        } catch (error) {
            if(error.response && error.response.data.message==="Unauthorized") {
                toast.error("login first")
                dispatch(login(null))
                navigate("/login")
                return
            }
            toast.error(error.message)
        }
    }
    

    return (
        <div className='container mx-auto p-8 bg-gray-900 rounded-lg shadow-lg mt-4'>
            <h1 className='text-4xl font-semibold text-center mb-4 text-white'>
                Blog Posts
            </h1>
            {
                posts ? (
                    <div className='overflow-x-scroll scrollbar w-full min-h-screen'>
                        <Table hoverable className='w-full text-white h-full'>
                            <Table.Head className='bg-gray-800'>
                                <Table.HeadCell className='px-6 py-4'>Updated At</Table.HeadCell>
                                <Table.HeadCell className='px-6 py-4'>Created At</Table.HeadCell>
                                <Table.HeadCell className='px-6 py-4'>Title</Table.HeadCell>
                                <Table.HeadCell className='px-6 py-4'>Title Image</Table.HeadCell>
                                <Table.HeadCell className='px-6 py-4'>Delete</Table.HeadCell>
                            </Table.Head>
                            <Table.Body className='bg-gray-800 divide-y divide-gray-700'>
                                {posts.map((post) => (
                                    <Table.Row key={post._id} className='hover:bg-gray-700 transition'>
                                        <Table.Cell className='px-6 py-4'>{new Date(post.updatedAt).toLocaleString()}</Table.Cell>
                                        <Table.Cell className='px-6 py-4'>{new Date(post.createdAt).toLocaleString()}</Table.Cell>
                                        <Table.Cell className='px-6 py-4 font-medium text-teal-400'>{post.title}</Table.Cell>
                                        <Table.Cell className='px-6 py-4'>
                                        <Link to={`/post/?postId=${post._id}`}>
                                            <img
                                                src={post.titleImage}
                                                alt="title"
                                                className='w-40 h-24 object-cover rounded-lg shadow-md transition-transform duration-300 hover:scale-105 hover:shadow-xl'
                                                style={{ minWidth: '150px' }} // Ensures a minimum width
                                            />
                                    </Link>
                                </Table.Cell>
                                        <Table.Cell className='px-6 py-4'>
                                            <button className='text-red-500 hover:text-red-400 hover:underline' onClick={()=>deleteHandler(post)}>
                                                Delete
                                            </button>
                                        </Table.Cell>
                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table>
                    </div>
                ) : (
                    <p className='text-center text-lg mt-4 text-gray-400'>
                        No posts found. Please check back later.
                    </p>
                )
            }
        </div>
    );
}
