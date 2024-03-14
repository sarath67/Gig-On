import React, { useState, useContext } from 'react';
import { AuthContext } from './AuthContext';

interface CreatePostProps {
  onPostCreated: () => void; // Callback to notify parent component of new post creation
}

const CreatePost: React.FC<CreatePostProps> = ({ onPostCreated }) => {
  const { user } = useContext(AuthContext);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [categoryName, setCategoryName] = useState('');
  const [isOnline, setIsOnline] = useState('');
  const [isPaid, setIsPaid] = useState(false);
  const username = user ? user : '';

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleContentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(event.target.value);
  };

  const handleCategoryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCategoryName(event.target.value);
  };

  const handleIsOnlineChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setIsOnline(event.target.value);
  };

  const handleIsPaidChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsPaid(event.target.checked);
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer 1234'
        },
        body: JSON.stringify({ title, content, username, categoryName, isOnline, isPaid })
      });
      
      if (response.ok) {
        console.log('Post created successfully');
        onPostCreated();
      } else {
        console.error('Error creating post');
      }
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  return (
    <div className="container mx-auto mt-4">
      <div className="mb-4">
        <input
          className="border border-gray-400 p-2 w-full"
          type="text"
          placeholder="Title"
          value={title}
          onChange={handleTitleChange}
        />
      </div>
      <div className="mb-4">
        <textarea
          className="border border-gray-400 p-2 w-full"
          placeholder="Content"
          rows={6}
          value={content}
          onChange={handleContentChange}
        />
      </div>
      <div className="mb-4">
        <input
          className="border border-gray-400 p-2 w-full"
          type="text"
          placeholder="Category Name"
          value={categoryName}
          onChange={handleCategoryChange}
        />
      </div>
      <div className="mb-4">
        <select
          className="border border-gray-400 p-2 w-full"
          value={isOnline}
          onChange={handleIsOnlineChange}
        >
          <option value="">Online Gig?</option>
          <option value="yes">Yes</option>
          <option value="no">No</option>
          <option value="any">Any</option>
        </select>
      </div>
      <div className="mb-4 flex items-center"> {/* Align items in a row */}
        <input
          className="border border-gray-400 p-2"
          type="checkbox"
          id="isPaid"
          checked={isPaid}
          onChange={handleIsPaidChange}
        />
        <label htmlFor="isPaid" className="ml-2">Is Paid</label> {/* Add margin-left */}
      </div>
      <button
        className="bg-blue-900 hover:bg-blue-950 text-white font-bold py-2 px-4 rounded"
        onClick={handleSubmit}
      >
        Create
      </button>
    </div>
  );
};

export default CreatePost;
