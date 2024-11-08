import { Button, Label, TextInput } from 'flowbite-react';
import React, { useState } from 'react';
import axios from 'axios';
import { FaGoogle } from "react-icons/fa";
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { app } from '../config/firebase';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login } from '../redux/userSlice';
import { toast } from 'react-toastify';

export default function Login() {
    const auth = getAuth(app);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:3000/api/v1/auth/login", formData, {
                withCredentials: true
            });
            if (response.data.success) {
                dispatch(login(response.data.user));
                toast.success("Logged in successfully");
                navigate("/");
            }
        } catch (error) {
            if (error.response) {
                toast.error(error.response.data.message);
            } else {
                toast.error(error.message);
            }
        }
    };

    const clickHandler = async () => {
        const provider = new GoogleAuthProvider();
        try {
            const responseFromGoogle = await signInWithPopup(auth, provider);
            const response = await axios.post("http://localhost:3000/api/v1/auth/google", {
                name: responseFromGoogle.user.displayName,
                email: responseFromGoogle.user.email,
                avatar: responseFromGoogle.user.photoURL
            }, {
                withCredentials: true
            });
            if (response.data.success) {
                dispatch(login(response.data.user));
                toast.success("Logged in successfully");
                navigate("/");
            }
        } catch (error) {
            if (error.response) {
                console.error(error.response.error);
            } else {
                console.error(error);
            }
            toast.error("Login failed");
        }
    };

    return (
        <div className='flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-purple-400 to-blue-500'>
            <div className='bg-white rounded-lg shadow-lg p-8 max-w-sm w-full'>
                <h2 className='text-2xl font-bold text-center mb-6 text-gray-800'>Welcome Back!</h2>
                <form className='flex flex-col gap-4' onSubmit={submitHandler}>
                    <div>
                        <Label className='text-gray-600' htmlFor='email'>Email</Label>
                        <TextInput
                            type='email'
                            name='email'
                            id='email'
                            value={formData.email}
                            onChange={onChange}
                            placeholder='johndoe@gmail.com'
                            required
                            className='mt-1'
                        />
                    </div>
                    <div>
                        <Label className='text-gray-600' htmlFor='password'>Password</Label>
                        <TextInput
                            type='password'
                            name='password'
                            id='password'
                            value={formData.password}
                            onChange={onChange}
                            placeholder='*****'
                            required
                            className='mt-1'
                        />
                    </div>
                    <Button type='submit' className='w-full' gradientDuoTone="purpleToBlue">Login</Button>
                </form>
                <div className='flex items-center justify-between mt-4'>
                    <hr className='flex-grow' />
                    <span className='mx-2 text-gray-500'>or</span>
                    <hr className='flex-grow' />
                </div>
                <Button className='w-full mt-4' onClick={clickHandler} outline>
                    <FaGoogle size={20} className="text-blue-600" /> <span className='ml-2'>Continue with Google</span>
                </Button>
                <p className='text-center text-gray-600 mt-4'>
                    Don't have an account? <a href='/signup' className='text-blue-500 font-semibold'>Sign Up</a>
                </p>
            </div>
        </div>
    );
}
