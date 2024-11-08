import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import connetToDb from './config/db.config.js'
import cors from 'cors'
import authRoute from "./routes/auth.route.js"
import userRoutes from "./routes/user.route.js"
import postRouts from "./routes/post.route.js"
import { userMiddleware } from './middleware/user.middleware.js'
dotenv.config()
const corsOptions = {
    origin: 'http://localhost:5173', // Set your frontend's URL
    credentials: true,               // Allow credentials (cookies, headers)
  };
const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended:true}))
app.use(cors(corsOptions))

app.use('/api/v1/auth',authRoute)
app.use("/api/v1/user",userMiddleware,userRoutes)
app.use("/api/v1/posts",postRouts)

const PORT=process.env.PORT || 3000
app.listen(PORT,()=>{
    console.log("listening on port",PORT);
    connetToDb()
})