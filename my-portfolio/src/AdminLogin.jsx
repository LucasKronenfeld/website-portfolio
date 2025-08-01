// src/AdminLogin.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate(); // 2. Initialize the navigate function

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed.');
      }
      
      // On success, store the token
      localStorage.setItem('authToken', data.token);
      
      // 3. Navigate to the dashboard
      navigate('/admin/dashboard'); 
      
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-accent text-text rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">Admin Login</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
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
        {error && <p className="text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2 bg-secondary text-white rounded hover:bg-darkback transition"
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}