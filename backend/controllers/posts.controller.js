import cloudinary from "../config/cloudinary.config.js";
import errorHandler from "../lib/error.js"
import tempDeleteFromCloudinary from "../lib/tempDeleteFromCloudinary.js";
import Post from "../models/post.model.js";
import Comment from "../models/comment.model.js";
import jwt from "jsonwebtoken"
import User from "../models/user.model.js";
import mongoose from "mongoose";


export const createPost=async(req,res)=>{
    try {
        const {title,content,category,urls}=req.body
        const image=req.file
        const urlObject=JSON.parse(urls)
        
        // Array to hold promises for renaming
            const post = new Post({
                title,
                content,
                titleImage:image.path,
                authorName:req.user.name,
                authorDp:req.user.url,
                category,
                author: req.user._id,
            })
        const renamePromises = urlObject.map(async (obj) => {
            try {
                const filename = obj.public_id.split("/").pop();
                const newPublicId = `content_image/${filename}`;
                post.contentImage.push({url:obj.url, public_id:obj.publicId});
                // Rename the image
                await cloudinary.uploader.rename(obj.public_id, newPublicId);
            } catch (error) {
                console.error('Error renaming asset:', error);
                throw error; // Rethrow to handle in the outer try-catch
            }
        });
        await Promise.all(renamePromises);
        tempDeleteFromCloudinary()
        await post.save()
        res.json({success:true, message:"Post created successfully",post})
    } catch (error) {
        errorHandler("createPost", error,res)
    }
}


export const getPost=async(req,res,next)=>{
    try {
        
        const startIndex=parseInt(req.query.startIndex) || 0
        const limit=parseInt(req.query.limit) || 9

        const order= req.query.order==="asc" ? 1 : -1
        const postId=req.query.postId
        const userId= req.query.userId
        if(postId && !mongoose.Types.ObjectId.isValid(postId)){
            return res.status(400).json({success:false,message:"Invalid postId"})
        }
        if(userId && !mongoose.Types.ObjectId.isValid(userId)){
            return res.status(400).json({success:false,message:"Invalid userId"})
        }
      const posts = await Post.find({
      ...(req.query.category && { category: req.query.category }),
      ...(req.query.title && { title: req.query.title }),
      ...(req.query.postId && { _id: req.query.postId }),
      ...(req.query.userId && { author: req.query.userId }),
      ...(req.query.search && {
        $or: [
          { title: { $regex: req.query.search, $options: 'i' } },
          { content: { $regex: req.query.search, $options: 'i' } },
        ],
      }),
    }).sort({updatedAt:order}).skip(startIndex).limit(limit)
    let user
    const token= req.cookies.token
        if(token){
            const payload= jwt.verify(token,"secret")
             user=await User.findOne({_id:payload.id})
        }
        
    if(postId && userId) {
        if(!user)
            return res.status(401).json({success:false,message:"unauthorized access"})
    }
    return res.json({posts})
    } catch (error) {
        console.log(error);
        
        errorHandler("getPost", error,res)
    }
}


export const comment=async(req,res)=>{
    try{
        
        const post=await Post.findOne({_id:req.params.postId})
        if(!post){
            return res.status(404).json({success:false,message:"Post not found"})
        }
        const {comment}=req.body
        const user=req.user
        
        const commentObject= new Comment({
            comment,
            post:post._id,
            user:{id:user._id,name:user.name,image:user.url}
        })
        await commentObject.save()
        return res.status(201).json({success:true,message:"comment succesfully",comment:commentObject})
    }
    catch(error){
        errorHandler("comment",error,res)
    }
}

export const like=async(req,res)=>{
    try{
        
        const comment=await Comment.findById(req.params.commentId)
        console.log(comment);
        
        if(!comment){
            return   res.status(404).json({success:false,message:"comment not found"})
        }
        const user=req.user._id
        const index=comment.likes.Array.indexOf(user)
        let isLike=false
        if(index==-1){
            comment.likes.Array.push(user)
            isLike=true
            comment.likeCount+=1
        }
        else{
            comment.likes.Array.splice(index,1)
            comment.likeCount-=1
        }
        await comment.save()
        const str=isLike?"Liked":"Disliked"
        return res.status(200).json({success:true,message:`${str} succesfully`,comment})
    }
    catch(error){
        errorHandler("Like",error,res)
    }
}

export const getComments=async(req,res)=>{
    const postId=req.params.postId
    console.log(postId);
    
    try{
        const post =await Post.findOne({_id:postId.trim()})
        if(!post){
            return res.status(404).json({success:false,message:"Post not found"})
        }
        const comments= await Comment.find({post:post._id})
        return res.status(200).json({success:true,comments})
    }
    catch(error){
        errorHandler("Getting comments",error,res)
    }
}

export const deleteComment =async(req,res)=>{
    try {
        const commentId=req.params.commentId
        console.log(commentId);
        const comment=await Comment.findOne({_id:commentId})
        
        if(!comment){
            return res.status(404).json({success:false,message:"Comment not found"})
        }
        
        if(comment.user.id!=req.user._id){
            return res.status(403).json({success:false,message:"Unauthorized"})
        }
        await Comment.findByIdAndDelete(commentId)
        return res.status(200).json({success:true,message:"Comment deleted successfully"})
    } catch (error) {
        errorHandler("Deleting comment",error,res)
    }
}


export const deletePost=async(req,res)=>{
    try {
        const post= await Post.findOneAndDelete({_id:req.params.postId,author:req.user._id})
    if(!post){
        return res.status(404).json({success:false,message:"Post not found"});
    }
        return res.status(200).json({success:true,message:"post deleted successfully"})
    } catch (error) {
        errorHandler("Deleting post",error,res)
    }
}


export const updatePost=async(req,res)=>{
    try {
        const {title,category,content,urls}=req.body
        const image=req.file

        return res.status(200).json({success:true,message:"post updated successfully",post})
    } catch (error) {
        errorHandler("Updating post",error,res)
    }
}

