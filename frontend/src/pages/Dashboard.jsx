import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import SideBar from '../components/SideBar'
import Profile from '../components/Profile'
import Blog from '../components/Blog'

export default function Dashboard() {
  const [tab,setTab]=useState()
  const location = useLocation()
  useEffect(()=>{
    const query = location.search
    const newTab= new URLSearchParams(query)
    setTab(newTab.get('tab'))
  },[location.search])
  return (
    <div className='flex flex-col sm:flex-row gap-2  min-h-screen '>
     <div className='w-full sm:w-[20%] mt-4'>
     <SideBar/>
     </div>
     <div className='flex-1 '>
        {tab==="profile" && <Profile/>}
        {tab==="blog" && <Blog/>}
     </div>
    </div>
  )
}
