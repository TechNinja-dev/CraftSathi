import React, { useState } from 'react'
import { Navigate, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../../context/authcontext'
import { doCreateUserWithEmailAndPassword } from '../../../firebase/auth'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFeatherPointed } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const Register = () => {
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [isRegistering, setIsRegistering] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const { userLoggedIn } = useAuth()

    const onSubmit = async (e) => {
        e.preventDefault()
        if (!isRegistering) {
            setIsRegistering(true)
            try {
                if (password !== confirmPassword) {
                    setErrorMessage("Passwords don't match")
                    setIsRegistering(false)
                    return
                }
                const userCredential = await doCreateUserWithEmailAndPassword(email, password)
                const user = userCredential.user;
                
                // Send user data to FastAPI backend
                try {
                    await axios.post('/api/auth/register', {
                        uid: user.uid,
                        email: user.email,
                        displayName: user.displayName || '',
                        photoURL: user.photoURL || '',
                        emailVerified: user.emailVerified
                    });
                } catch (apiError) {
                    console.error('Failed to send user data to backend:', apiError);
                    // Continue with registration even if backend call fails
                }
            } catch (error) {
                setErrorMessage(error.message)
                setIsRegistering(false)
            }
        }
    }

    return (
        <div className='min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-900 via-black to-black text-white font-sans p-4'>
            <div className="w-full max-w-xs p-6 space-y-4 bg-white rounded-xl shadow-lg transform transition-all duration-300 hover:shadow-xl mx-auto">
                <div className="text-center">
                    <div className="flex justify-center mb-4">
                        <FontAwesomeIcon 
                            icon={faFeatherPointed} 
                            className="text-blue-600 text-3xl animate-spin"
                            flip
                        />
                    </div>
                    <h2 className="mt-4 text-2xl font-bold text-gray-900 animate-fade-in">
                        Create your account
                    </h2>
                    <p className="mt-1 text-xs text-gray-600">
                        Join our community today
                    </p>
                </div>
                {userLoggedIn && (<Navigate to={'/home'} replace={true} />)}
                
                <form onSubmit={onSubmit} className="mt-4 space-y-3">
                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            autoComplete="email"
                            required
                            value={email} 
                            onChange={(e) => { setEmail(e.target.value) }}
                            className="w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-xs transition duration-300"
                            placeholder="Enter your email"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <input
                            disabled={isRegistering}
                            type="password"
                            autoComplete="new-password"
                            required
                            value={password} 
                            onChange={(e) => { setPassword(e.target.value) }}
                            className="w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-xs transition duration-300"
                            placeholder="Create a password"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                            Confirm Password
                        </label>
                        <input
                            disabled={isRegistering}
                            type="password"
                            autoComplete="off"
                            required
                            value={confirmPassword} 
                            onChange={(e) => { setConfirmPassword(e.target.value) }}
                            className="w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-xs transition duration-300"
                            placeholder="Confirm your password"
                        />
                    </div>
                    
                    {errorMessage && (
                        <div className="rounded-md bg-red-50 p-2">
                            <div className="text-xs text-red-700">{errorMessage}</div>
                        </div>
                    )}
                    
                    <button
                        type="submit"
                        disabled={isRegistering}
                        className={`w-full px-3 py-2 text-white font-medium rounded-md focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-blue-500 transition-colors duration-200 shadow ${
                            isRegistering 
                                ? 'bg-gray-400 cursor-not-allowed' 
                                : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                    >
                        {isRegistering ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-1 h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Signing Up...
                            </span>
                        ) : 'Sign Up'}
                    </button>
                    
                    <div className="text-center pt-3">
                        <div className="text-xs text-gray-600">
                            Already have an account? {' '}
                            <Link to="/login" className="text-blue-600 hover:text-blue-500">
                                Sign in
                            </Link>
                        </div>
                    </div>
                </form>
                
                <div className="text-center mt-4">
                    <p className="text-xs text-gray-500">© 2023 Your Company. All rights reserved.</p>
                </div>
            </div>
        </div>
    )
}

export default Register