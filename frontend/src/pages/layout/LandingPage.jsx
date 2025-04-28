import React from 'react';
import { Link } from 'react-router';
import Header from './Header';
import Footer from './Footer';

function LandingPage() {
    return (
        <div className="min-h-screen bg-gradient-to-r from-teal-500 to-blue-600 flex flex-col justify-between">
            {/* Updated Header */}
            <Header />

            {/* Main Content */}
            <div className="container mx-auto text-center text-white mt-10">
                <h2 className="text-4xl font-bold mb-4">Welcome to MyApp</h2>
                <p className="text-lg mb-6">
                    A powerful platform for your data analytics journey. Sign in or sign up to get started.
                </p>
                <div className="space-x-4">
                    <Link to="/sign-in">
                        <button className="bg-teal-600 text-white py-2 px-6 rounded-lg hover:bg-teal-700">
                            Sign In
                        </button>
                    </Link>
                    <Link to="/sign-up">
                        <button className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700">
                            Sign Up
                        </button>
                    </Link>
                </div>
            </div>

            {/* Updated Footer */}
            <Footer />
        </div>
    );
}

export default LandingPage;
