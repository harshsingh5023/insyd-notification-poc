const notifications = [];

async function saveNotification({ actorId, receiverId, type, metadata }) {
    notifications.push({
        id: notifications.length + 1,
        actorId,
        receiverId,
        type,
        metadata,
        isRead: false,
        createdAt: new Date()
    });
}

async function getNotifications(userId) {
    return notifications.filter(n => n.receiverId === userId);
}

module.exports = { saveNotification, getNotifications };
