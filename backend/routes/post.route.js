import express from 'express'
import { tempImageUpload, titleImageUpload, upload } from '../config/cloudinary.config.js';
import { userMiddleware } from '../middleware/user.middleware.js';
import { createPost,getPost,comment,like,getComments,deleteComment,deletePost} from '../controllers/posts.controller.js';
const router=express.Router()

// router.post("/create-post",createPost)
router.post("/upload",userMiddleware,tempImageUpload.single('image'),async(req,res)=>{
    const image=req.file
    res.json({image});
})

router.get("/",getPost)
router.post("/create",userMiddleware,titleImageUpload.single('image'),createPost)
router.post("/comment/:postId",userMiddleware,comment)
router.put("/comment/like/:commentId",userMiddleware,like)
router.get("/comments/:postId",getComments)
router.delete("/comment/:commentId",userMiddleware,deleteComment)
router.delete("/:postId",userMiddleware,deletePost)

export default router