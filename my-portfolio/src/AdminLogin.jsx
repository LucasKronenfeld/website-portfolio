import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebaseConfig';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await userCredential.user.getIdToken();
      localStorage.setItem('authToken', idToken);
      navigate('/admin/dashboard');
    } catch (err) {
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('Invalid email or password.');
      } else {
        setError('An error occurred. Please try again.');
      }
      console.error("Firebase login error: ", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md p-8 space-y-8 bg-surface rounded-lg shadow-lg border border-white/10">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-text">Admin Portal</h2>
          <p className="text-muted">Please sign in to continue</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="text-sm font-medium text-text block mb-2">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 bg-background border border-white/20 rounded-lg text-text focus:ring-primary focus:border-primary"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="text-sm font-medium text-text block mb-2">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 bg-background border border-white/20 rounded-lg text-text focus:ring-primary focus:border-primary"
              placeholder="••••••••"
            />
          </div>
          {error && <p className="text-red-400 text-center text-sm">{error}</p>}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 bg-primary text-white rounded-lg font-semibold hover:bg-opacity-90 transition disabled:opacity-50"
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
        <div className="text-center">
          <Link to="/" className="text-sm text-muted hover:text-primary transition">
            &larr; Back to Main Site
          </Link>
        </div>
      </div>
    </div>
  );
}
