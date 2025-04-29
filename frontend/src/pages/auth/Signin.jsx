import React, { useState } from 'react';
import { Link } from 'react-router';
import { useImmer } from 'use-immer';

function Signin() {
  const [formData, setFormData] = useImmer({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(draft => {
      draft[name] = value;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError('All fields are required!');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Please enter a valid email address!');
      return;
    }

    setError('');
    setLoading(true);

    // Simulating API call
    setTimeout(() => {
      console.log('Signin Form Submitted:', formData);
      setLoading(false);
      // Connect API here
    }, 2000);
  };

  return (
    <div className="flex flex-col">
    

      {/* Main Content */}
      <main className="flex flex-col flex-grow bg-gradient-to-r from-teal-500 to-blue-600 p-6">
        <div className="flex flex-grow items-center justify-center w-full">
          <div className="bg-white shadow-2xl rounded-2xl w-full max-w-sm p-8">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">Welcome Back!</h2>
            <p className="text-center text-gray-600 mb-6">Log in to continue your journey.</p>

            {error && <p className="text-red-500 text-center mb-4">{error}</p>}

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
                className={`w-full bg-gradient-to-r from-teal-500 to-blue-600 text-white font-bold py-3 rounded-lg focus:outline-none hover:bg-gradient-to-l hover:from-teal-600 hover:to-blue-700 shadow-md transition ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={loading}
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>

            <p className="text-center text-gray-600 mt-6">
              Don't have an account?{' '}
              <Link to="/sign-up" className="text-teal-500 hover:text-teal-600 font-semibold">
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
