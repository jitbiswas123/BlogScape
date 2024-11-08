import React from 'react'
import { useSelector } from 'react-redux'
import { Outlet ,Navigate} from 'react-router-dom'
import Login from '../pages/Login'

export default function Protected() {
    const {user}=useSelector(state=>state.user)
  return (
    user?<Outlet/>:<Navigate to="/login" />
  )
}
