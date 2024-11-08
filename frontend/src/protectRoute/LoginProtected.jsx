import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'
import Dashboard from '../pages/Dashboard'
export default function LoginProtected() {
    const{ user }= useSelector(state => state.user)
    console.log(user);
    
  return (
    !user?<Outlet/>:<Navigate to="/dashboard?tab=profile" />
  )
}
