// server.js
const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "*"
    }
});

// In-memory storage
const notifications = {};
const users = {
    'user1': { name: 'Architect One' },
    'user2': { name: 'Designer Two' }
};

// Initialize notifications for each user
Object.keys(users).forEach(userId => {
    notifications[userId] = [];
});

// WebSocket connection
io.on('connection', (socket) => {
    console.log('Client connected');

    socket.on('subscribe', (userId) => {
        socket.join(userId);
        console.log(`User ${userId} subscribed`);
    });
});

// API endpoints
app.get('/notifications/:userId', (req, res) => {
    const userNotifications = notifications[req.params.userId] || [];
    res.json(userNotifications.slice(0, 20)); // Return latest 20
});

app.post('/notifications', (req, res) => {
    const { userId, type, content } = req.body;

    if (!notifications[userId]) {
        notifications[userId] = [];
    }

    const newNotification = {
        id: Date.now().toString(),
        userId,
        type,
        content,
        read: false,
        createdAt: new Date().toISOString()
    };

    notifications[userId].unshift(newNotification); // Add to beginning

    // Send real-time update
    io.to(userId).emit('new-notification', newNotification);
    res.status(201).json(newNotification);
});

// Seed some initial notifications
notifications['user1'] = [
    {
        id: '1',
        userId: 'user1',
        type: 'follow',
        content: 'Designer Two started following you',
        read: false,
        createdAt: new Date().toISOString()
    },
    {
        id: '2',
        userId: 'user1',
        type: 'like',
        content: 'Designer Two liked your post "Modern Facades"',
        read: true,
        createdAt: new Date(Date.now() - 3600000).toISOString()
    }
];
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Backend running on port ${PORT}`));

