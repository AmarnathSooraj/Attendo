const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { db } = require('../config/firebase');
const { sendEmail } = require('../utils/email');

// Signup Route
router.post('/signup', async (req, res) => {
    try {
        const { email, password, name } = req.body;

        if (!email || !password || !name) {
            return res.status(400).json({
                success: false,
                message: "Email, password, and name are required"
            });
        }

        // Check if user already exists
        const userSnapshot = await db.collection('users').where('email', '==', email).get();
        if (!userSnapshot.empty) {
            const existingUser = userSnapshot.docs[0].data();
            if (existingUser.isVerified) {
                return res.status(400).json({
                    success: false,
                    message: "User with this email already exists and is verified. Please login."
                });
            }
            // If unverified, reuse the existing employeeId
            const existingEmployeeId = existingUser.employeeId;
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            const otpExpiry = new Date();
            otpExpiry.setMinutes(otpExpiry.getMinutes() + 10);
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            await db.collection('users').doc(userSnapshot.docs[0].id).update({
                password: hashedPassword,
                otp,
                otpExpiry,
                isVerified: false
            });

            // Send email asynchronously to not block the request
            sendEmail(email, otp).catch(err => console.error("Background email error:", err));

            return res.status(200).json({
                success: true,
                message: "OTP resent. Please verify to complete signup.",
                employeeId: existingEmployeeId
            });
        }

        // Generate employeeId: EMP + 6 random digits
        const employeeId = 'EMP' + Math.floor(100000 + Math.random() * 900000).toString();

        // Hash password & generate OTP
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiry = new Date();
        otpExpiry.setMinutes(otpExpiry.getMinutes() + 10);

        await db.collection('users').add({
            name,
            email,
            password: hashedPassword,
            employeeId,
            isVerified: false,
            otp,
            otpExpiry,
            createdAt: new Date()
        });

        // Send email asynchronously to not block the request
        sendEmail(email, otp).catch(err => console.error("Background email error:", err));

        res.status(200).json({
            success: true,
            message: "OTP sent to your email. Please verify to complete signup.",
            employeeId
        });

    } catch (error) {
        console.error("Signup Error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to sign up",
            error: error.message
        });
    }
});

// Login Route
// POST /login → validates credentials → returns JWT
router.post('/login', async (req, res) => {
    try {
        const { employeeId, password } = req.body;

        if (!employeeId || !password) {
            return res.status(400).json({
                success: false,
                message: "Employee ID and password are required"
            });
        }

        const trimmedEmployeeId = employeeId.trim();

        // Fetch user by employeeId field
        const userSnapshot = await db.collection('users').where('employeeId', '==', trimmedEmployeeId).get();

        if (userSnapshot.empty) {
            return res.status(404).json({
                success: false,
                message: "Employee not found. Please check your Employee ID."
            });
        }

        const userDoc = userSnapshot.docs[0];
        const user = userDoc.data();

        // Check if user is verified
        if (!user.isVerified) {
            return res.status(403).json({
                success: false,
                message: "Email not verified. Please complete signup verification."
            });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: userDoc.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: userDoc.id,
                name: user.name,
                email: user.email,
                employeeId: user.employeeId
            }
        });

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to login",
            error: error.message
        });
    }
});

module.exports = router;