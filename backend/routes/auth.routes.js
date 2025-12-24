import express from 'express';
import { signOut, signIn, signUp, sendOtp, resetPassword, verifyOtp, googleAuth } from '../controllers/auth.controller.js';

const authRouter = express.Router();

authRouter.route('/signup').post(signUp);
authRouter.route('/signin').post(signIn);
authRouter.route('/signout').get(signOut);
authRouter.route('/send-otp').post(sendOtp);
authRouter.route('/verify-otp').post(verifyOtp);
authRouter.route('/reset-password').post(resetPassword);
authRouter.route('/google-auth').post(googleAuth);

export default authRouter;