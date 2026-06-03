const express = require('express');
const router = express.Router();
const { db } = require('../config/firebase');
const admin = require('firebase-admin');
const { verifyToken } = require('../middleware/authMiddleware');

// POST /attendance/start — Clock in
router.post('/attendance/start', verifyToken, async (req, res) => {
    try {
        const userId = req.user.id;

        const userRef = db.collection('users').doc(userId);
        const userDoc = await userRef.get();

        if (!userDoc.exists) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        const userData = userDoc.data();

        if (userData.currentStartTime) {
            return res.status(400).json({
                success: false,
                message: "Attendance already started. Please clock out first."
            });
        }

        const startTime = new Date().toISOString();
        await userRef.update({ currentStartTime: startTime });

        return res.status(200).json({
            success: true,
            message: "Clocked in successfully.",
            startTime
        });

    } catch (error) {
        console.error("Clock In Error:", error);
        res.status(500).json({ success: false, message: "Failed to clock in.", error: error.message });
    }
});

// POST /attendance/end — Clock out
router.post('/attendance/end', verifyToken, async (req, res) => {
    try {
        const userId = req.user.id;

        const userRef = db.collection('users').doc(userId);
        const userDoc = await userRef.get();

        if (!userDoc.exists) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        const userData = userDoc.data();

        if (!userData.currentStartTime) {
            return res.status(400).json({
                success: false,
                message: "No active session. Please clock in first."
            });
        }

        const startTime = userData.currentStartTime;
        const endTime = new Date().toISOString();
        const historyEntry = { startTime, endTime };

        await userRef.update({
            history: admin.firestore.FieldValue.arrayUnion(historyEntry),
            currentStartTime: admin.firestore.FieldValue.delete()
        });

        return res.status(200).json({
            success: true,
            message: "Clocked out successfully.",
            data: historyEntry
        });

    } catch (error) {
        console.error("Clock Out Error:", error);
        res.status(500).json({ success: false, message: "Failed to clock out.", error: error.message });
    }
});

// GET /attendance/history — Get attendance history for the authenticated user
router.get('/attendance/history', verifyToken, async (req, res) => {
    try {
        const userId = req.user.id;

        const userDoc = await db.collection('users').doc(userId).get();

        if (!userDoc.exists) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        const history = userDoc.data().history || [];

        res.status(200).json({ success: true, count: history.length, history });

    } catch (error) {
        console.error("Attendance History Error:", error);
        res.status(500).json({ success: false, message: "Failed to fetch attendance history.", error: error.message });
    }
});

module.exports = router;