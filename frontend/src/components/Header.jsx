import { Button, Navbar, TextInput, Avatar, Dropdown } from 'flowbite-react';
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LuSearch } from "react-icons/lu";
import { FaMoon, FaSun } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../redux/themeSlice';
import axios from 'axios';
import { login } from '../redux/userSlice';
import { toast } from 'react-toastify';

export default function Header() {
    const location = useLocation().pathname;
    const { theme } = useSelector(state => state.theme);
    const { user } = useSelector(state => state.user);
    const [search, setSearch] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const toggleThemeHandler = () => {
        dispatch(toggleTheme());
    };

    async function changeHandler(e) {
        const searchQuery = e.target.value;
        setSearchQuery(searchQuery); // Update the query state

        if (searchQuery.length > 0) {
            try {
                const response = await axios.get(`http://localhost:3000/api/v1/posts/?search=${searchQuery}`, {
                    withCredentials: true,
                });
                setSearch(response.data.posts); // Store results in search state
            } catch (error) {
                toast.error("Error fetching search results");
            }
        } else {
            setSearch([]); // Clear results when searchQuery is empty
        }
    }

    async function logout() {
        try {
            const response = await axios.get("http://localhost:3000/api/v1/auth/logout", {
                withCredentials: true
            });
            if (response.data.success) {
                dispatch(login(null));
                toast.success("Logged out successfully");
                navigate("/login");
            }
        } catch (error) {
            toast.error("Failed to logout");
        }
    }

    return (
        <Navbar className={`bg-white dark:bg-gray-800 shadow-lg transition-all duration-300 ease-in-out ${theme === 'dark' ? 'border-gray-700' : 'border-gray-300'}`}>
            <Navbar.Brand href='/' className='text-xl font-bold text-gray-800 dark:text-white'>
                <span className='bg-gradient-to-r text-sm sm:text-xl from-teal-400 to-yellow-200 rounded-full py-1 px-2 shadow-lg'>
                    Blog
                </span>
                Scape
            </Navbar.Brand>

            <div className="relative w-1/4 hidden md:block">
                <TextInput
                    placeholder='Search...'
                    rightIcon={LuSearch}
                    value={searchQuery}
                    onChange={changeHandler}
                    className='w-full transition duration-300 '
                />
                
                {search && search.length > 0 && (
                    <div className="absolute top-full mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto z-10 dark:bg-gray-800 dark:border-gray-600">
                        {search.map((post) => (
                            <div
                                key={post._id}
                                className="flex items-center p-2 text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                                onClick={() => {
                                    navigate(`/post/?postId=${post._id}`);
                                    setSearch([]); // Clear results on selection
                                    setSearchQuery(''); // Clear search bar
                                }}
                            >
                                {/* Thumbnail image */}
                                <img
                                    src={post.titleImage} // Assuming `thumbnail` holds the URL to the image
                                    alt={post.title}
                                    className="w-10 h-10 rounded mr-3 object-cover"
                                />
                                
                                {/* Title */}
                                <span className="text-gray-800 dark:text-gray-200">{post.title}</span>
                            </div>
                        ))}
                    </div>
                )}

            </div>

            <Button className='w-10 h-10 md:hidden' color='gray' pill>
                <LuSearch />
            </Button>

            <div className='flex items-center gap-4 md:order-2'>
                <Button
                    color='gray'
                    className='w-10 h-10 p-0 hidden sm:flex transition-transform duration-300 hover:scale-110'
                    onClick={toggleThemeHandler}
                >
                    {theme === 'light' ? <FaMoon className='text-lg' /> : <FaSun className='text-lg' />}
                </Button>

                {user ? (
                    <Dropdown
                        arrowIcon={false}
                        inline
                        label={<Avatar src={user.image} rounded />}
                    >
                        <Dropdown.Header>
                            <span className="font-semibold">{user.email}</span>
                        </Dropdown.Header>
                        <Dropdown.Item href='/dashboard?tab=profile'>Profile</Dropdown.Item>
                        <Dropdown.Item onClick={logout}>Logout</Dropdown.Item>
                    </Dropdown>
                ) : (
                    <Link to="/login">
                        <Button gradientDuoTone='purpleToBlue' outline className="text-[8px] w-12 sm:w-16 sm:text-sm transition duration-300 hover:bg-blue-500 hover:text-white">
                            Login
                        </Button>
                    </Link>
                )}

                <Navbar.Toggle />
            </div>

            <Navbar.Collapse>
                <Navbar.Link href='/' active={location === "/"} className='transition duration-300 hover:text-teal-500 dark:hover:text-teal-300'>
                    Home
                </Navbar.Link>
                <Navbar.Link href='/about' active={location === "/about"} className='transition duration-300 hover:text-teal-500 dark:hover:text-teal-300'>
                    About
                </Navbar.Link>
                <Navbar.Link href='/contact' active={location === "/contact"} className='transition duration-300 hover:text-teal-500 dark:hover:text-teal-300'>
                    Contact
                </Navbar.Link>
                <Navbar.Link className='sm:hidden cursor-pointer' onClick={toggleThemeHandler}>
                    {theme === "light" ? "Switch to Dark" : "Switch to Light"}
                </Navbar.Link>
            </Navbar.Collapse>
        </Navbar>
    );
}
