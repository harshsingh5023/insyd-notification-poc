const { Queue: BullQueue, Worker } = require('bullmq');
const IORedis = require('ioredis');
const db = require('./db');
const { userSockets } = require('./index');

const connection = new IORedis({
    maxRetriesPerRequest: null
});

const Queue = new BullQueue('notifications', { connection });

new Worker('notifications', async job => {
    const { actorId, receiverId, type, metadata } = job.data;
    await db.saveNotification({ actorId, receiverId, type, metadata });
    const socket = userSockets.get(receiverId);
    if (socket) socket.emit('notification', { actorId, type, metadata });
}, { connection });

module.exports = { Queue };


