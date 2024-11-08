import mongoose  from "mongoose";


const commnentShcema = new mongoose.Schema({
    comment:{type:String,required:true},
    post:{type:String,required:true},
    user:{
        id:{type:String,required:true},
        name:{type:String,required:true},
        image:{type:String,required:true},
    },
    likes:{Array,default:[]},
    likeCount:{type:Number,default:0}
},{timestamps:true})


const Comment=mongoose.model("Comment",commnentShcema)

export default Comment