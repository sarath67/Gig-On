import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';

interface Post {
  id: number;
  title: string;
  content: string;
  username: string;
  created_at: string;
  isOnline: boolean;
  isPaid: boolean;
}

const Post: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useContext(AuthContext);
  const [post, setPost] = useState<Post | null>(null);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const Navigate = useNavigate();

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
        } else {
          console.error('Error fetching post:', await response.text());
        }
      } catch (error) {
        console.error('Error fetching post:', error);
      }
    };

    fetchPost();
  }, [id]);

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/posts/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer 1234'
        }
      });
      if (response.ok) {
        console.log('Post deleted successfully');
        setDeleteSuccess(true);
        setTimeout(() => {
          setDeleteSuccess(false);
          Navigate('/');
        }, 1500);
      } else {
        console.error('Error deleting post:', await response.text());
      }
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full p-4 text-center bg-white border border-gray-200 rounded-2xl shadow sm:p-8 dark:bg-gray-100 dark:border-gray-700 mt-4 ">
      <h2 className="mb-2 text-3xl font-bold text-gray-900 dark:text-gray-900">{post.title}</h2>
      <p className="mb-5 text-base text-gray-500 sm:text-lg dark:text-gray-500">{post.content}</p>
      <div className=''>
        <p className="w-full sm:w-auto bg-gray-800 hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-300 text-white rounded-lg inline-flex items-center justify-center px-4 py-2.5 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700">Online: {post.isOnline ? 'Yes ' : 'No '} 
        Paid: {post.isPaid ? 'Yes' : 'No'}</p>
       
      </div>
      <Link to={`/profile/${post.username}`}> 
      <div className="mt-4">
        <p className="w-full sm:w-auto bg-gray-700 hover:bg-gray-600 focus:ring-4 focus:outline-none focus:ring-gray-300 text-white rounded-lg inline-flex items-center justify-center px-4 py-2.5 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700"><Link to={`/profile/${post.username}`}>{post.username}- </Link>  {new Date(post.created_at).toLocaleDateString()}</p>
      </div>
      </Link>
      {user === post.username && (
        <div  >
          <button onClick={handleDelete} className="w-full sm:w-auto bg-red-500 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300 text-white rounded-lg inline-flex items-center justify-center px-4 py-2.5 mt-4 dark:bg-red-700 dark:hover:bg-red-800 dark:focus:ring-red-700">Delete</button>
          <Link to={`/update/${id}`} className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300 text-white rounded-lg inline-flex items-center justify-center px-4 py-2.5 mt-4 ml-2 dark:bg-blue-700 dark:hover:bg-blue-800 dark:focus:ring-blue-700">Edit</Link>
        </div>
      )}
      {deleteSuccess && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mt-2" role="alert">
          Post deleted successfully!
        </div>
      )}
    </div>
  );
};

export default Post;
