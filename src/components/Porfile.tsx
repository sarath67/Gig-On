import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import CreateConnectionButton from './ConnectionButton';

import Loading from './Loading'; // Import the Loading component

interface Post {
    id: number;
    title: string;
    content: string;
    username: string;
    created_at: string;
    isOnline: string; 
    isPaid: boolean;
}

const ProfilePage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(false); // Loading state for posts

  useEffect(() => {
    fetchUserPosts();
  }, [username]);

  const fetchUserPosts = async () => {
    setIsLoadingPosts(true); // Start loading animation
    try {
      const response = await fetch(`/api/post/${username}`, {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer 1234'
        }
      });
      if (response.ok) {
        const data = await response.json();
        setPosts(data.results);
      } else {
        console.error('Error fetching user posts:', await response.text());
      }
    } catch (error) {
      console.error('Error fetching user posts:', error);
    } finally {
      setIsLoadingPosts(false); // Stop loading animation
    }
  };

  const handleDelete = async (postId: number) => {
    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': 'Bearer 1234'
        }
      });
      if (response.ok) {
        console.log('Post deleted successfully');
        // Reload posts after deleting the post
        const updatedPosts = posts.filter(post => post.id !== postId);
        setPosts(updatedPosts);
      } else {
        console.error('Error deleting post:', await response.text());
      }
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Profile: {username}</h2>
      {isLoadingPosts ? ( // Show loading animation while fetching posts
        <div className="flex justify-center items-center">
          <Loading />
        </div>
      ) : (
        <>{user !== username && user && <CreateConnectionButton />}
          <h1 className="text-2xl font-semibold mb-4">Gigs</h1>
          {posts.map((post) => (
            <div key={post.id} className="border border-gray-200 rounded-xl p-4 mb-4 bg-gray-100 hover:cursor-pointer hover:bg-gray-200 m-6">
              <h3 className="text-lg font-semibold">{post.title}</h3>
              <p>{post.content}</p>
              <p className="text-sm text-gray-500">Posted by {post.username} on {new Date(post.created_at).toLocaleDateString()}</p>
              <p className='text-sm text-gray-500'>Is Online: {post.isOnline}</p>
              <p className="text-sm text-gray-500">Is Paid: {post.isPaid ? 'Yes' : 'No'}</p>
              {user === post.username && (
                <>
                <div className='flex flex-row gap-3'>
                  <Link to={`/update/${post.id}`} className="text-blue-500 mr-2">Edit</Link>
                  <button onClick={() => handleDelete(post.id)} className="text-red-500">Delete</button>
                  </div>
                </>
              )}
            </div>
          ))}
          
        </>
      )}
    </div>
  );
};

export default ProfilePage;
