import nodemailer from 'nodemailer'
import { VERIFICATION_EMAIL_TEMPLATE } from './emailTemplate.js';
export const sendEmailOTP = async (email, verificationToken) => {
    const transporter = nodemailer.createTransport({
        service: 'Gmail', 
        auth: {
            user: process.env.EMAIL_USER, 
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: '"AlphaBiz" <resetalphapass@gmail.com>',
        to: email,
        subject: 'Your Verification Code',
        html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken)
    };
    await transporter.sendMail(mailOptions);
};