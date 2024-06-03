import React, { useState,useContext } from 'react';
import CreatePost from './CreatePost';
import PostList from './PostsList';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
const Home: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [showCreatePost, setShowCreatePost] = useState(false);
    const [isOnlineSearch, setIsOnlineSearch] = useState('any');
    const [isPaidSearch, setIsPaidSearch] = useState('any');
    const [isNewPostCreated, setIsNewPostCreated] = useState(false);
    const { user } = useContext(AuthContext);
    const Navigate = useNavigate();
    const handleIsOnlineChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setIsOnlineSearch(event.target.value);
    };

    const handleIsPaidChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setIsPaidSearch(event.target.value);
    };

    const toggleCreatePost = () => {
        if(!user){
            Navigate('/login');
        }
        setShowCreatePost(!showCreatePost);
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const handlePostCreated = () => {
        setIsNewPostCreated(true); 
        setTimeout(() => {
            setIsNewPostCreated(false); 
            setShowCreatePost(false); 
        }, 3000); 
    };

    return (
        <div className="">
            <div className="  p-4  bg-white shadow-lg">
                <input
                    className="border border-gray-300 rounded-md p-2 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-900 bg-gray-100 focus:bg-white"
                    type="text"
                    placeholder="Search Gigs..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
                <div className="flex space-x-4 mb-4">
                    <select
                        className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-900"
                        value={isOnlineSearch}
                        onChange={handleIsOnlineChange}
                    >
                        <option value="any">Any</option>
                        <option value="yes">Online</option>
                        <option value="no">Offline</option>
                    </select>
                    <select
                        className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-900"
                        value={isPaidSearch}
                        onChange={handleIsPaidChange}
                    >
                        <option value="any">Any</option>
                        <option value="yes">Paid</option>
                        <option value="no">Free</option>
                    </select>
                </div>
                <button
                    className="bg-blue-900 hover:bg-blue-950 text-white font-bold py-2 px-4 rounded mb-4 transition duration-300 ease-in-out"
                    onClick={toggleCreatePost}
                >
                    {showCreatePost ? 'Close Form' : 'Create Gig'}
                </button>
                {isNewPostCreated && <div className="bg-green-200 p-2 mb-4 rounded">New post created</div>} 
                {showCreatePost && <CreatePost onPostCreated={handlePostCreated} />} 
                <PostList searchTerm={searchTerm} isOnlineSearch={isOnlineSearch} isPaidSearch={isPaidSearch} />
            </div>
        </div>
    );
};

export default Home;
