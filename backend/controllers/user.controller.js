import errorHandler from "../lib/error.js"
import bcryptjs from "bcryptjs"
import cloudinary from "../config/cloudinary.config.js"
// Configure multer for file uploads

export const update =async(req,res)=>{
    try {
        const {name,email,password}=req.body
        const image= req.file
        
        const user=req.user
        if(name)user.name=name
        if(email)user.email=email
        if(password){
            const hashPassword=await bcryptjs.hash(password,10)
            user.password=hashPassword
        }
        
        if(image){
           user.url=image.path
           if(user.publicId){
                await cloudinary.uploader.destroy(user.publicId)
           }
            user.publicId=image.filename
        }

       await user.save()
       user.password=undefined
       return res.status(200).json({success:true,message:"updated successfully",user})
    } catch (error) {
        errorHandler("update",error,res)
    }
}