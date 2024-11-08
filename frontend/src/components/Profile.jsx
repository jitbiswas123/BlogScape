import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, TextInput } from 'flowbite-react';
import axios from 'axios';
import { login } from '../redux/userSlice';
import { toast } from 'react-toastify';

export default function Profile() {
  const { user } = useSelector(state => state.user);
  const [email, setEmail] = useState(user.email);
  const [url, setUrl] = useState(user.url);
  const [name, setName] = useState(user.name);
  const [image, setImage] = useState(null);
  const imagePicker = useRef();
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();

  function urlCreater(e) {
    setImage(e.target.files[0]);
    setUrl(URL.createObjectURL(e.target.files[0]));
  }

  async function submitHandler(e) {
    e.preventDefault();
    try {
      if (password && password.length < 6) {
        toast.error("Password should be at least 6 characters long");
        return;
      }

      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      if (password) formData.append("password", password);
      if (image) formData.append("image", image);

      const response = await axios.patch("http://localhost:3000/api/v1/user/update", formData, {
        withCredentials: true,
      });

      if (response.data.success) {
        toast.success("Profile updated successfully");
        dispatch(login(response.data.user));
      }
    } catch (error) {
      if (error.response && error.response.data.message === "Unauthorized") {
        dispatch(login(null));
        toast.error(error.response.data.message);
      } else if (error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error(error.message);
      }
    }
  }

  return (
    <div className='w-full flex flex-col justify-center items-center p-6 rounded-xl mt-4 transition-colors duration-300  dark:bg-gray-800'>
      <input
        type="file"
        accept='image/*'
        ref={imagePicker}
        className='hidden'
        onChange={urlCreater}
      />
      <h1 className='text-3xl font-bold my-6 text-gray-900 dark:text-white'>Profile</h1>
      <form className='flex flex-col gap-6 w-full sm:w-96 p-6  rounded-lg shadow-md' onSubmit={submitHandler}>
        <div
          className='w-40 h-40 border-4 flex ml-40 sm:ml-20 border-gray-300 dark:border-gray-500 rounded-full overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-300'
          onClick={() => imagePicker.current.click()}
        >
          <img
            src={url}
            alt="avatar"
            className='h-full w-full object-cover'
            draggable={false}
          />
        </div>
        <TextInput
          className='w-full p-2 bg-gray-200 dark:bg-gray-600 dark:text-white rounded-md'
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder='Name'
          required
        />
        <TextInput
          className='w-full p-2 bg-gray-200 dark:bg-gray-600 dark:text-white rounded-md'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder='Email'
          required
        />
        <TextInput
          className='w-full p-2 bg-gray-200 dark:bg-gray-600 dark:text-white rounded-md'
          type='password'
          value={password}
          placeholder='Password (optional)'
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          type='submit'
          outline
          className='hover:bg-blue-600 hover:text-white transition-all dark:bg-blue-500 dark:hover:bg-blue-400'
        >
          Update Profile
        </Button>
        <Button
          href='/create-post'
          type='button'
          gradientDuoTone='pinkToOrange'
          className='transition-all'
        >
          Create Post
        </Button>
      </form>
    </div>
  );
}
