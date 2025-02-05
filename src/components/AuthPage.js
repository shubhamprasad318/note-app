'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function AuthPage({ isRegister = false }) {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const url = isRegister
        ? `${process.env.NEXT_PUBLIC_API_URL}/register`
        : `${process.env.NEXT_PUBLIC_API_URL}/login`;
      const res = await axios.post(url, formData, { withCredentials: true });
      localStorage.setItem('token', res.data.token);
      router.push('/');
    } catch (error) {
      setError(error.response?.data?.error || 'An error occurred');
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">{isRegister ? 'Register' : 'Login'}</h1>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        {isRegister && (
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            className="border p-2 w-full"
            required
          />
        )}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="border p-2 w-full"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="border p-2 w-full"
          required
        />
        <button type="submit" className="bg-blue-500 text-white p-2 w-full">
          {isRegister ? 'Register' : 'Login'}
        </button>
      </form>
      <p className="mt-4">
        {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
        <a href={isRegister ? '/login' : '/register'} className="text-blue-500">
          {isRegister ? 'Login' : 'Register'}
        </a>
      </p>
    </div>
  );
}
