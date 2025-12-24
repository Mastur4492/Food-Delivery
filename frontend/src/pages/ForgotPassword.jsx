import React from 'react'
import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { FaArrowLeft, FaEye, FaEyeSlash } from 'react-icons/fa'
import { serverUrl } from '../App'
import { ClipLoader } from "react-spinners"
const ForgotPassword = () => {
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [stage, setStage] = useState(1) // 1=request email, 2=enter OTP, 3=new password
    const [otp, setOtp] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [verifyLoading, setVerifyLoading] = useState(false)

    const handleSendOtp = async () => {
        setLoading(true)
        try {
            setLoading(true)
            setError('')
            const result = await axios.post(`${serverUrl}/api/auth/send-otp`, { email }, { withCredentials: true })
            console.log('Send OTP success', result.data)
            setLoading(false)
            setStage(2)
        } catch (error) {
            console.error('Send OTP error', error)
            const msg = error?.response?.data?.message || error.message || 'Send OTP failed'
            setError(msg)
            setLoading(false)
        }
    }
    const handleVerifyOtp = async () => {
        setLoading(true)
        try {
            setVerifyLoading(true)
            setError('')
            const result = await axios.post(`${serverUrl}/api/auth/verify-otp`, { email, otp }, { withCredentials: true })
            console.log('Verify OTP success', result.data)
            setVerifyLoading(false)
            setStage(3)
            setLoading(false)
        } catch (error) {
            console.error('Verify OTP error', error)
            const msg = error?.response?.data?.message || error.message || 'Verify OTP failed'
            setError(msg)
            setVerifyLoading(false)
            setLoading(false)
        }
    }
    const handleResetPassword = async () => {
        if (newPassword !== confirmPassword) {
            setError('Passwords do not match')
            return
        }
        setLoading(true)
        try {
            setVerifyLoading(true)
            setError('')
            const result = await axios.post(`${serverUrl}/api/auth/reset-password`, { email, newPassword }, { withCredentials: true })
            console.log('Reset Password success', result.data)
            setVerifyLoading(false)
            setSuccess('Password reset successful')
            navigate('/signIn')
            setLoading(false)
        } catch (error) {
            console.error('Reset Password error', error)
            const msg = error?.response?.data?.message || error.message || 'Reset Password failed'
            setError(msg)
            setVerifyLoading(false)
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 w-full" style={{ backgroundColor: '#fff9f6' }}>
            <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md" style={{ border: `1px solid #ddd` }}>
                <div className="flex items-center gap-3 mb-2">
                    <button
                        type="button"
                        className="p-2 rounded-full bg-[#ff4d2d] hover:bg-red-600 text-white shadow-sm"
                        onClick={() => navigate('/signIn')}
                        aria-label="Back to sign in"
                        title="Back to Sign In"
                    >
                        <FaArrowLeft className="text-lg" />
                    </button>
                    <h1 className="text-2xl font-bold" style={{ color: '#ff4d2d' }}>
                        Forgot Password
                    </h1>
                </div>
                <p className="text-gray-600 mb-4 mt-2">Enter your email to receive a password reset link.</p>

                {stage === 1 && (
                    <>
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-gray-700 font-medium mb-1">Email</label>
                            <input
                                id="email"
                                type="email"
                                className="w-full border rounded-lg px-3 py-2"
                                placeholder="Your email"
                                style={{ border: `1px solid #ddd` }}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        {error && <p className="mb-3 text-sm text-red-600">{error}</p>}
                        {success && <p className="mb-3 text-sm text-green-600">{success}</p>}

                        <div>
                            <button
                                className="w-full font-semibold bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition duration-200 disabled:opacity-60"
                                onClick={handleSendOtp}
                                disabled={loading}
                            >
                                {loading ? <ClipLoader size={20} color="#ffffff" /> : 'Send OTP'}
                            </button>
                        </div>
                    </>
                )}
                {stage === 2 && (
                    <>
                        <div className="mb-4">
                            <label htmlFor="otp" className="block text-gray-700 font-medium mb-1">Enter OTP</label>
                            <input
                                id="otp"
                                type="text"
                                className="w-full border rounded-lg px-3 py-2"
                                placeholder="Enter OTP"
                                style={{ border: `1px solid #ddd` }}
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                            />
                        </div>

                        {error && <p className="mb-3 text-sm text-red-600">{error}</p>}
                        {success && <p className="mb-3 text-sm text-green-600">{success}</p>}

                        <div className="flex gap-2">
                            <button
                                className="flex-1 font-semibold bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition duration-200 disabled:opacity-60"
                                onClick={handleVerifyOtp}
                                disabled={verifyLoading}
                            >
                                {verifyLoading ? <ClipLoader size={20} color="#ffffff" /> : 'Verify OTP'}
                            </button>
                            <button
                                className="flex-1 font-medium bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition duration-150"
                                onClick={handleSendOtp}
                                disabled={loading}
                            >
                                {loading ? <ClipLoader size={20} color="#ffffff" /> : 'Resend OTP'}
                            </button>
                        </div>
                    </>
                )}

                {stage === 3 && (
                    <>
                        <div className="mb-4">
                            <label htmlFor="newPassword" className="block text-gray-700 font-medium mb-1">New Password</label>
                            <div className="relative">
                                <input
                                    id="newPassword"
                                    type={showNewPassword ? 'text' : 'password'}
                                    className="w-full border rounded-lg px-3 py-2"
                                    placeholder="New password"
                                    style={{ border: `1px solid #ddd` }}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-3.5 text-gray-500"
                                    onClick={() => setShowNewPassword((s) => !s)}
                                >
                                    {showNewPassword ? <FaEye /> : <FaEyeSlash />}
                                </button>
                            </div>
                        </div>

                        <div className="mb-4">
                            <label htmlFor="confirmPassword" className="block text-gray-700 font-medium mb-1">Confirm Password</label>
                            <div className="relative">
                                <input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    className="w-full border rounded-lg px-3 py-2"
                                    placeholder="Confirm new password"
                                    style={{ border: `1px solid #ddd` }}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-3.5 text-gray-500"
                                    onClick={() => setShowConfirmPassword((s) => !s)}
                                >
                                    {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
                                </button>
                            </div>
                        </div>

                        {error && <p className="mb-3 text-sm text-red-600">{error}</p>}
                        {success && <p className="mb-3 text-sm text-green-600">{success}</p>}

                        <div>
                            <button
                                className="w-full font-semibold bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition duration-200 disabled:opacity-60"
                                onClick={handleResetPassword}
                                disabled={verifyLoading}
                            >
                                {verifyLoading ? <ClipLoader size={20} color="#ffffff" /> : 'Reset Password'}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default ForgotPassword