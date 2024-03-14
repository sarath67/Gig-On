import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Loading from './Loading'; 

interface Post {
    id: number;
    title: string;
    content: string;
    username: string;
    created_at: string;
    isOnline: string;
    isPaid: boolean;
}

interface PostListProps {
    searchTerm: string;
    isOnlineSearch: string;
    isPaidSearch: string;
}

const PostList: React.FC<PostListProps> = ({ searchTerm, isOnlineSearch, isPaidSearch }) => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetchPosts();
    }, []);

    useEffect(() => {
        filterPosts();
    }, [searchTerm, isOnlineSearch, isPaidSearch, posts]);

    const fetchPosts = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/posts', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer 1234'
                },
            });
            if (!response.ok) {
                throw new Error('Failed to fetch posts');
            }
            const data = await response.json();
            setPosts(data.results);
        } catch (error) {
            console.error('Error fetching posts:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const filterPosts = () => {
        let filtered = posts;
        if (searchTerm.length > 0) {
            filtered = filtered.filter(post => post.title.toLowerCase().includes(searchTerm) || post.content.toLowerCase().includes(searchTerm));
        }
        if (isOnlineSearch !== 'any') {
            filtered = filtered.filter(post => (isOnlineSearch === 'yes' && post.isOnline === 'yes') || (isOnlineSearch === 'no' && post.isOnline === 'no'));
        }
        if (isPaidSearch !== 'any') {
            filtered = filtered.filter(post => (isPaidSearch === 'yes' && post.isPaid) || (isPaidSearch === 'no' && !post.isPaid));
        }
        setFilteredPosts(filtered);
    };

    return (
        <div>
            <h2 className="text-2xl font-semibold mb-4">All Posts</h2>
            {isLoading ? (
                <div className="flex justify-center items-center">
                    <Loading />
                </div>
            ) : (
                filteredPosts.map((post) => (
                    <Link to={`/posts/${post.id}`} key={post.id}>
                        <div className="border border-gray-200 rounded-xl p-4 mb-4 bg-gray-100 hover:cursor-pointer hover:bg-gray-200">
                            <h3 className="text-lg font-semibold">{post.title}</h3>
                            <p>{post.content}</p>
                            <p className="text-sm text-gray-500">Posted by {post.username} on {new Date(post.created_at).toLocaleDateString()}</p>
                            <p className='text-sm text-gray-500'>Is Online: {post.isOnline}</p>
                            <p className="text-sm text-gray-500">Is Paid: {post.isPaid ? 'Yes' : 'No'}</p>
                        </div>
                    </Link>
                ))
            )}
        </div>
    );
};

export default PostList;
