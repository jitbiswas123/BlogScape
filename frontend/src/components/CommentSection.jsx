import axios from 'axios';
import { Textarea, Button, Avatar } from 'flowbite-react';
import React, { useEffect, useState } from 'react';
import { FaEdit, FaReply, FaThumbsUp } from 'react-icons/fa';
import moment from "moment"
import { MdDelete } from "react-icons/md";
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { login } from '../redux/userSlice';

export default function CommentSection({postId}) {
  const { user } = useSelector((state) => state.user);
  const navigate=useNavigate()
  const dispatch=useDispatch()
  const [comment, setComment] = useState("");
  const [allComments,setAllComments]=useState([])
  async function onClick(){
        try {
            const response=await axios.post(`http://localhost:3000/api/v1/posts/comment/${postId}`,{comment},{
                withCredentials: true
            })
            
            setComment('');
            toast.success("Comment posted successfully")
            setAllComments((pre)=>[response.data.comment,...pre])
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

  async function deleteHandler(commentId){
      try {
          const response = await axios.delete(`http://localhost:3000/api/v1/posts/comment/${commentId}`,{
            withCredentials:true
          })
          toast.success("Comment deleted successfully")
          setAllComments((pre)=>{
            return pre.filter(c=>c._id!==commentId)
          })
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

  async function likeHandler(comment){
      try {
          if(!comment)return
          const response = await axios.put(`http://localhost:3000/api/v1/posts/comment/like/${comment._id}`,{},{
            withCredentials:true
          })
          toast.success(response.data.message);
          const index=allComments.indexOf(comment)
          allComments[index]=response.data.comment
          setAllComments([...allComments])
      } catch (error) {
        if(error.response && error.response.data.message==="Unauthorized") {
          toast.error("login first")
          navigate("/login")
          dispatch(login(null))
          return
      }
          toast.error(error.message)
      }
  }
  
    useEffect(()=>{
        async function getAllComments() {
            try {
                if(!postId)return;
                const response=await axios.get(`http://localhost:3000/api/v1/posts/comments/${postId}`,{
                    withCredentials: true
                })
                if(response.data.comments)
                    setAllComments(response.data.comments)
                console.log(response.data);
                
            } catch (error) {
                toast.error(error.message)
            }
        }
        getAllComments()
    },[postId])    
  return (
    <div className="max-w-2xl mx-auto mt-8 px-4">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6">Comments {`(${allComments.length})`}</h2>

      {user ? (
        <div className="flex items-start space-x-4 mb-6">
          {/* Avatar */}
          <Avatar
            img={user.url}
            rounded={true}
            alt="User profile"
          />

          {/* Comment Input */}
          <div className="flex-1 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md p-3">
            <Textarea
              placeholder="Add a public comment..."
              rows={2}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full resize-none bg-transparent border-none focus:ring-0 placeholder-gray-500 dark:placeholder-gray-400 text-sm text-gray-900 dark:text-gray-100"
            />

            {/* Submit Button */}
            {comment && (
              <div className="flex justify-end mt-2">
                <Button
                  type="button"
                  onClick={onClick}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white text-sm font-semibold px-4 py-1 rounded-full transition-all duration-300"
                >
                  Comment
                </Button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <p className="text-gray-500 dark:text-gray-400 text-center">
          Please log in to post a comment.
          <a href="/login" className= "ml-3 text-blue-500 font-semibold">
            Login
          </a>
        </p>
      )}

       {/* Comments List */}
       { 
        allComments.length > 0 ?
        (<div className="space-y-4 mt-6  sm:w-96">
            {
                allComments.map((comment)=>{
                    return (
                        <div key={comment._id} className="flex flex-col p-4 rounded-lg shadow-md bg-gray-50 dark:bg-gray-800">
              <div className="flex items-start space-x-3">
                <Avatar img={comment.user.image} rounded={true} alt="User" />
                <div className="flex-1">
                  <div className='flex justify-between'>
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{comment.user.name}</p>
                  <p className='text-sm'>{moment(comment.createdAt).fromNow()}</p>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                   {comment.comment}
                  </p>
                </div>
              </div>
              
              {/* Actions: Like, Edit, Reply */}
              <div className="flex space-x-4 mt-2 text-gray-600 dark:text-gray-400 text-sm">
                <div className='flex gap-1' > <span className='mt-1 text-sm font-sans'>{comment.likeCount}</span>
                        <div className={`flex items-center ${user && comment.likes.Array.includes(user._id) ?"text-blue-500":""} space-x-1 hover:text-blue-500 transition duration-200  cursor-pointer`}
                          onClick={()=>likeHandler(comment)}
                        ><FaThumbsUp /><span>Like</span></div>
                 </div>
                 
                {
                    user && comment.user.id===user._id &&
                        <button className="flex items-center space-x-1 hover:text-red-500 transition duration-200" onClick={()=>deleteHandler(comment._id)}>
                        <MdDelete />
                        <span>Delete</span>
                        </button>
                }
                
              </div>
            </div>
                    )
                })
            }
          </div>):
          <p className="text-gray-500 dark:text-gray-400 text-center">No comments yet.</p>
       }
    </div>
  );
}
