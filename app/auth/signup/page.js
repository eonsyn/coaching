'use client';
import { useState, useRef } from 'react';

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

  const handleGeneratePassword = () => {
    const newPassword = generateStrongPassword();
    useStatePassword(newPassword);
    showMessageBox('Password generated successfully!', 'success');
  };

  const handleSignup = async () => {
    if (!username || !email || !password) {
      showMessageBox('Please fill in all fields.', 'error');
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
        showMessageBox(data.message || 'OTP sent to your email!', 'success');
        // Focus the first OTP input after it renders
        setTimeout(() => {
          if (otpInputRefs.current[0]) {
            otpInputRefs.current[0].focus();
          }
        }, 100);
      } else {
        showMessageBox(data.message || 'Signup failed.', 'error');
      }
    } catch (error) {
      console.error('Signup error:', error);
      showMessageBox('An error occurred during signup.', 'error');
    } finally {
      setIsLoading(false); // Hide loading indicator
    }
  };

  const handleVerifyOtp = async () => {
    const otp = otpDigits.join(''); // Combine OTP digits into a single string
    if (otp.length !== 6) {
      showMessageBox('Please enter the complete 6-digit OTP.', 'error');
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
        showMessageBox("Signup successful! You can now log in.", 'success');
        // You might want to redirect the user here, e.g., to a login page
        // window.location.href = '/login';
      } else {
        showMessageBox(data.message || 'OTP verification failed.', 'error');
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      showMessageBox('An error occurred during OTP verification.', 'error');
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
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-lg mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Sign Up</h2>

      {message && (
        <div className={`mb-4 p-3 rounded-lg text-white text-center ${messageType === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
          {message}
        </div>
      )}

      {/* Input fields for Username, Email, Password */}
      {!otpSent && (
        <>
          <input
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            className="w-full mb-4 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          <input
            placeholder="Email"
            value={email}
            type="email"
            onChange={e => setEmail(e.target.value)}
            className="w-full mb-4 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          <div className="relative mb-6">
            <input
              id="new-password" // Added for better browser recognition
              placeholder="Password"
              value={password}
              type={showPassword ? "text" : "password"} // Toggle type based on state
              onChange={e => useStatePassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoComplete="new-password" // Crucial for browser suggestions
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 focus:outline-none"
              aria-label={showPassword ? "Hide password" : "Show password"}
              disabled={isLoading}
            >
              {/* Eye icon for show/hide password */}
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {showPassword ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.97 0-9.23-3.665-11.396-8.928a.5.5 0 01-.008-.144C.247 9.842.274 9.537.33 9.243c.09-.48.24-.925.437-1.332M13.875 18.825L18.825 13.875m-5.95-5.95l5.95 5.95M12 19c-1.896 0-3.684-.664-5.074-1.782" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                )}
                {!showPassword && (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                )}
              </svg>
            </button>
            {/* <button
              type="button"
              onClick={handleGeneratePassword}
              className="absolute bottom-1 right-16 px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
              disabled={isLoading}
            >
              Generate
            </button> */}
          </div>
          <button
            onClick={handleSignup}
            className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading} // Disable button when loading
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5 text-white mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              'Send OTP & Sign Up'
            )}
          </button>
        </>
      )}

      {/* OTP Input and Verify button - conditionally rendered */}
      {otpSent && (
        <>
          <p className="text-center text-gray-600 mb-4">Please enter the 6-digit OTP sent to your email.</p>
          <div className="flex justify-center space-x-2 mb-6">
            {otpDigits.map((digit, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleOtpInputChange(e, index)}
                onKeyDown={(e) => handleOtpKeyDown(e, index)}
                onPaste={index === 0 ? handleOtpPaste : undefined} // Only allow paste on the first input
                ref={(el) => (otpInputRefs.current[index] = el)}
                className="w-10 h-10 text-center text-xl font-bold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                inputMode="numeric" // Optimize for numeric input on mobile
                pattern="[0-9]*" // Hint for mobile keyboards
                disabled={isLoading}
              />
            ))}
          </div>
          <button
            onClick={handleVerifyOtp}
            className="w-full bg-green-600 text-white font-semibold py-3 rounded-lg hover:bg-green-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-green-500"
            disabled={isLoading}
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5 text-white mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              'Verify & Sign Up'
            )}
          </button>
        </>
      )}
    </div>
  );
}
