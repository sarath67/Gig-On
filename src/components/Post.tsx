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
    <div>
      <h2>{post.title}</h2>
      <p>{post.content}</p>
      <p><Link to={`/profile/${post.username}`}>{post.username}</Link> on {new Date(post.created_at).toLocaleDateString()}</p>
      <p>Is Online: {post.isOnline ? 'Yes' : 'No'}</p>
      <p>Is Paid: {post.isPaid ? 'Yes' : 'No'}</p>
      {user === post.username && ( 
        <button onClick={handleDelete} className="text-red-500">Delete</button>
      )}
      {user === post.username && ( 
        <Link to={`/update/${id}`} className="text-blue-500 ml-2">Edit</Link>
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
