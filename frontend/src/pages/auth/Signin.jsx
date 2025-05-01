import { signin } from '@/api';
import { Spinner1 } from '@/components';
import { PATHS, showGenericErrorAsToast } from '@/utils';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useImmer } from 'use-immer';

function Signin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useImmer({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(draft => {
      draft[name] = value;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    setIsLoading(true);
    try {
      if (!formData.email || !formData.password) {
        setError('All fields are required!');
        return;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setError('Please enter a valid email address!');
        return;
      }

      const { success, fieldErrors, genericErrors } = await signin({ email: formData.email, password: formData.password });
      if (success) {
        navigate(PATHS.DASHBOARD);
        toast.success("You're in! Let's get started.", TOAST_OPTIONS);

        setFormData(draft => {
          draft.email = '';
          draft.password = '';
        });

        setError('');
        return;
      }

      if (fieldErrors && fieldErrors.credentials) {
        setError(fieldErrors.credentials);
      }
      showGenericErrorAsToast(genericErrors);
    } catch (error) {
      console.log(error);
    }
    finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col">

      {/* Main Content */}
      <main className="flex flex-col flex-grow bg-gradient-to-r from-teal-500 to-blue-600 p-6">
        <div className="flex flex-grow items-center justify-center w-full">
          <div className="bg-white shadow-2xl rounded-2xl w-full max-w-sm p-8">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">Welcome Back!</h2>
            <p className="text-center text-gray-600 mb-6">Log in to continue your journey.</p>

            {error && <p className="text-red-500 text-center mb-4 border-red-400 bg-red-50 border-1 py-2 rounded-[3px]">{error}</p>}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-gray-700 font-semibold mb-1">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full p-3 rounded-lg border border-gray-300 bg-gray-50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-gray-700 font-semibold mb-1">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full p-3 rounded-lg border border-gray-300 bg-gray-50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full text-white font-bold py-3 rounded-lg focus:outline-none shadow-md transition flex justify-center
                  ${isLoading
                    ? 'bg-gradient-to-r from-teal-500 to-blue-600 opacity-50 cursor-not-allowed'
                    : 'bg-gradient-to-r from-teal-500 to-blue-600 hover:bg-gradient-to-l hover:from-teal-600 hover:to-blue-700 cursor-pointer'
                  }`}
              >
                {isLoading ? <Spinner1 /> : 'Sign In'}
              </button>


            </form>

            <p className="text-center text-gray-600 mt-6">
              Don't have an account?{' '}
              <Link to={PATHS.SIGNUP} className="text-teal-500 hover:text-teal-600 font-semibold">
                Sign Up
              </Link>
            </p>
          </div>

        </div>
      </main>
    </div>
  );
}

export default Signin;
