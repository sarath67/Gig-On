// UpdatePost.tsx

import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';

interface Post {
    id: number;
    title: string;
    content: string;
    username: string;
    created_at: string;
    isOnline: string; 
    isPaid: boolean;
}

const UpdatePost: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { user } = useContext(AuthContext);
    const Navigate = useNavigate();
    const [post, setPost] = useState<Post | null>(null);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [category_name, setCategoryName] = useState('');
    const [isOnline, setIsOnline] = useState<string>(''); 
    const [isPaid, setIsPaid] = useState(false);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await fetch(`/api/posts/${id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer 1234'
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setPost(data.results[0]);
                    setTitle(data.results[0].title);
                    setContent(data.results[0].content);
                    setCategoryName(data.results[0].category_name);
                    setIsOnline(data.results[0].isOnline);
                    setIsPaid(data.results[0].isPaid);
                } else {
                    console.error('Error fetching post:', await response.text());
                }
            } catch (error) {
                console.error('Error fetching post:', error);
            }
        };

        fetchPost();
    }, [id]);

    const handleUpdate = async () => {
        try {
            const response = await fetch(`/api/posts/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer 1234'
                },
                body: JSON.stringify({ title, content, category_name, isOnline, isPaid })
            });
            if (response.ok) {
                console.log('Post updated successfully');
                Navigate('/'); 
            } else {
                console.error('Error updating post:', await response.text());
            }
        } catch (error) {
            console.error('Error updating post:', error);
        }
    };

    if (!post) {
        return <div>Loading...</div>;
    }
    if (user !== post.username) {
        return <div>You are not authorized to edit this post.</div>;
    }

    return (
        <div className="container mx-auto mt-8">
            <h2 className="text-2xl font-semibold mb-4">Edit Post</h2>
            <div className="mb-4">
                <label className="block mb-1">Title:</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="border border-gray-300 rounded-md p-2 w-full" />
            </div>
            <div className="mb-4">
                <label className="block mb-1">Content:</label>
                <textarea value={content} onChange={(e) => setContent(e.target.value)} className="border border-gray-300 rounded-md p-2 w-full h-40" />
            </div>
            <div className="mb-4">
                <label className="block mb-1">Category Name:</label>
                <input type="text" value={category_name} onChange={(e) => setCategoryName(e.target.value)} className="border border-gray-300 rounded-md p-2 w-full" />
            </div>
            <div className="mb-4">
                <label className="block mb-1">Is Online:</label>
                <select value={isOnline} onChange={(e) => setIsOnline(e.target.value)} className="border border-gray-300 rounded-md p-2 w-full">
                    <option value="any">Any</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                </select>
            </div>
            <div className="mb-4">
                <label className="block mb-1">Is Paid:</label>
                <input type="checkbox" checked={isPaid} onChange={(e) => setIsPaid(e.target.checked)} className="mr-2" />
            </div>
            <button onClick={handleUpdate} className="bg-blue-900 text-white px-4 py-2 rounded-md hover:bg-blue-950">Update Post</button>
        </div>
    );
};

export default UpdatePost;