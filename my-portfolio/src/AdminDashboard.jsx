// src/pages/AdminDashboard.jsx
import React, { useState } from 'react';

export default function AdminDashboard() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [message, setMessage] = useState('');

  const handleNewPost = async (e) => {
    e.preventDefault();
    setMessage('Submitting...');
    const token = localStorage.getItem('authToken');

    const response = await fetch('/api/admin/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // <-- Important!
      },
      body: JSON.stringify({ title, content }),
    });

    const data = await response.json();
    setMessage(data.message);

    if (response.ok) {
      setTitle('');
      setContent('');
    }
  };

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <form onSubmit={handleNewPost}>
        <h3>Create New Post</h3>
        <input
          type="text"
          placeholder="Post Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <br />
        <textarea
          placeholder="Write your post content here (MDX)..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={15}
          required
        ></textarea>
        <br />
        <button type="submit">Create Post</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}