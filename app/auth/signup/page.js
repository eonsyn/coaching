'use client';
import { useState, useRef } from 'react';
import { toast } from 'react-toastify';
import { FaEyeSlash } from "react-icons/fa";
import { FaEye } from "react-icons/fa"; 
import Link from 'next/link';
// Function to generate a strong random password
const generateStrongPassword = (length = 16) => {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=";
  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  return password;
};

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, useStatePassword] = useState('');
  const [otpSent, setOtpSent] = useState(false); // New state to control OTP input visibility
  const [otpDigits, setOtpDigits] = useState(Array(6).fill('')); // Array for 6 OTP digits
  const [isLoading, setIsLoading] = useState(false); // New state for loading indicator
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  // Refs for OTP input fields to manage focus
  const otpInputRefs = useRef([]);

  // Custom message box function
  const showMessageBox = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 3000); // Message disappears after 3 seconds
  };

 
  const handleSignup = async () => {
    if (!username || !email || !password) {
      toast.error('Please fill in all fields.', 'error');
      return;
    }

    setIsLoading(true); // Show loading indicator
    try {
      const res = await fetch('/api/userAuth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        setOtpSent(true); // Show OTP input
        toast.success(data.message || 'OTP sent to your email!', 'success');
        // Focus the first OTP input after it renders
        setTimeout(() => {
          if (otpInputRefs.current[0]) {
            otpInputRefs.current[0].focus();
          }
        }, 100);
      } else {
        toast.error(data.message || 'Signup failed.', 'error');
      }
    } catch (error) {
      console.error('Signup error:', error);
      toast.error('An error occurred during signup.', 'error');
    } finally {
      setIsLoading(false); // Hide loading indicator
    }
  };

  const handleVerifyOtp = async () => {
    const otp = otpDigits.join(''); // Combine OTP digits into a single string
    if (otp.length !== 6) {
      toast.error('Please enter the complete 6-digit OTP.', 'error');
      return;
    }

    setIsLoading(true); // Show loading indicator
    try {
      const res = await fetch('/api/userAuth/signup/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Signup successful! You can now log in.", 'success');
        // You might want to redirect the user here, e.g., to a login page
        window.location.href = '/auth/login';
      } else {
        toast.error(data.message || 'OTP verification failed.', 'error');
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      toast.error('An error occurred during OTP verification.', 'error');
    } finally {
      setIsLoading(false); // Hide loading indicator
    }
  };

  const handleOtpInputChange = (e, index) => {
    const { value } = e.target;
    // Allow only one digit per input field
    if (!/^\d*$/.test(value)) { // Only allow digits
        return;
    }

    const newOtpDigits = [...otpDigits];
    newOtpDigits[index] = value.slice(-1); // Take only the last character if multiple are typed
    setOtpDigits(newOtpDigits);

    // Auto-focus to the next input field
    if (value && index < 5 && otpInputRefs.current[index + 1]) {
      otpInputRefs.current[index + 1].focus();
    }
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      // If backspace is pressed on an empty field, move focus to the previous field
      otpInputRefs.current[index - 1].focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData('text');
    const digits = paste.replace(/\D/g, '').slice(0, 6).split(''); // Extract up to 6 digits

    const newOtpDigits = Array(6).fill('');
    digits.forEach((digit, i) => {
      newOtpDigits[i] = digit;
    });
    setOtpDigits(newOtpDigits);

    // Focus the last filled input or the last input if all 6 are filled
    const lastFilledIndex = Math.min(digits.length - 1, 5);
    if (otpInputRefs.current[lastFilledIndex]) {
        otpInputRefs.current[lastFilledIndex].focus();
    }
  };

  return (
<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-light to-background px-4">
  <div className="p-8 sm:p-10 w-full max-w-md bg-card-bg text-foreground rounded-2xl shadow-2xl border border-border-color transition-all duration-300 ease-in-out font-puritan">
    
    <h2 className="text-3xl font-extrabold text-center text-primary mb-6">
      Create Account
    </h2>

    {!otpSent ? (
      <>
        {/* Signup Inputs */}
        <div className="space-y-5 text-textprimary">
          {/* Username */}
          <input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-3 border border-border-color bg-input-bg rounded-lg text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary"
            disabled={isLoading}
          />

          {/* Email */}
          <input
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-border-color bg-input-bg rounded-lg text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary"
            disabled={isLoading}
          />

          {/* Password */}
          <div className="relative">
            <input
              id="new-password"
              placeholder="Password"
              value={password}
              type={showPassword ? 'text' : 'password'}
              onChange={(e) => useStatePassword(e.target.value)}
              className="w-full px-4 py-3 pr-12 border border-border-color bg-input-bg rounded-lg text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary"
              autoComplete="new-password"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-3 flex items-center text-muted"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              disabled={isLoading}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>

        {/* Send OTP Button */}
        <button
          onClick={handleSignup}
          className="mt-6 w-full bg-primary text-white font-semibold py-3 rounded-lg hover:bg-indigo-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-primary flex justify-center"
          disabled={isLoading}
        >
          {isLoading ? (
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8..." />
            </svg>
          ) : (
            'Send OTP & Sign Up'
          )}
        </button>
      </>
    ) : (
      <>
        {/* OTP Section */}
        <p className="text-center text-muted mb-4">Enter the 6-digit OTP sent to your email</p>

        <div className="flex justify-center space-x-2 mb-6">
          {otpDigits.map((digit, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleOtpInputChange(e, index)}
              onKeyDown={(e) => handleOtpKeyDown(e, index)}
              onPaste={index === 0 ? handleOtpPaste : undefined}
              ref={(el) => (otpInputRefs.current[index] = el)}
              className="w-10 h-12 text-center text-xl font-semibold border border-border-color text-foreground bg-input-bg rounded-lg focus:outline-none focus:ring-2 focus:ring-success"
              inputMode="numeric"
              pattern="[0-9]*"
              disabled={isLoading}
            />
          ))}
        </div>

        {/* Verify OTP */}
        <button
          onClick={handleVerifyOtp}
          className="w-full bg-success text-white font-semibold py-3 rounded-lg hover:bg-green-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-success flex justify-center"
          disabled={isLoading}
        >
          {isLoading ? (
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8..." />
            </svg>
          ) : (
            'Verify & Sign Up'
          )}
        </button>
      </>
    )}

    {/* Footer */}
    <p className="mt-6 text-center text-sm text-muted">
      Have an account?{' '}
      <Link href="/auth/login" className="text-accent hover:text-primary font-medium transition">
        Login
      </Link>
    </p>
  </div>
</div>



  );
}
