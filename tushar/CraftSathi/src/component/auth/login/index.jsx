import React, { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { doSignInWithEmailAndPassword, doSignInWithGoogle } from '../../../firebase/auth';
import { useAuth } from '../../../context/authcontext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFeatherPointed } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const Login = () => {
    const { userLoggedIn } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSigningIn, setIsSigningIn] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!isSigningIn) {
            setIsSigningIn(true);
            try {
                const userCredential = await doSignInWithEmailAndPassword(email, password);
                const user = userCredential.user;
                
                // Send user data to FastAPI backend
                try {
                    await axios.post('/api/auth/login', {
                        uid: user.uid,
                        email: user.email,
                        displayName: user.displayName || '',
                        photoURL: user.photoURL || '',
                        emailVerified: user.emailVerified
                    });
                } catch (apiError) {
                    console.error('Failed to send user data to backend:', apiError);
                    // Continue with login even if backend call fails
                }
            } catch (error) {
                setErrorMessage(error.message);
                setIsSigningIn(false);
            }
        }
    };

    const onGoogleSignIn = (e) => {
        e.preventDefault();
        if (!isSigningIn) {
            setIsSigningIn(true);
            doSignInWithGoogle()
                .then((result) => {
                    const user = result.user;
                    
                    // Send user data to FastAPI backend
                    return axios.post('/api/auth/login', {
                        uid: user.uid,
                        email: user.email,
                        displayName: user.displayName || '',
                        photoURL: user.photoURL || '',
                        emailVerified: user.emailVerified
                    });
                })
                .catch(err => {
                    setErrorMessage(err.message);
                    setIsSigningIn(false);
                });
        }
    };

    return (
        <div className='min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-900 via-black to-black text-white font-sans p-4'>
            <div className="w-full max-w-xs p-6 space-y-4 bg-white rounded-xl shadow-lg transform transition-all duration-300 hover:shadow-xl mx-auto">
                <div className="text-center">
                    <div className="flex justify-center mb-4">
                        <FontAwesomeIcon 
                            icon={faFeatherPointed} 
                            className="text-blue-600 text-3xl animate-bounce"
                            flip
                        />
                    </div>
                    <h2 className="mt-4 text-2xl font-bold text-gray-900 animate-fade-in">
                        Welcome back
                    </h2>
                    <p className="mt-1 text-xs text-gray-600">
                        Sign in to your account
                    </p>
                </div>
                {userLoggedIn && (<Navigate to={'/home'} replace={true} />)}
                <form className="mt-4 space-y-3" onSubmit={onSubmit}>
                    {errorMessage && (
                        <div className="rounded-md bg-red-50 p-2 text-xs">
                            <div className="text-red-700">{errorMessage}</div>
                        </div>
                    )}
                    <div className="space-y-2">
                        <div>
                            <label htmlFor="email-address" className="block text-xs font-medium text-gray-700 mb-1">
                                Email
                            </label>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-xs"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-xs font-medium text-gray-700 mb-1">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-xs"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                name="remember-me"
                                type="checkbox"
                                className="h-3 w-3 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label htmlFor="remember-me" className="ml-1 block text-xs text-gray-900">
                                Remember me
                            </label>
                        </div>

                        <div className="text-xs">
                            <a href="#" className="text-blue-600 hover:text-blue-500">
                                Forgot password?
                            </a>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isSigningIn}
                            className="group relative w-full flex justify-center py-2 px-3 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-blue-500 transition-colors duration-200 shadow"
                        >
                            {isSigningIn ? (
                                <span className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-1 h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Signing in...
                                </span>
                            ) : 'Login'}
                        </button>
                    </div>
                    
                    <div className="mt-3">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300" />
                            </div>
                            <div className="relative flex justify-center text-xs">
                                <span className="px-1 bg-gray-50 text-gray-500">Or continue with</span>
                            </div>
                        </div>
                        <div className="mt-3">
                            <button
                                onClick={onGoogleSignIn}
                                disabled={isSigningIn}
                                className="w-full inline-flex justify-center items-center py-2 px-3 border border-gray-300 rounded-md shadow-sm bg-white text-xs font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-gray-500 transition-colors duration-200"
                            >
                                <svg className="w-4 h-4 mr-1" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <g clipPath="url(#clip0_17_40)">
                                        <path d="M47.532 24.5528C47.532 22.9214 47.3997 21.2811 47.1175 19.6761H24.48V28.9181H37.4434C36.9055 31.8988 35.177 34.5356 32.6461 36.2111V42.2078H40.3801C44.9217 38.0278 47.532 31.8547 47.532 24.5528Z" fill="#4285F4" />
                                        <path d="M24.48 48.0016C30.9529 48.0016 36.4116 45.8764 40.3888 42.2078L32.6549 36.2111C30.5031 37.675 27.7252 38.5039 24.4888 38.5039C18.2275 38.5039 12.9187 34.2798 11.0139 28.6006H3.03296V34.7825C7.10718 42.8868 15.4056 48.0016 24.48 48.0016Z" fill="#34A853" />
                                        <path d="M11.0051 28.6006C9.99973 25.6199 9.99973 22.3922 11.0051 19.4115V13.2296H3.03298C-0.371021 20.0112 -0.371021 28.0009 3.03298 34.7825L11.0051 28.6006Z" fill="#FBBC04" />
                                        <path d="M24.48 9.49932C27.9016 9.44641 31.2086 10.7339 33.6866 13.0973L40.5387 6.24523C36.2 2.17101 30.4414 -0.068932 24.48 0.00161733C15.4055 0.00161733 7.10718 5.11644 3.03296 13.2296L11.005 19.4115C12.901 13.7235 18.2187 9.49932 24.48 9.49932Z" fill="#EA4335" />
                                    </g>
                                    <defs>
                                        <clipPath id="clip0_17_40">
                                            <rect width="48" height="48" fill="white" />
                                        </clipPath>
                                    </defs>
                                </svg>
                                Continue with Google
                            </button>
                        </div>
                    </div>
                    
                    <div className="text-center mt-3">
                        <div className="text-xs text-gray-600">
                            Not a member?{' '}
                            <Link to="/register" className="text-blue-600 hover:text-blue-500">
                                Create an account
                            </Link>
                        </div>
                    </div>
                </form>
                
                <div className="text-center mt-4">
                    <p className="text-xs text-gray-500">© 2023 Your Company. All rights reserved.</p>
                </div>
            </div>
        </div>
    );
};

export default Login;