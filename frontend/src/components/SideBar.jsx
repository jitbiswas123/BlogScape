import axios from 'axios'
import { Sidebar } from 'flowbite-react'
import React, { useEffect, useState } from 'react'
import { FaBlog, FaHome } from 'react-icons/fa'
import { FaPersonRifle, FaUser } from 'react-icons/fa6'
import { LuLogOut } from 'react-icons/lu'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { login } from '../redux/userSlice'
import { useLocation, useNavigate } from 'react-router-dom'

export default function SideBar() {
    const [tab,setTab]=useState()
  const location = useLocation()
    useEffect(()=>{
        const query = location.search
        const newTab= new URLSearchParams(query)
        setTab(newTab.get('tab'))
    },[location.search])
    const dispatch = useDispatch();
    const  navigate  = useNavigate();
    async function logout()  {
        try {
            const response = await axios.get("http://localhost:3000/api/v1/auth/logout",{
                withCredentials: true
            })
            if(response.data.success){
                dispatch(login(null))
                toast.success("logged out successfully")
                navigate("/login")
            }
        } catch (error) {
            if(error.response)
                console.log(error.response.error);
            else
                console.log(error);
            toast.error("Failed to logout")
            
        }
    }
  return (
 
        <Sidebar className='w-full'>
            <Sidebar.Items>
                <Sidebar.ItemGroup>
                <Sidebar.Item href="/" icon={FaHome}>
                    Home
                </Sidebar.Item>
                <Sidebar.Item active={tab==="profile"} href="/dashboard?tab=profile" icon={FaUser}>
                    Profile
                </Sidebar.Item>
                <Sidebar.Item active={tab==="blog"} href="/dashboard?tab=blog" icon={FaBlog}>
                    Blog
                </Sidebar.Item>
                <Sidebar.Item   icon={LuLogOut} className="cursor-pointer"  onClick={logout}>
                    Logout
                </Sidebar.Item>
                </Sidebar.ItemGroup>
            </Sidebar.Items>
        </Sidebar>
  )
}
