import React, { useState } from 'react';
import { storage } from '../firebaseConfig';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

export default function ImageUpload({ currentUrl, onUploadComplete, folder = 'images', label = 'Upload Image' }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError('');

    try {
      // Create unique filename
      const timestamp = Date.now();
      const filename = `${timestamp}-${file.name}`;
      const storageRef = ref(storage, `${folder}/${filename}`);
      
      // Upload file
      await uploadBytes(storageRef, file);
      
      // Get download URL
      const downloadURL = await getDownloadURL(storageRef);
      onUploadComplete(downloadURL);
    } catch (err) {
      console.error('Upload error:', err);
      const code = err?.code ? ` (${err.code})` : '';
      setError('Error uploading image' + code + ': ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = async () => {
    if (!currentUrl) return;
    
    try {
      // Extract path from URL
      const urlObj = new URL(currentUrl);
      const path = decodeURIComponent(urlObj.pathname.split('/o/')[1].split('?')[0]);
      const storageRef = ref(storage, path);
      
      await deleteObject(storageRef);
      onUploadComplete('');
    } catch (err) {
      console.error('Delete error:', err);
      const code = err?.code ? ` (${err.code})` : '';
      setError('Error deleting image' + code + ': ' + err.message);
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-sm text-muted block">{label}</label>
      <div className="flex gap-2">
        <label className="flex-1">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
            className="block w-full text-sm text-muted file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-opacity-90 disabled:opacity-50"
          />
        </label>
        {currentUrl && (
          <button
            type="button"
            onClick={handleRemove}
            className="px-3 py-2 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition"
          >
            Remove
          </button>
        )}
      </div>
      
      {uploading && <p className="text-sm text-blue-400">Uploading...</p>}
      {error && <p className="text-sm text-red-400">{error}</p>}
      
      {currentUrl && (
        <div className="mt-2">
          <img src={currentUrl} alt="Preview" className="max-w-xs max-h-48 rounded border border-white/10 object-cover" />
        </div>
      )}
    </div>
  );
}
