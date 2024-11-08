import mongoose from "mongoose"

const PostSchema= new mongoose.Schema({
    title:{type:String, required:true},
    content:{type:String, required:true},
    author:{type:mongoose.Schema.Types.ObjectId, ref:'User', required:true},
    titleImage:{type:String, required:true},
    category:{type:String, required:true},
    authorName:{type:String, required:true},
    authorDp:{type:String,required:true},
    contentImage:[{
        url:{type:String},
        publicId:{type:String}
    }],
},{timestamps:true})
PostSchema.path('contentImage').default(() => []);
const Post =mongoose.model('Post',PostSchema)

export default Post;