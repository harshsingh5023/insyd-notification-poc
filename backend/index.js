// index.js (updated backend)

require('dotenv').config();
const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors());

const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
        methods: ['GET', 'POST']
    }
});

class NotificationStore {
    constructor() {
        this.notifications = {};
    }

    getNotifications(userId) {
        return this.notifications[userId] || [];
    }

    addNotification(notificationData) {
        // Validate required fields
        if (!notificationData || !notificationData.userId || !notificationData.type || !notificationData.content) {
            throw new Error('Missing required notification fields');
        }

        const { userId, type, content } = notificationData;

        if (!this.notifications[userId]) {
            this.notifications[userId] = [];
        }

        const newNotification = {
            id: Date.now().toString(),
            userId,
            type,
            content,
            read: false,
            createdAt: new Date().toISOString()
        };

        this.notifications[userId].unshift(newNotification);
        return newNotification;
    }
}

const store = new NotificationStore();

// WebSocket connection
io.on('connection', (socket) => {
    console.log('Client connected');

    socket.on('subscribe', (userId) => {
        socket.join(userId);
        console.log(`User ${userId} subscribed`);
    });
});

// API endpoints
app.post('/notifications', (req, res) => {
    try {
        // Validate request body exists
        if (!req.body) {
            return res.status(400).json({ error: 'Request body is missing' });
        }

        const notification = store.addNotification(req.body);

        // Send real-time update
        io.to(notification.userId).emit('new-notification', notification);

        res.status(201).json(notification);
    } catch (error) {
        console.error('Error creating notification:', error.message);
        res.status(400).json({ error: error.message });
    }
});

app.get('/notifications/:userId', (req, res) => {
    try {
        const notifications = store.getNotifications(req.params.userId);
        res.json(notifications.slice(0, 20)); // Return latest 20
    } catch (error) {
        console.error('Error getting notifications:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});