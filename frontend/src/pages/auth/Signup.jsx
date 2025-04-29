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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(draft => {
      draft[name] = value;
    });
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

  // Handle form submission
  const handleSubmit = async (e) => {
    // Connect API here
    //setloading = true
    try {
      e.preventDefault();
      const { success, fieldErrors, genericErrors } = await signup({ username: formData.username, email: formData.email, password: formData.password })
      if (success) {
        console.log('Signup Form Submitted:', formData);
        navigate(PATHS.SIGNIN);
      }

      if (fieldErrors) {
        // then show individually at the end of the field or directly can show wrong credentials at the top of login form(so user won't get idea that what is wrong)
      }

      // so generic error like internal server errors, client error etc...
    } catch (error) {
      console.log(error);
    }
    finally {
      //setloading = false
    }
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
    <div className="bg-gradient-to-r from-teal-500 to-blue-600 flex items-center">

      <div className="bg-white shadow-lg rounded-xl w-full max-w-sm p-8 mx-auto">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-4">Create Your Account</h2>
        <p className="text-center text-gray-600 mb-6">Join us and unlock the possibilities!</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-lg border border-gray-300 bg-gray-50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-lg border border-gray-300 bg-gray-50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
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
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-3 text-gray-500"
            >
              {passwordVisible ? '👁️‍🗨️' : '👁️'}
            </button>
          </div>

          {/* Password Strength Indicator */}
          {formData.password && (
            <div className="text-sm mt-2">
              <span className={`${getPasswordStrengthColor(formData.password)}`}>
                {getPasswordStrength(formData.password)}
              </span>
            </div>
          )}

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-lg border border-gray-300 bg-gray-50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />

          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              name="termsAccepted"
              checked={formData.termsAccepted}
              onChange={handleCheckboxChange}
              required
              className="h-4 w-4 text-teal-500 focus:ring-teal-500"
            />
            <label className="ml-2 text-gray-600">
              I agree to the{' '}
              <Link to="/terms" className="text-teal-500 hover:text-teal-600">
                Terms and Conditions
              </Link>
            </label>
          </div>

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
            <Link to="/sign-in" className="text-teal-500 hover:text-teal-600 font-medium">
              Sign In
            </Link>
          </p>
        </form>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-lg relative">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">Reset Password</h3>

            <form onSubmit={handleResetSubmit} className="space-y-4">
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
                className="w-full bg-teal-500 hover:bg-teal-600 text-white py-3 rounded-lg shadow-md"
              >
                Send Reset Link
              </button>
            </form>

            {/* Close Modal Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-2 right-3 text-gray-400 hover:text-gray-600 text-2xl font-bold"
            >
              &times;
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

export default Signup;
