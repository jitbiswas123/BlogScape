import React from 'react'
import { Route, Routes } from 'react-router-dom'
import LoginProtected from './protectRoute/LoginProtected'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Protected from './protectRoute/Protected'
import Dashboard from './pages/Dashboard'
import NotFound from './pages/NotFound'
import Home from './pages/Home'
import Header from './components/Header'
import CreatePost from './pages/CreatePost'
import Post from './pages/Post'

export default function App() {
  return (
    <Routes>
        <Route path='/' element={<Home/>}></Route>
        <Route path='/post' element={<Post/>}></Route>
        <Route element={<LoginProtected/>}>
        <Route path='/login' element={<Login/>} ></Route>
        <Route path='/signup' element={<Signup/>} ></Route>
        </Route>
        <Route element={<Protected/>}>
        <Route path='/dashboard' element={<Dashboard/>} ></Route>
        <Route path='create-post' element={<CreatePost/>}></Route>
        </Route>
        <Route path='*' element={<NotFound/>}></Route>
        
      
    </Routes>
  )
}
