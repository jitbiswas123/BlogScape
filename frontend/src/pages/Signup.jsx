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
import validator from 'validator';

export default function Login() {
    const auth = getAuth(app);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: ''
    });

    function onChange(e) {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    async function submitHandler(e) {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.password) {
            toast.warn("All fields are required");
            return;
        }
        if (!validator.isEmail(formData.email)) {
            toast.warn("Invalid email address");
            return;
        }
        if (!validator.isLength(formData.password, { min: 6 })) {
            toast.warn("Password should be at least 6 characters long");
            return;
        }
        try {
            const response = await axios.post("http://localhost:3000/api/v1/auth/signup", formData, {
                withCredentials: true
            });
            if (response.data.success) {
                dispatch(login(response.data.user));
                toast.success("Account created successfully");
                navigate("/");
            }
        } catch (error) {
            if (error.response) {
                toast.error(error.response.data.message);
            } else {
                toast.error(error.message);
            }
        }
    }

    async function clickHandler() {
        const provider = new GoogleAuthProvider();
        provider.getCustomParameters({ prompt: 'select_account' });

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
    }

    return (
        <div className='flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-indigo-500 to-purple-500 p-4'>
            <div className='bg-white rounded-xl shadow-xl p-8 w-full sm:max-w-md'>
                <h2 className='text-3xl font-bold text-center mb-6 text-indigo-700'>Welcome to Blog Scape</h2>
                <form className='flex flex-col gap-4' onSubmit={submitHandler}>
                    <div>
                        <Label htmlFor='name' className='text-gray-600'>Name</Label>
                        <TextInput
                            type='text'
                            name='name'
                            value={formData.name}
                            onChange={onChange}
                            placeholder='Your Name'
                            required
                            className='mt-1'
                        />
                    </div>
                    <div>
                        <Label htmlFor='email' className='text-gray-600'>Email</Label>
                        <TextInput
                            type='email'
                            name='email'
                            value={formData.email}
                            onChange={onChange}
                            placeholder='johndoe@gmail.com'
                            required
                            className='mt-1'
                        />
                    </div>
                    <div>
                        <Label htmlFor='password' className='text-gray-600'>Password</Label>
                        <TextInput
                            type='password'
                            name='password'
                            value={formData.password}
                            onChange={onChange}
                            placeholder='******'
                            required
                            className='mt-1'
                        />
                    </div>
                    <Button type='submit' className='w-full' gradientDuoTone="purpleToBlue">
                        Register
                    </Button>
                </form>
                <div className='flex items-center justify-center my-4'>
                    <hr className='flex-grow border-gray-300' />
                    <span className='px-2 text-gray-500'>or</span>
                    <hr className='flex-grow border-gray-300' />
                </div>
                <Button className='w-full' onClick={clickHandler} outline>
                    <FaGoogle size={20} className="text-red-500" /> <span className='ml-2'>Continue with Google</span>
                </Button>
                <p className='text-center text-gray-500 mt-4'>
                    Already have an account? <a href='/login' className='text-indigo-600 font-semibold'>Login</a>
                </p>
            </div>
        </div>
    );
}
