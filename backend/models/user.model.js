import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    url:{
             type: String,
        default:'https://th.bing.com/th/id/OIP.hGSCbXlcOjL_9mmzerqAbQHaHa?w=2048&h=2048&rs=1&pid=ImgDetMain'
        },
        publicId:{
                type:String
        },
},{timestamps:true})

const User = mongoose.model('User', userSchema);

export default User;