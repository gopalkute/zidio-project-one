import { signup } from '@/api';
import { PATHS } from '@/utils';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useImmer } from 'use-immer';

function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useImmer({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    termsAccepted: false,
  });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [errors, setErrors] = useState({
    passwordMismatch: '',
    emailExists: '',
  });

  // Mock existing emails
  const existingEmails = ['test@example.com', 'user@example.com'];

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData(draft => {
      draft[name] = type === 'checkbox' ? checked : value;
    });

    if (name === 'password' || name === 'confirmPassword') {
      setErrors((prev) => ({ ...prev, passwordMismatch: '' }));
    }
    if (name === 'email') {
      setErrors((prev) => ({ ...prev, emailExists: '' }));
    }
  };

  // togle checkbox change
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData(draft => {
      draft[name] = checked;
    });
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setPasswordVisible(prev => !prev);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(prev => !prev);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    // Connect API here
    //setloading = true
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        passwordMismatch: 'Passwords do not match',
      }));
      return;
    }

    if (existingEmails.includes(formData.email)) {
      setErrors((prev) => ({
        ...prev,
        emailExists: 'Account with this email already exists',
      }));
      return;
    }

    console.log('Signup Form Submitted:', formData);

    setFormData({
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      termsAccepted: false,
    });
  };

  // Password strength validation
  const getPasswordStrength = (password) => {
    if (password.length < 6) return 'Weak';
    if (password.length < 10) return 'Moderate';
    return 'Strong';
  };

  const getPasswordStrengthColor = (password) => {
    if (password.length < 6) return 'text-red-500';
    if (password.length < 10) return 'text-yellow-500';
    return 'text-green-500';
  };

  // Handle Reset Password Submit
  const handleResetSubmit = (e) => {
    e.preventDefault();
    console.log('Reset link sent to:', resetEmail);
    // After sending reset link, close modal
    setTimeout(() => {
      setIsModalOpen(false);
      setResetEmail('');
    }, 1000); // Add little delay for better UX
  };


  return (
    <div className="min-h-screen bg-gradient-to-r from-teal-500 to-blue-600 flex flex-col">

      <div className="relative bg-white shadow-lg rounded-2xl w-full max-w-md p-8 mx-auto mt-10">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-4">Create Your Account</h2>
        <p className="text-center text-gray-600 mb-6">Join us and unlock the possibilities!</p>
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Username */}
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-lg border border-gray-300 bg-gray-50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />

          {/* Email */}
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-lg border border-gray-300 bg-gray-50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          {errors.emailExists && (
            <p className="text-red-500 text-sm">{errors.emailExists}</p>
          )}

          {/* Password */}
          <div className="relative">
            <input
              type={passwordVisible ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-lg border border-gray-300 bg-gray-50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            {formData.password && (
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-3 text-gray-500 text-xl"
              >
                {passwordVisible ? '🙈' : '👁️'}
              </button>
            )}
          </div>

          {/* Password Strength Indicator */}
          {formData.password && (
            <div className="text-sm mt-1">
              <span className={`${getPasswordStrengthColor(formData.password)}`}>
                {getPasswordStrength(formData.password)}
              </span>
            </div>
          )}

          {/* Confirm Password */}
          <div className="relative">
            <input
              type={confirmPasswordVisible ? 'text' : 'password'}
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="w-full pl-3 p-3 pr-12 rounded-lg border border-gray-300 bg-gray-50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            {formData.confirmPassword && (
              <button
                type="button"
                onClick={toggleConfirmPasswordVisibility}
                className="absolute right-3 top-3 text-gray-500 text-xl"
              >
                {confirmPasswordVisible ? '🙈' : '👁️'}
              </button>
            )}
          </div>
          {errors.passwordMismatch && (
            <p className="text-red-500 text-sm">{errors.passwordMismatch}</p>
          )}

          {/* Terms */}
          <div className="flex items-start gap-2 text-sm text-gray-600">
            <input
              type="checkbox"
              name="termsAccepted"
              checked={formData.termsAccepted}
              onChange={handleCheckboxChange}
              required
              className="h-4 w-4 text-teal-500 focus:ring-teal-500 mt-1"
            />
            <label>
              I agree to the{' '}
              <Link to={PATHS.TERMS_OF_SERVICES} className="text-teal-500 hover:text-teal-600 underline">
                Terms and Conditions
              </Link>
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-teal-500 to-blue-600 text-white font-semibold py-3 rounded-lg focus:outline-none hover:bg-gradient-to-l hover:from-teal-600 hover:to-blue-700 cursor-pointer shadow-md"
          >
            Sign Up
          </button>

          {/* Forgot Password */}
          <div className="text-center mt-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="text-sm text-teal-500 hover:underline"
            >
              Forgot Password?
            </button>
          </div>

          {/* Already have account */}
          <p className="text-center text-gray-600 text-sm mt-4">
            Already have an account?{' '}
            <Link to={PATHS.SIGNIN} className="text-teal-500 hover:text-teal-600 font-medium">
              Sign In
            </Link>
          </p>
        </form>
      </div>


      {/* Reset Password Modal */}
      {
        isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative">
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-3 right-4 text-gray-400 hover:text-gray-600 text-2xl font-bold"
              >
                &times;
              </button>

              <h3 className="text-2xl font-bold text-center text-gray-800 mb-6">Reset Password</h3>

              <form onSubmit={handleResetSubmit} className="space-y-5">
                <input
                  type="email"
                  placeholder="Enter your registered email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  required
                  className="w-full p-3 rounded-lg border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <button
                  type="submit"
                  className="w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold py-3 rounded-lg shadow-md"
                >
                  Send Reset Link
                </button>
              </form>
            </div>
          </div>
        )
      }

    </div>
  );
}

export default Signup;
