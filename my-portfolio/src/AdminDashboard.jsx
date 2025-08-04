// src/pages/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from './firebaseConfig'; // Corrected import path
import { collection, getDocs, addDoc, doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';

export default function AdminDashboard() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [message, setMessage] = useState('');
  const [posts, setPosts] = useState([]);
  const [editing, setEditing] = useState(null); // Will hold the full post object being edited
  const navigate = useNavigate();

  // Effect for checking authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, fetch their posts.
        fetchPosts();
      } else {
        // User is signed out, redirect to login.
        navigate('/admin'); // Corrected redirect path
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [navigate]);

  const fetchPosts = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'posts'));
      const postsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPosts(postsData);
    } catch (error) {
      setMessage('Error fetching posts: ' + error.message);
    }
  };

  const handleNewPost = async (e) => {
    e.preventDefault();
    setMessage('Submitting...');
    const user = auth.currentUser; // Get the currently signed-in user
    if (!user) {
      setMessage('You must be logged in to create a post.');
      return;
    }

    try {
      await addDoc(collection(db, 'posts'), {
        title,
        content,
        createdAt: new Date(),
        authorId: user.uid, // Add the author's user ID
      });
      setMessage('Post created successfully!');
      setTitle('');
      setContent('');
      fetchPosts(); // Refresh the posts list
    } catch (error) {
      setMessage('Error creating post: ' + error.message);
    }
  };

  const startEdit = (post) => {
    // Security check: Only allow editing if the user is the author
    if (auth.currentUser && auth.currentUser.uid === post.authorId) {
      setEditing(post);
    } else {
      setMessage("You don't have permission to edit this post.");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editing) return;
    setMessage('Updating...');
    try {
      const postRef = doc(db, 'posts', editing.id);
      await updateDoc(postRef, {
        title: editing.title,
        content: editing.content,
      });
      setMessage('Post updated successfully!');
      setEditing(null);
      fetchPosts();
    } catch (error) {
      setMessage('Error updating post: ' + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    setMessage('Deleting...');
    try {
      await deleteDoc(doc(db, 'posts', id));
      setMessage('Post deleted successfully!');
      fetchPosts();
    } catch (error) {
      setMessage('Error deleting post: ' + error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      // The onAuthStateChanged listener will handle the redirect
    } catch (error) {
      setMessage('Error logging out: ' + error.message);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Admin Dashboard</h2>
        <button 
          onClick={handleLogout} 
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
        >
          Logout
        </button>
      </div>

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
          placeholder="Write your post content here..."
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
          <h3 className="text-xl font-semibold">Edit "{editing.title}"</h3>
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
          <div key={p.id} className="flex justify-between items-center bg-contrast text-white p-2 rounded">
            <span>{p.title}</span>
            {auth.currentUser && auth.currentUser.uid === p.authorId && (
              <div className="space-x-2">
                <button onClick={() => startEdit(p)} className="px-2 py-1 bg-secondary text-white rounded">Edit</button>
                <button onClick={() => handleDelete(p.id)} className="px-2 py-1 bg-red-600 text-white rounded">Delete</button>
              </div>
            )}
          </div>
        ))}
      </div>

      {message && <p className="text-center p-2 bg-gray-200 rounded">{message}</p>}
    </div>
  );
}
