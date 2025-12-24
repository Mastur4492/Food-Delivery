import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import { genToken } from '../utils/token.js';
import { sendOtpEmail } from '../utils/mail.js';


const signUp = async (req, res) => {
    try {
        const { fullname, email, password, mobileNumber, role } = req.body;
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long' });
        }
        if (mobileNumber.length !== 10) {
            return res.status(400).json({ message: 'Mobile number must be 10 digits long' });
        }
        const hashPassword = await bcrypt.hash(password, 10);
        user = await User.create({
            fullname,
            email,
            password: hashPassword,
            mobileNumber,
            role
        });
        const token = await genToken(user._id);
        return res
            .cookie("token", token, { httpOnly: false, sameSite: "strict", maxAge: 7 * 24 * 60 * 60 * 1000, secure: false })
            .status(201)
            .json({
                message: 'User created successfully', user, token
            });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Server error' });
    }
}
const signIn = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User does not exist' });
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const token = await genToken(user._id);
        return res
            .cookie("token", token, { httpOnly: false, sameSite: "strict", maxAge: 7 * 24 * 60 * 60 * 1000, secure: false })
            .status(200)
            .json({
                message: 'User signed in successfully', user, token
            });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Server error' });
    }
}
const signOut = async (req, res) => {
    try {
        res.clearCookie("token");
        return res.status(200).json({ message: 'User logout out successfully' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Server error' });
    }
}
const sendOtp = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User does not exist' });
        }
        // Generate OTP
        const otp = Math.floor(1000 + Math.random() * 9000).toString();
        user.resetOtp = otp;
        user.otpExpires = Date.now() + 5 * 60 * 1000; // 5 minutes
        user.isOtpVerified = false;
        await user.save();
        await sendOtpEmail(email, otp);
        return res.status(200).json({ message: 'OTP sent to email' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'send otp error' });
    }
}
const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User does not exist' });
        }
        if (user.resetOtp !== otp) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }
        if (Date.now() > user.otpExpires) {
            return res.status(400).json({ message: 'OTP expired' });
        }
        user.isOtpVerified = true;
        user.resetOtp = undefined;
        user.otpExpires = undefined;
        await user.save();
        return res.status(200).json({ message: 'OTP verified successfully' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Verify OTP error' });
    }
}
const resetPassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;
        const user = await User.findOne({ email });
        if (!user || !user.isOtpVerified) {
            return res.status(400).json({ message: 'User does not exist or OTP not verified' });
        }
        const hashPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashPassword;
        user.isOtpVerified = false;
        await user.save();
        return res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Reset password error' });
    }
}
const googleAuth = async (req, res) => {
    try {
        const { fullname, email, mobileNumber, role } = req.body;
        let user = await User.findOne({ email });
        if (!user) {
            user = await User.create({
                fullname,
                email,
                mobileNumber,
                role
            });
            const token = await genToken(user._id);
            return res
                .cookie("token", token, { httpOnly: false, sameSite: "strict", maxAge: 7 * 24 * 60 * 60 * 1000, secure: false })
                .status(201)
                .json({
                    message: 'User created successfully', user, token
                });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Google auth error' });
    }
}
const getCurrentUser = async (req, res) => {
    try {
        const userId = req.userId;
        if (!userId) {
            return res.status(400).json({ message: 'User ID not found' });
        }
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.status(200).json({ user });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Get current user error' });
    }
}

export {
    signUp,
    signIn,
    signOut,
    sendOtp,
    verifyOtp,
    resetPassword,
    googleAuth,
    getCurrentUser
}
