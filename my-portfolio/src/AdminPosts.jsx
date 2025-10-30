import React, { useState, useEffect } from 'react';
import { db, auth } from './firebaseConfig';
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import ImageUpload from './components/ImageUpload';
import MultiImageUpload from './components/MultiImageUpload';

const FormInput = (props) => <input {...props} className="w-full p-3 bg-background border border-white/20 rounded-lg text-text focus:ring-primary focus:border-primary" />;
const FormTextarea = (props) => <textarea {...props} className="w-full p-3 bg-background border border-white/20 rounded-lg text-text focus:ring-primary focus:border-primary" />;
const PrimaryButton = ({ children, ...props }) => <button {...props} className="px-4 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-opacity-90 transition disabled:opacity-50">{children}</button>;
const SecondaryButton = ({ children, ...props }) => <button {...props} className="px-4 py-2 bg-surface border border-white/20 text-text rounded-lg hover:bg-white/10 transition">{children}</button>;
const DangerButton = ({ children, ...props }) => <button {...props} className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition">{children}</button>;

export default function AdminPosts() {
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [galleryImages, setGalleryImages] = useState([]);
  const [message, setMessage] = useState('');
  const [posts, setPosts] = useState([]);
  const [editing, setEditing] = useState(null);

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
      setMessage("Title and content are required.");
      return;
    }
    const user = auth.currentUser;
    if (!user) {
      setMessage('You must be logged in to post.');
      return;
    }

    try {
      await addDoc(collection(db, 'posts'), { 
        title, 
        excerpt,
        content, 
        coverImage,
        galleryImages,
        createdAt: new Date(), 
        authorId: user.uid 
      });
      setMessage('Post created successfully!');
      setTitle('');
      setExcerpt('');
      setContent('');
      setCoverImage('');
      setGalleryImages([]);
      fetchPosts();
    } catch (error) {
      setMessage('Error creating post: ' + error.message);
    }
  };

  const startEdit = (post) => {
    if (auth.currentUser?.uid === post.authorId) {
      setEditing(post);
      setMessage('');
    } else {
      setMessage("You are not authorized to edit this post.");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editing) return;
    try {
      const postRef = doc(db, 'posts', editing.id);
      await updateDoc(postRef, { 
        title: editing.title,
        excerpt: editing.excerpt || '',
        content: editing.content,
        coverImage: editing.coverImage || '',
        galleryImages: editing.galleryImages || []
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
        {message && <p className={`text-center p-3 rounded-md ${message.includes('Error') ? 'bg-red-900/50 text-red-300' : 'bg-green-900/50 text-green-300'}`}>{message}</p>}
        
        {editing && (
            <form onSubmit={handleUpdate} className="space-y-4 p-4 border border-dashed border-white/20 rounded-lg">
                <h3 className="text-xl font-semibold text-text">Edit "{editing.title}"</h3>
                <div>
                    <label className="text-sm text-muted block mb-1">Title</label>
                    <FormInput type="text" value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} required />
                </div>
                <div>
                    <label className="text-sm text-muted block mb-1">Short Description (for blog cards)</label>
                    <FormTextarea value={editing.excerpt || ''} onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })} rows={3} placeholder="Brief summary shown on blog cards..." />
                </div>
                <div>
                    <label className="text-sm text-muted block mb-1">Full Content</label>
                    <FormTextarea value={editing.content} onChange={(e) => setEditing({ ...editing, content: e.target.value })} rows={8} required />
                </div>
                <ImageUpload 
                    currentUrl={editing.coverImage || ''} 
                    onUploadComplete={(url) => setEditing({ ...editing, coverImage: url })}
                    folder="blog"
                    label="Cover Image"
                />
                <MultiImageUpload 
                    images={editing.galleryImages || []} 
                    onImagesChange={(imgs) => setEditing({ ...editing, galleryImages: imgs })}
                    folder="blog"
                    label="Gallery Images"
                />
                <div className="flex gap-4">
                    <PrimaryButton type="submit">Update Post</PrimaryButton>
                    <SecondaryButton type="button" onClick={() => setEditing(null)}>Cancel</SecondaryButton>
                </div>
            </form>
        )}

        <form onSubmit={handleNewPost} className="space-y-4">
            <h3 className="text-xl font-semibold text-text">Create New Post</h3>
            <div>
                <label className="text-sm text-muted block mb-1">Title</label>
                <FormInput type="text" placeholder="Post Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>
            <div>
                <label className="text-sm text-muted block mb-1">Short Description (for blog cards)</label>
                <FormTextarea placeholder="Brief summary shown on blog cards (optional - will use first 150 chars of content if empty)" value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={3} />
            </div>
            <div>
                <label className="text-sm text-muted block mb-1">Full Content</label>
                <FormTextarea placeholder="Write your full post content here..." value={content} onChange={(e) => setContent(e.target.value)} rows={8} required />
            </div>
            <ImageUpload 
                currentUrl={coverImage} 
                onUploadComplete={setCoverImage}
                folder="blog"
                label="Cover Image (Optional)"
            />
            <MultiImageUpload 
                images={galleryImages} 
                onImagesChange={setGalleryImages}
                folder="blog"
                label="Gallery Images (Optional)"
            />
            <PrimaryButton type="submit">Create Post</PrimaryButton>
        </form>
        
        <div className="space-y-4">
            <h3 className="text-xl font-semibold text-text">Existing Posts</h3>
            <div className="space-y-2">
              {posts.map((p) => (
                  <div key={p.id} className="flex justify-between items-center bg-background text-text p-3 rounded-lg border border-white/10">
                      <span className="text-text">{p.title}</span>
                      {auth.currentUser?.uid === p.authorId && (
                      <div className="space-x-2">
                          <SecondaryButton onClick={() => startEdit(p)}>Edit</SecondaryButton>
                          <DangerButton onClick={() => handleDelete(p.id)}>Delete</DangerButton>
                      </div>
                      )}
                  </div>
              ))}
            </div>
        </div>
    </div>
  );
}
