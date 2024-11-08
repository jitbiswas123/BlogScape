import jwt from "jsonwebtoken"
import User from "../models/user.model.js"
import errorHandler from "../lib/error.js"
export const userMiddleware=async(req,res,next)=>{
    
    try {
        const token= req.cookies.token
        if(!token){
            return res.status(401).json({success:false,message:"Unauthorized"})
        }
        const payload= jwt.verify(token,"secret")
        const user=await User.findOne({_id:payload.id})
        if(!user){
            return res.status(401).json({success:false,message:"Unauthorized"})
        }
        req.user=user
        next()
    } catch (error) {
        errorHandler("user middleware",error,res)
    }
}