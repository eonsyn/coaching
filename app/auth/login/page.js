'use client';
import React, { useState } from 'react';

// Main Login Page Component
function LoginPage() {
  // State variables for email, password, loading status, and messages
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Controls loading spinner
  const [message, setMessage] = useState('');      // Displays user messages
  const [messageType, setMessageType] = useState(''); // 'success' or 'error' for styling

  // Custom message box function to display feedback to the user
  const showMessageBox = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
    // Clear the message after 3 seconds
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 3000);
  };

  // Handler for form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default browser form submission (page reload)

    // Basic input validation
    if (!email || !password) {
      showMessageBox('Please enter both email and password.', 'error');
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
        body: JSON.stringify({ email, password }), // Send email and password as JSON
      });

      const data = await res.json(); // Parse the JSON response from the API

      if (res.ok) { // Check if the HTTP status code is in the 200s (success)
        showMessageBox(data.message || 'Login successful!', 'success');
        // Here you would typically redirect the user or update application state
        // Example: window.location.href = '/dashboard';
      } else {
        // Handle API errors (e.g., incorrect credentials)
        showMessageBox(data.message || 'Login failed. Please check your credentials.', 'error');
      }
    } catch (error) {
      // Handle network errors or other unexpected issues
      console.error('Login error:', error);
      showMessageBox('An unexpected error occurred. Please try again.', 'error');
    } finally {
      setIsLoading(false); // Always set loading state to false after the request
    }
  };

  return (
    <div className="p-6 max-w-sm mx-auto bg-white rounded-xl shadow-lg mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Login</h2>

      {/* Message box for user feedback */}
      {message && (
        <div className={`mb-4 p-3 rounded-lg text-white text-center ${messageType === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
          {message}
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 text-sm font-semibold mb-2">Email</label>
          <input
            type="email"
            id="email" // Link label to input via ID
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            name="email"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required // HTML5 validation for required field
            disabled={isLoading} // Disable input when loading
          />
        </div>

        <div className="mb-6">
          <label htmlFor="password" className="block text-gray-700 text-sm font-semibold mb-2">Password</label>
          <input
            type="password" // Keeps password hidden
            id="password" // Link label to input via ID
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            name="password"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required // HTML5 validation for required field
            disabled={isLoading} // Disable input when loading
          />
        </div>

        {/* Login Button with Loading Spinner */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-center"
          disabled={isLoading} // Disable button when loading
        >
          {isLoading ? (
            // Simple loading spinner SVG
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            'Login'
          )}
        </button>
      </form>
    </div>
  );
}

export default LoginPage;
