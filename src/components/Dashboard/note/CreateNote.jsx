import React, { useState } from 'react';
import axios from 'axios';

const CreateNote = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [message, setMessage] = useState(''); // For success/error message

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent reload

    try {
      const token = localStorage.getItem('authToken');

      const response = await axios.post(
          'http://localhost:5000/api/members/notes',
          {
            title,
            content,
            userId: 'some-user-id', // Add a valid userId dynamically, if applicable
          },
          {
            headers: {
              Authorization: `Bearer ${token}`, // Include Bearer token for authentication
            },
          }
      );

      setMessage('Note created successfully!');
      setTitle('');
      setContent('');
    } catch (error) {
      console.error('Error while creating note:', error);
      setMessage('Failed to create the note. Authorization issue.');
    }
  };

  return (
      <div>
        <h1>Create a Note</h1>
        {message && <p style={{ color: message.includes('successfully') ? 'green' : 'red' }}>{message}</p>}
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="title">Title</label>
            <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter note title"
            />
          </div>
          <div>
            <label htmlFor="content">Content</label>
            <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Enter note content"
            />
          </div>
          <button type="submit">Add Note</button>
        </form>
      </div>
  );
};

export default CreateNote;