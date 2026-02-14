import React, { useState } from 'react';
import { storage } from '../firebaseConfig';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { XMarkIcon } from '@heroicons/react/24/outline';

export default function MultiImageUpload({ images = [], onImagesChange, folder = 'images', label = 'Upload Images' }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setUploading(true);
    setError('');

    try {
      const uploadPromises = files.map(async (file) => {
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(7);
        const filename = `${timestamp}-${random}-${file.name}`;
        const storageRef = ref(storage, `${folder}/${filename}`);
        
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);
        return downloadURL;
      });

      const urls = await Promise.all(uploadPromises);
      onImagesChange([...images, ...urls]);
    } catch (err) {
      console.error('Upload error:', err);
      const code = err?.code ? ` (${err.code})` : '';
      setError('Error uploading images' + code + ': ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = async (urlToRemove) => {
    try {
      // Extract path from URL
      const urlObj = new URL(urlToRemove);
      const path = decodeURIComponent(urlObj.pathname.split('/o/')[1].split('?')[0]);
      const storageRef = ref(storage, path);
      
      await deleteObject(storageRef);
      onImagesChange(images.filter(url => url !== urlToRemove));
    } catch (err) {
      console.error('Delete error:', err);
      const code = err?.code ? ` (${err.code})` : '';
      setError('Error deleting image' + code + ': ' + err.message);
    }
  };

  return (
    <div className="space-y-3">
      <label className="text-sm text-muted block">{label}</label>
      <div>
        <label className="block">
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            disabled={uploading}
            className="block w-full text-sm text-muted file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-opacity-90 disabled:opacity-50"
          />
        </label>
      </div>
      
      {uploading && <p className="text-sm text-blue-400">Uploading images...</p>}
      {error && <p className="text-sm text-red-400">{error}</p>}
      
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mt-3">
          {images.map((url, index) => (
            <div key={url} className="relative group">
              <img 
                src={url} 
                alt={`Gallery ${index + 1}`} 
                className="w-full h-32 object-cover rounded border border-white/10"
              />
              <button
                type="button"
                onClick={() => handleRemove(url)}
                className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
