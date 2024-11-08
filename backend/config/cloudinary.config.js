import {v2 as cloudinary} from "cloudinary"
import dotenv from "dotenv"
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
dotenv.config()
cloudinary.config({
        cloud_name: process.env.CLOUD_NAME,
        api_key: process.env.CLOUD_API_KEY, 
        api_secret: process.env.CLOUD_API_SECRET
})
export default cloudinary
const storage1 = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'profile_pictures', // Cloudinary folder name
      allowed_formats: ['jpg', 'png', 'jpeg'],
    },
  });
const storage2 = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'temp_images', // Cloudinary folder name
      allowed_formats: ['jpg', 'png', 'jpeg','webp','gif'],
    },
  });
const storage3 = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'content_image', // Cloudinary folder name
      allowed_formats: ['jpg', 'png', 'jpeg'],
    },
  });
const storage4 = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'title_image', // Cloudinary folder name
      allowed_formats: ['jpg', 'png', 'jpeg','webp'],
    },
  });

export  const upload = multer({ storage:storage1});
export  const contentImageUpload = multer({ storage:storage3});
export  const tempImageUpload = multer({ storage:storage2});
export  const titleImageUpload = multer({ storage:storage4});
