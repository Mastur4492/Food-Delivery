import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
    service: "Gmail",
    port: 465,
    secure: true, // Use true for port 465, false for port 587
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export const sendOtpEmail = async (to, otp) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject: "Reset Your Password - OTP Code",
        html: `<p>Your OTP code is <strong>${otp}</strong></p>`,
    };
    await transporter.sendMail(mailOptions);
};