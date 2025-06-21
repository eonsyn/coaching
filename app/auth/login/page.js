'use client';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { FaEyeSlash } from "react-icons/fa";
import { FaEye } from "react-icons/fa"; 
 
function LoginPage() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
   

  // Handler for form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default browser form submission (page reload)

    // Basic input validation
    if (!email || !password) {
      toast.error('Please enter both email and password.', 'error');
      return;
    }

    setIsLoading(true); // Set loading state to true
    try {
      // Make a POST request to your login API route
      const res = await fetch('/api/userAuth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Specify content type as JSON
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include', // Include cookies in the request
      });

      const data = await res.json();
      if (res.ok) {
         setPassword('');
        setEmail(''); 
        toast.success(data.message || 'Login successful!');
        window.location.href = '/dashboard';
      } else {
         toast.error(data.message || 'Login failed. Please check your credentials.');
      }
    } catch (error) {
       console.error('Login error:', error);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false); // Always set loading state to false after the request
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-200">
  <div className="p-8 sm:p-10 w-full max-w-md bg-white rounded-2xl shadow-2xl transition-all duration-300 ease-in-out">
    <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-6">Welcome Back</h2>

    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Email Input */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email Address
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          required
          disabled={isLoading}
        />
      </div>

      {/* Password Input */}
      <div className="relative">
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <input
          type={showPassword ? 'text' : 'password'}
          id="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          required
          disabled={isLoading}
        />
        <div   
          className="absolute inset-y-0 right-3 top-10 text-gray-500 cursor-pointer"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3 text-white font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition flex items-center justify-center"
      >
        {isLoading ? (
          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : (
          'Login'
        )}
      </button>
    </form>

    {/* Optional Footer */}
    <p className="mt-6 text-center text-sm text-gray-500">
      Don’t have an account?{' '}
      <a href="/auth/signup" className="text-indigo-600 hover:text-indigo-700 font-medium">
        Sign up
      </a>
    </p>
  </div>
</div>

  );
}

export default LoginPage;
