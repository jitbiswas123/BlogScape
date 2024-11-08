import React, { useEffect, useRef, useState } from 'react';
import { Button, Select, TextInput } from 'flowbite-react';
import DOMPurify from 'dompurify';
import axios from "axios";
import { useQuill } from 'react-quilljs';
import 'quill/dist/quill.snow.css';
import { useDispatch } from 'react-redux';
import { login } from '../redux/userSlice';
import { toast } from 'react-toastify';

export default function CreatePost() {
    const dispatch = useDispatch();
    const ref = useRef();
    const { quill, quillRef } = useQuill();
    const [imagesUrls, setImagesUrls] = useState([]);
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('uncategoried');
    const [titleImage, setTitleImage] = useState('');
    const [previousImages, setPreviousImages] = useState([]);

    const insertToEditor = (url) => {
        const range = quill.getSelection();
        quill.insertEmbed(range.index, 'image', url);
    };

    const saveToServer = async (image) => {
        try {
            const formData = new FormData();
            formData.append('image', image);

            const response = await axios.post("http://localhost:3000/api/v1/posts/upload", formData, {
                withCredentials: true,
            });
            const imageUrl = response.data.image.path;
            setImagesUrls((prev) => [...prev, { url: imageUrl, public_id: response.data.image.filename }]);
            insertToEditor(imageUrl);
        } catch (error) {
            handleServerError(error);
        }
    };

    const selectLocalImage = () => {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();

        input.onchange = () => {
            const file = input.files[0];
            saveToServer(file);
        };
    };

    const detectImageRemoval = () => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(quill.root.innerHTML, "text/html");
        const currentImages = Array.from(doc.querySelectorAll("img")).map(img => img.src);

        // Detect removed images
        const removedImages = previousImages.filter(src => !currentImages.includes(src));
        if (removedImages.length > 0) {
            removedImages.forEach((src) => {
                handleImageRemove(src);
            });
        }

        setPreviousImages(currentImages); // Update tracked images
    };

    const handleImageRemove = (src) => {
        setImagesUrls((prev) => prev.filter(image => image.url !== src));
    };    
    useEffect(() => {
        if (quill) {
            quill.getModule('toolbar').addHandler('image', selectLocalImage);
            quill.on('text-change', detectImageRemoval); // Listen for changes
        }
    }, [quill, previousImages]);

    async function onsubmit() {
        try {
            const content = quill.root.innerHTML;

            if (!title || !category || !titleImage || content === '<p><br></p>') {
                alert("All fields are required");
                return;
            }
            const cleanHTML = DOMPurify.sanitize(content);
            const formData = new FormData();
            formData.append('title', title);
            formData.append('category', category);
            formData.append('image', titleImage);
            formData.append('content', cleanHTML);
            formData.append('urls', JSON.stringify(imagesUrls));

            const response = await axios.post("http://localhost:3000/api/v1/posts/create", formData, {
                withCredentials: true,
            });

            toast.success("Post created successfully!");
            resetForm();
        } catch (error) {
            handleServerError(error);
        }
    }

    const handleServerError = (error) => {
        if (error.response && error.response.data.message === "unauthorized") {
            dispatch(login(null));
            toast.error("Please log in again");
        } else if (error.response) {
            toast.error(error.response.data.message || "Error occurred");
        } else {
            toast.error(error.message);
        }
    };

    const resetForm = () => {
        setTitle('');
        setCategory('uncategoried');
        setTitleImage('');
        setImagesUrls([]);
        setPreviousImages([]);
        quill.setText('');
    };

    return (
        <div className='flex flex-col justify-center items-center p-8 gap-4 min-h-screen bg-gray-50 dark:bg-gray-900'>
            <div className='bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 w-full sm:w-[80%] md:w-[55%]'>
                <h2 className='text-3xl font-semibold text-gray-900 dark:text-white mb-4'>Create Post</h2>
                <div className='flex flex-col sm:flex-row gap-3'>
                    <TextInput 
                        className='flex-1' 
                        placeholder='Post Title' 
                        value={title} 
                        onChange={(e) => setTitle(e.target.value)} 
                        required
                    />
                    <Select 
                        value={category} 
                        onChange={(e) => setCategory(e.target.value)} 
                        className='dark:bg-gray-700'
                    >
                        <option value="uncategoried">Select Category</option>
                        <option value="javascript">JavaScript</option>
                        <option value="react">React</option>
                        <option value="nodejs">Node.js</option>
                    </Select>
                </div>
                <div className='border-2 border-blue-600 border-dashed w-full rounded-md p-2 flex justify-between items-center mt-4'>
                    <input 
                        type="file" 
                        accept='image/*' 
                        ref={ref} 
                        onChange={(e) => setTitleImage(e.target.files[0])} 
                        className='hidden'
                    />
                    <Button 
                        onClick={() => ref.current.click()} 
                        className='bg-blue-600 text-white'
                    >
                        Select Title Image
                    </Button>
                </div>
                <div className='mt-4'>
                    <div ref={quillRef} className='border border-gray-300 dark:border-gray-600' />
                </div>
                <Button 
                    className='w-full mt-6 bg-blue-600 text-white' 
                    type='button' 
                    onClick={onsubmit}
                >
                    Publish
                </Button>
            </div>
        </div>
    );
}
