import React, { useState, useEffect } from 'react';
import { db, auth } from './firebaseConfig';
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';

export default function AdminPosts() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [message, setMessage] = useState('');
  const [posts, setPosts] = useState([]);
  const [editing, setEditing] = useState(null); // Will hold the full post object being edited

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'posts'));
      const postsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPosts(postsData);
    } catch (error) {
      setMessage('Error fetching posts: ' + error.message);
    }
  };

  const handleNewPost = async (e) => {
    e.preventDefault();
    if (!title || !content) {
      setMessage("Title and content cannot be empty.");
      return;
    }
    setMessage('Submitting...');
    const user = auth.currentUser;
    if (!user) {
      setMessage('You must be logged in to create a post.');
      return;
    }

    try {
      await addDoc(collection(db, 'posts'), {
        title,
        content,
        createdAt: new Date(),
        authorId: user.uid,
      });
      setMessage('Post created successfully!');
      setTitle('');
      setContent('');
      fetchPosts();
    } catch (error) {
      setMessage('Error creating post: ' + error.message);
    }
  };

  const startEdit = (post) => {
    if (auth.currentUser && auth.currentUser.uid === post.authorId) {
      setEditing(post);
      setMessage('');
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

  return (
    <div className="space-y-8">
        {message && <p className="text-center p-3 bg-gray-200 rounded-md text-gray-800">{message}</p>}
        
        {/* --- Edit Form (shows only when editing) --- */}
        {editing && (
            <form onSubmit={handleUpdate} className="space-y-4 p-4 border border-dashed border-contrast rounded-lg">
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
                <div className="flex gap-4">
                    <button className="px-4 py-2 bg-secondary text-white rounded hover:bg-darkback" type="submit">Update Post</button>
                    <button type="button" onClick={() => setEditing(null)} className="px-4 py-2 border border-contrast rounded">Cancel</button>
                </div>
            </form>
        )}

        {/* --- New Post Form --- */}
        <form onSubmit={handleNewPost} className="space-y-4">
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
            <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" type="submit">Create Post</button>
        </form>
        
        {/* --- Existing Posts --- */}
        <div className="space-y-4">
            <h3 className="text-xl font-semibold">Existing Posts</h3>
            {posts.map((p) => (
                <div key={p.id} className="flex justify-between items-center bg-background text-text p-3 rounded-lg">
                    <span>{p.title}</span>
                    {auth.currentUser && auth.currentUser.uid === p.authorId && (
                    <div className="space-x-2">
                        <button onClick={() => startEdit(p)} className="px-3 py-1 bg-secondary text-white rounded text-sm">Edit</button>
                        <button onClick={() => handleDelete(p.id)} className="px-3 py-1 bg-red-600 text-white rounded text-sm">Delete</button>
                    </div>
                    )}
                </div>
            ))}
        </div>
    </div>
  );
}
