'use client';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { FaEyeSlash } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import Link from 'next/link';

function LoginPage() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState('student'); // 'student' or 'teacher'


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
        body: JSON.stringify({ email, password, role }),
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-light to-background px-4">
      <div className="w-full max-w-md p-6 sm:p-10 bg-card-bg text-foreground rounded-2xl shadow-xl border border-border-color font-puritan transition-all duration-300">

        {/* Heading */}
        <h2 className="text-3xl sm:text-4xl font-extrabold text-center text-primary mb-6">
          Welcome Back
        </h2>

        {/* Role Selector */}
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full px-4 py-3 border border-border-color bg-input-bg rounded-lg text-foreground mb-4"
          disabled={isLoading}
        >
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
        </select>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-semibold mb-1 text-foreground">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              disabled={isLoading}
              className="w-full px-4 py-3 border border-border-color bg-input-bg text-foreground placeholder:text-muted rounded-lg focus:ring-2 focus:ring-primary focus:outline-none transition"
            />
          </div>

          {/* Password Field */}
          <div className="relative">
            <label htmlFor="password" className="block text-sm font-semibold mb-1 text-foreground">
              Password
            </label>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={isLoading}
              className="w-full px-4 py-3 pr-12 border border-border-color bg-input-bg text-foreground placeholder:text-muted rounded-lg focus:ring-2 focus:ring-primary focus:outline-none transition"
            />
            <div
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-10 right-3 text-muted cursor-pointer"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </div>
          </div>
          <div className='flex justify-end'>
            <Link href={`/auth/forgot-password?role=${role}`} >
            <p className='underline   cursor-pointer'>forgot password ?</p>
            </Link>
            
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 flex items-center justify-center bg-primary text-white font-semibold rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-primary transition"
          >
            {isLoading ? (
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
            ) : (
              'Login'
            )}
          </button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-muted">
          Don’t have an account?{' '}
          <a href="/auth/signup" className="text-accent hover:text-primary font-medium transition">
            Sign up
          </a>
          
        </p>
      </div>
    </div>



  );
}

export default LoginPage;
