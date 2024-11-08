import express from 'express';
import { update } from '../controllers/user.controller.js';
import { upload } from '../config/cloudinary.config.js';


const router=express.Router();

router.patch("/update",upload.single('image'),update)
router.delete("/delete",)


export default router