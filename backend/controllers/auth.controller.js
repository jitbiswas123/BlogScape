import User from "../models/user.model.js"
import bcryptjs from "bcryptjs"
import jwt from "jsonwebtoken"
import errorHandler from "../lib/error.js"
import validator from "validator"

export const signup=async(req,res)=>{
    const {name,email,password} = req.body
    if(!name || !email || !password){
        return res.status(400).json({success:false,message:"All fields are required"})
    }
    if(!validator.isEmail(email)){
        return res.status(400).json({success:false,message:"Invalid email"})
    }
    if(!validator.isLength(password,{min:6})){
        return res.status(400).json({success:false,message:"Password should be at least 6 characters long"})
    }
   
    
    try {
        let user = await User.findOne({email})
       console.log(user);
       
        if(user){
            return res.status(409).json({success:false,message: "User already exists"})
        }
        const hashPassword = await bcryptjs.hash(password,10)
        user = new User({name,email,password:hashPassword})
        await user.save()
        user.password = undefined
        const token = jwt.sign({id:user._id},"secret",{
            expiresIn:24*60*60*1000
        })
        res.cookie("token",token,{
            maxAge:24*60*60*1000
        })
        return res.status(201).json({success:true,message:"User created successfully",user:user})
    } catch (error) {
        errorHandler("signup",error,res)
    }
}

export const login = async(req,res)=>{
    try {
        const {email,password} = req.body
        
        const user = await User.findOne({email})
        if(!user){
            return res.status(404).json({success:false,message:"Invalid credentials"})
        }
        const isMatch = await bcryptjs.compare(password,user.password)
        if(!isMatch){
            return res.status(400).json({success:false,message:"Invalid credentials"})
        }
        user.password = undefined
        const token = jwt.sign({id:user._id},"secret",{
            expiresIn:24*60*60*1000
        })
        res.cookie("token",token,{
            maxAge:24*60*60*1000
        })
        return res.status(200).json({success:true,message:"logged in successfully",user})
    } catch (error) {
        errorHandler("login",error,res)
    }
}


export const logout = async(req,res)=>{
    res.cookie("token", "", { expires: new Date(0) });
    return res.status(200).json({success:true,message:"Logged out successfully"})
}

export const google = async(req,res)=>{
    try {
        const {avatar,email,name}=req.body
        console.log(req.body);
        
        let user= await User.findOne({email})
        console.log(user);
        
        if(user){
            const token = jwt.sign({id:user._id},"secret")
            res.cookie("token",token)
            user.name=name
            user.avatar=avatar
            await user.save()
            user.password = undefined
            user.posts=undefined
            return res.status(201).json({success:true,message:"loggin successfully",user})
        }
        
        const password = Math.random().toString(36).slice(-8)
        const hashPassword = await bcryptjs.hash(password,10)
        user=new User({
            name,
            email,
            password:hashPassword,
            avatar
        });
        
        await user.save()
        user.password = undefined
        user.posts=undefined
        const token = jwt.sign({id:user._id},"secret",{
            expiresIn:24*60*60*1000
        })
        res.cookie("token",token,{
            maxAge:24*60*60*1000
        })
        return res.status(201).json({success:true,message:"User created successfully",user})
    } catch (error) {
       errorHandler("google",error,res)
    }
}