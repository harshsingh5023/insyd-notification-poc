// app/NotificationClient.tsx
'use client';

import { useEffect, useState } from 'react';
import { connectSocket } from './utils/socket';
import axios from 'axios';

const userId = 'user123';

export default function NotificationClient() {
    const [notifications, setNotifications] = useState<any[]>([]);

    useEffect(() => {
        axios.get(`http://localhost:4000/notifications/${userId}`)
            .then(res => setNotifications(res.data));

        const socket = connectSocket(userId);
        socket.on('connect', () => console.log('✅ WebSocket Connected'));
        socket.on('notification', (notif: any) => {
            setNotifications(prev => [notif, ...prev]);
        });
        socket.on('disconnect', () => {
            console.log('🔌 WebSocket disconnected!');
        });

        return () => socket.disconnect();
    }, []);

    return (
        <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
            <h2>Notifications for {userId}</h2>
            <ul>
                {notifications.map((n, idx) => (
                    <li key={idx}>
                        <strong>{n.type}</strong> from {n.actorId}
                    </li>
                ))}
            </ul>
        </div>
    );
}
