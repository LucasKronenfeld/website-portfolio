// src/AdminLogin.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebaseConfig'; // Import the auth instance

export default function AdminLogin() {
  const [email, setEmail] = useState(''); // Added email state
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Use Firebase Authentication
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/admin/dashboard'); 
      
    } catch (err) {
      // Provide more specific error messages
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('Invalid email or password.');
      } else {
        setError('An error occurred during login.');
      }
      console.error("Firebase login error: ", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-accent text-text rounded-lg shadow">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold">Admin Login</h2>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col">
          <label htmlFor="email" className="mb-1 font-semibold">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="p-2 border border-contrast rounded"
            placeholder="Enter your email"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="password" className="mb-1 font-semibold">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="p-2 border border-contrast rounded"
          />
        </div>
        {error && <p className="text-red-600 text-center">{error}</p>}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2 bg-secondary text-white rounded hover:bg-darkback transition"
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <div className="text-center mt-6">
        <Link to="/" className="text-sm text-primary hover:underline">
          &larr; Back to Main Site
        </Link>
      </div>
    </div>
  );
}
