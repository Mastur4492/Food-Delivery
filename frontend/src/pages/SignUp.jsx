import React from 'react'
import { useState, useRef } from 'react';
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { serverUrl } from '../App';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../firebase';
import {ClipLoader} from "react-spinners"
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice.js';

const SignUp = () => {
    const navigate = useNavigate();
    const primaryColor = '#ff4d2d';
    const bgColor = '#fff9f6';
    const borderColor = '#ddd';
    const [showPassword, setShowPassword] = useState(false);
    const [role, setRole] = useState('user');
    const [fullname, setFullname] = useState('');
    const [email, setEmail] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const mobileRef = useRef(null);
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const dispatch = useDispatch();
    

    const handleGoogleAuth = async () => {
        if (!mobileNumber) {
            setError('Please enter your mobile number before proceeding with Google Sign Up.');
            mobileRef.current?.focus();
            return;
        }
        const provider = new GoogleAuthProvider()
        const result = await signInWithPopup(auth, provider)
        console.log(result)
        setLoading(true)
        try {
            const { data } = await axios.post(`${serverUrl}/api/auth/google-auth`, {
                fullname: result.user.displayName,
                email: result.user.email,
                mobileNumber,
                role,
            }, { withCredentials: true });
            navigate('/');
            setLoading(false)
            dispatch(setUserData(data));
            console.log('Google SignUp result:', data);
        } catch (error) {
            console.error('Google SignUp error', error);
            const msg = error?.response?.data?.message || error.message || 'Google sign up failed';
            setError(msg);
            setLoading(false)
        }

    }

    const handleSignUp = async () => {
        setLoading(true);
        console.log('SignUp clicked', { fullname, email, mobileNumber, password, role });
        setError('');
        if (!fullname || !email || !mobileNumber || !password) {
            setError('Please fill in all required fields')
            return
        }
        try {
            const result = await axios.post(`${serverUrl}/api/auth/signup`, {
                fullname,
                email,
                mobileNumber,
                password,
                role
            }, { withCredentials: true });
            dispatch(setUserData(result.data));
            console.log('SignUp result:', result);
            setLoading(false);
        } catch (err) {
            console.error("Error signing up:", err);
            const msg = err?.response?.data?.message || err.message || 'Sign up failed';
            setError(msg);
            setLoading(false);
        }
    }

    return (
        <div className='h-screen min-h-screen flex items-center justify-center p-4 w-full' style={{ backgroundColor: bgColor }}>
            <div className={`bg-white rounded-xl shadow-lg p-8 w-full max-w-md border border-[${borderColor}]`} style={{ border: `1px solid ${borderColor}` }}>
                <h1 className='text-2xl font-bold' style={{ color: primaryColor }}>Food-Delivery</h1>
                <p className='text-gray-600 mb-4 mt-2'>Create your account to get started with delicious food & Fast delivery !!</p>
                <div className='mb-4'>
                    <label htmlFor="fullname" className='block text-gray-700 font-medium mb-1'>Fullname</label>
                    <input type="text" className='w-full border rounded-lg px-3 py-2 ' placeholder='Enter your Fullname' style={{ border: `1px solid ${borderColor}` }} value={fullname} onChange={(e) => setFullname(e.target.value)} required />
                </div>
                <div className='mb-4'>
                    <label htmlFor="email" className='block text-gray-700 font-medium mb-1'>Email</label>
                    <input type="email" className='w-full border rounded-lg px-3 py-2 ' placeholder='Enter your Email' style={{ border: `1px solid ${borderColor}` }} value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className='mb-4'>
                    <label htmlFor="password" className='block text-gray-700 font-medium mb-1'>Password</label>
                    <div className='relative'>
                        <input type={`${showPassword ? "text" : "password"}`} className='w-full border rounded-lg px-3 py-2 ' placeholder='Enter your Password' style={{ border: `1px solid ${borderColor}` }} value={password} onChange={(e) => setPassword(e.target.value)} required />
                        <button className='absolute right-3 cursor-pointer top-3.5 text-gray-500' onClick={() => setShowPassword(prev => !prev)}>{showPassword ? <FaEye /> : <FaEyeSlash />} </button>
                    </div>
                    <div className='mb-4 mt-3'>
                        <label htmlFor="mobilenumber" className='block text-gray-700 font-medium mb-1'>Mobile Number</label>
                        <input ref={mobileRef} type="tel" className='w-full border rounded-lg px-3 py-2 ' placeholder='Enter your Mobile Number' style={{ border: `1px solid ${borderColor}` }} value={mobileNumber} onChange={(e) => { setMobileNumber(e.target.value); setError(''); }} required />
                    </div>
                    <div className='mb-4 mt-2'>
                        <label htmlFor="role" className='block text-gray-700 font-medium mb-1'>Role</label>
                        <div className='flex gap-2 mt-1' >
                            {['user', 'owner', 'deliveryBoy'].map((r) => (
                                <button
                                    key={r}
                                    className={`cursor-pointer mr-4 px-4 py-2 rounded-lg ${role === r ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                                    onClick={() => setRole(r)}
                                >
                                    {r.charAt(0).toUpperCase() + r.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>
                    <button
                        className=' cursor-pointer w-full mt-3 font-semibold bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition duration-200 disabled:opacity-60 disabled:cursor-not-allowed'
                        onClick={handleSignUp}
                        disabled={loading}
                    >
                        {loading ? <ClipLoader size={20} color="#ffffff" /> : 'SignUp'}

                    </button>
                    {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
                    <button
                        onClick={handleGoogleAuth}
                        type="button"
                        className="w-full mt-3 flex items-center justify-center gap-3 px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 hover:shadow-md active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-150 ease-in-out"
                        aria-label="Sign up with Google"
                    >
                        <FcGoogle size={20} />
                        <span className="font-semibold">Sign up with Google</span>
                    </button>
                    <p className="mt-4 cursor-pointer text-center text-gray-600" onClick={() => navigate("/signIn")}>
                        Already have an account? <span className='text-[#ff4d2d] hover:underline'>Sign In</span>
                    </p>
                </div>
            </div>
        </div>
    )
}


export default SignUp