const User = require('../model/user'); 
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { SECRET_KEY } = require('../utils/config');


const userController = {

    addUser: async (req, res) => {
        try {
            const { name, email, password } = req.body;


            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message:'User already exists' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const newUser = new User({
                name,
                email,
                password: hashedPassword,
            });

            await newUser.save();

            res.status(201).json({ message: 'User created successfully', user: newUser });
        } catch (error) {
            console.error('Error in addUser:', error);
            res.status(500).json({ message: 'Server error. Please try again later.' });
        }
    },
    login: async (req, res) => {
        try {
            const { email, password } = req.body;
    
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
    
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }
    
            const token = jwt.sign({ email: user.email }, SECRET_KEY, { expiresIn: '1hr' });
    
            user.token = token;
            await user.save();
    
            res.status(200).json({ message: 'Login successful', user: { name: user.name, email: user.email }, token });
        } catch (error) {
            console.error('Error in login:', error);
            res.status(500).json({ message: 'Server error. Please try again later.' });
        }
    },
    
    forgotPassword: async (req, res) => {
        const { email } = req.body;

        try {
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            const token = jwt.sign({ email, }, SECRET_KEY, { expiresIn: '15min' });
            await sendVerificationEmail(email, token);
            console.log(token);

            res.status(200).json({ message: 'Password reset email sent. Please check your email.' });
        } catch (error) {
            console.error('Error in forgetPassword:', error);
            res.status(500).json({ message: 'Server error. Please try again later.' });
        }
    },

    updatePassword: async (req, res) => {
        try {
            const { token } = req.params;
            const { newPassword, confirmPassword } = req.body;

            if (newPassword !== confirmPassword) {
                return res.status(400).send('Passwords do not match.');
            }

            const decoded = jwt.verify(token, SECRET_KEY);

            const hashedPassword = await bcrypt.hash(newPassword, 10);

            const user = await User.findOneAndUpdate(
                { email: decoded.email }, 
                { password: hashedPassword }
            );

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            return res.status(200).json({ message: 'Password updated successfully' });
           
        } catch (error) {
            console.error('Error in updatePassword:', error);
            if (error.name === 'JsonWebTokenError') {
                return res.status(400).json({ message: 'Invalid token' });
            }
            return res.status(500).json({ message: 'Server error. Please try again later.' });
        }
    },
}
async function sendVerificationEmail(email, token) {

    try {
        const URL = `http://localhost:5173/user/password/${token}`
        console.log(URL);
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'etest2882@gmail.com',
                pass: 'lmin eppu cgbk gnoz'
            }
        });

        let mailOptions = {
            from: 'etest2882@gmail.com',
            to: email,
            subject: 'Password Reset Link',
            html: `<p>Dear user,</p>
                <p>We received a request to reset your password. Please click the link below to reset it:</p>
                <p><a href=${URL}>Reset Password</a></p>
                <p>If you didn't request this, you can ignore this email.</p>
                <p>Thank you,</p>
                <p>Your App Team</p>`
        };

        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error sending password reset email:', error);
        throw error;
    }
}
module.exports = userController;