const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { db } = require('../config/firebase');
const admin = require('firebase-admin');

// POST /verify-otp
// Request: { "employeeId": "EMP123456", "otp": "123456" }
// Response: { "success": true, "token": "JWT_TOKEN" }
// Handles both: signup OTP (isVerified: false) and login OTP (isVerified: true)
router.post('/verify-otp', async (req, res) => {
    try {
        const { employeeId, otp } = req.body;

        if (!employeeId || !otp) {
            return res.status(400).json({
                success: false,
                message: "Employee ID and OTP are required"
            });
        }

        // Fetch user by employeeId field
        const userSnapshot = await db.collection('users').where('employeeId', '==', employeeId).get();

        if (userSnapshot.empty) {
            return res.status(404).json({
                success: false,
                message: "Employee not found"
            });
        }

        const userDoc = userSnapshot.docs[0];
        const user = userDoc.data();

        // Verify OTP
        if (user.otp !== otp) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP"
            });
        }

        // Check OTP expiry
        const now = new Date();
        const expiryTime = user.otpExpiry.toDate ? user.otpExpiry.toDate() : new Date(user.otpExpiry);
        if (now > expiryTime) {
            return res.status(400).json({
                success: false,
                message: "OTP has expired. Please request a new one."
            });
        }

        // Signup flow: mark as verified | Login flow: already verified, just clear OTP
        const updateData = {
            otp: admin.firestore.FieldValue.delete(),
            otpExpiry: admin.firestore.FieldValue.delete()
        };
        if (!user.isVerified) {
            updateData.isVerified = true;
        }

        await db.collection('users').doc(userDoc.id).update(updateData);

        // Generate JWT token
        const token = jwt.sign(
            { id: userDoc.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.status(200).json({
            success: true,
            token,
            user: {
                id: userDoc.id,
                name: user.name,
                email: user.email,
                employeeId: user.employeeId
            }
        });

    } catch (error) {
        console.error("Verify OTP Error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to verify OTP",
            error: error.message
        });
    }
});

module.exports = router;