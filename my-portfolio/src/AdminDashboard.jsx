// src/pages/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';

export default function AdminDashboard() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [message, setMessage] = useState('');
  const [posts, setPosts] = useState([]);
  const [editing, setEditing] = useState(null); // {slug, title, content}

  const token = localStorage.getItem('authToken');

  const fetchPosts = async () => {
    const res = await fetch('/api/admin/posts', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      const data = await res.json();
      setPosts(data.posts || []);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

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
      fetchPosts();
    }
  };

  const startEdit = async (slug) => {
    const res = await fetch(`/api/admin/posts?slug=${slug}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      const data = await res.json();
      setEditing({ slug, title: slug, content: data.content });
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editing) return;
    setMessage('Updating...');
    const res = await fetch('/api/admin/posts', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(editing),
    });
    const data = await res.json();
    setMessage(data.message);
    if (res.ok) {
      setEditing(null);
      fetchPosts();
    }
  };

  const handleDelete = async (slug) => {
    if (!confirm('Delete this post?')) return;
    const res = await fetch(`/api/admin/posts?slug=${slug}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setMessage(data.message);
    if (res.ok) {
      fetchPosts();
    }
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Admin Dashboard</h2>

      <form onSubmit={handleNewPost} className="space-y-4 bg-accent p-4 rounded shadow">
        <h3 className="text-xl font-semibold">Create New Post</h3>
        <input
          type="text"
          placeholder="Post Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full p-2 border border-contrast rounded"
        />
        <textarea
          placeholder="Write your post content here (MDX)..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={8}
          required
          className="w-full p-2 border border-contrast rounded"
        ></textarea>
        <button className="px-4 py-2 bg-secondary text-white rounded hover:bg-darkback" type="submit">
          Create Post
        </button>
      </form>

      {editing && (
        <form onSubmit={handleUpdate} className="space-y-4 bg-accent p-4 rounded shadow">
          <h3 className="text-xl font-semibold">Edit {editing.slug}</h3>
          <input
            type="text"
            value={editing.title}
            onChange={(e) => setEditing({ ...editing, title: e.target.value })}
            required
            className="w-full p-2 border border-contrast rounded"
          />
          <textarea
            value={editing.content}
            onChange={(e) => setEditing({ ...editing, content: e.target.value })}
            rows={8}
            required
            className="w-full p-2 border border-contrast rounded"
          ></textarea>
          <button className="px-4 py-2 bg-secondary text-white rounded hover:bg-darkback" type="submit">
            Update Post
          </button>
          <button
            type="button"
            onClick={() => setEditing(null)}
            className="ml-2 px-4 py-2 border border-contrast rounded"
          >
            Cancel
          </button>
        </form>
      )}

      <div className="space-y-2">
        <h3 className="text-xl font-semibold">Existing Posts</h3>
        {posts.map((p) => (
          <div key={p.slug} className="flex justify-between items-center bg-contrast text-white p-2 rounded">
            <span>{p.title}</span>
            <div className="space-x-2">
              <button onClick={() => startEdit(p.slug)} className="px-2 py-1 bg-secondary text-white rounded">Edit</button>
              <button onClick={() => handleDelete(p.slug)} className="px-2 py-1 bg-red-600 text-white rounded">Delete</button>
            </div>
          </div>
        ))}
      </div>

      {message && <p>{message}</p>}
    </div>
  );
}