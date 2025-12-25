import React from 'react'
import { useState } from 'react'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { FcGoogle } from 'react-icons/fc'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { serverUrl } from '../App'
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { auth } from '../firebase'
import { ClipLoader } from "react-spinners"
import { useDispatch } from 'react-redux'
import { setUserData } from '../redux/userSlice.js'
const SignIn = () => {
    const navigate = useNavigate()
    const primaryColor = '#ff4d2d'
    const bgColor = '#fff9f6'
    const borderColor = '#ddd'

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const dispatch = useDispatch();
    const handleGoogleAuth = async () => {
        const provider = new GoogleAuthProvider()
        const result = await signInWithPopup(auth, provider)
        console.log(result)
        setLoading(true)
        try {
            const { data } = await axios.post(`${serverUrl}/api/auth/google-auth`, {
                email: result.user.email,
                fullname: result.user.displayName,
                profilePic: result.user.photoURL,
            }, { withCredentials: true });
            dispatch(setUserData(data));
            navigate('/');
            setLoading(false)
            console.log('Google SignIn result:', data);
        } catch (error) {
            console.error('Google SignIn error', error);
            const msg = error?.response?.data?.message || error.message || 'Google sign in failed';
            setError(msg);
            setLoading(false)
        }

    }
    const handleSignIn = async () => {
        setLoading(true)
        setError('')
        if (!email || !password) {
            setError('Please fill in both email and password')
            return
        }
        setLoading(true)
        try {
            const res = await axios.post(
                `${serverUrl}/api/auth/signin`,
                { email, password },
                { withCredentials: true }
            )
            dispatch(setUserData(res.data))
            console.log('SignIn success', res.data)
            setLoading(false)
        } catch (err) {
            console.error('SignIn error', err)
            const msg = err?.response?.data?.message || err.message || 'Sign in failed'
            setError(msg)
            setLoading(false)
        }
    }
    return (
        <div className="min-h-screen flex items-center justify-center p-4 w-full" style={{ backgroundColor: bgColor }}>
            <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md" style={{ border: `1px solid ${borderColor}` }}>
                <h1 className="text-2xl font-bold" style={{ color: primaryColor }}>
                    Food-Delivery
                </h1>
                <p className="text-gray-600 mb-4 mt-2">Sign in to your account</p>

                <div className="mb-4">
                    <label htmlFor="email" className="block text-gray-700 font-medium mb-1">
                        Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        className="w-full border rounded-lg px-3 py-2"
                        placeholder="Enter your email"
                        style={{ border: `1px solid ${borderColor}` }}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="password" className="block text-gray-700 font-medium mb-1">
                        Password
                    </label>
                    <div className="relative">
                        <input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            className="w-full border rounded-lg px-3 py-2"
                            placeholder="Enter your password"
                            style={{ border: `1px solid ${borderColor}` }}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button
                            type="button"
                            className="absolute right-3 top-3.5 text-gray-500"
                            onClick={() => setShowPassword((s) => !s)}
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                            {showPassword ? <FaEye /> : <FaEyeSlash />}
                        </button>
                    </div>
                    <div className="text-right mt-2">
                        <button
                            type="button"
                            className="text-sm text-[#ff4d2d] hover:underline"
                            onClick={() => navigate('/forgot-password')}
                        >
                            Forgot password?
                        </button>
                    </div>
                </div>

                {error && <p className="mb-3 text-sm text-red-600">{error}</p>}

                <button
                    className="w-full mt-1 font-semibold bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                    onClick={handleSignIn}
                    disabled={loading}
                >
                    {loading ? <ClipLoader size={20} color="#ffffff" /> : 'Sign In'}
                </button>

                <button
                    type="button"
                    className="w-full mt-3 flex items-center justify-center gap-3 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:shadow-sm"
                    onClick={handleGoogleAuth}
                >
                    <FcGoogle size={20} />
                    <span className="font-semibold">Sign in with Google</span>
                </button>

                <p className="mt-4 text-center text-gray-600">
                    Don't have an account?{' '}
                    <span className="text-[#ff4d2d] cursor-pointer hover:underline" onClick={() => navigate('/signUp')}>
                        Sign Up
                    </span>
                </p>
            </div>
        </div>
    )
}

export default SignIn