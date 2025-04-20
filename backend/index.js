const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const { Queue } = require('./queue');
const db = require('./db');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: '*' }
});
const userSockets = new Map();

io.on('connection', (socket) => {
    const { userId } = socket.handshake.query;
    if (userId) userSockets.set(userId, socket);
    socket.on('disconnect', () => userSockets.delete(userId));
});

app.use(cors());
app.use(express.json());

app.post('/notify', async (req, res) => {
    const { actorId, receiverId, type, metadata } = req.body;
    await Queue.add('notify', { actorId, receiverId, type, metadata });
    res.send({ status: 'queued' });
});

app.get('/notifications/:userId', async (req, res) => {
    const notifs = await db.getNotifications(req.params.userId);
    res.json(notifs);
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Backend running on port ${PORT}`));


module.exports = { io, userSockets };
