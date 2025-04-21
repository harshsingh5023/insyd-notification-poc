"use client"
import { useState, useEffect } from 'react';
import io from 'socket.io-client';

export default function Home() {
  const [notifications, setNotifications] = useState([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [socket, setSocket] = useState(null);
  const [userId] = useState('user1'); // Hardcoded for POC
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';
  const socketUrl = process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'ws://localhost:4000';

  useEffect(() => {
    // Fetch initial notifications
    fetch(`${apiBaseUrl}/notifications/${userId}`)
      .then(res => res.json())
      .then(data => setNotifications(data));

    // Set up WebSocket connection
    const newSocket = io(socketUrl);
    newSocket.emit('subscribe', userId);
    newSocket.on('new-notification', (notification) => {
      console.log('Received new notification:', notification);
      setNotifications(prev => [notification, ...prev]);
    });

    setSocket(newSocket);

    return () => newSocket.close();
  }, [userId]);

  const triggerTestNotification = () => {
    const types = ['like', 'comment', 'follow', 'mention'];
    const messages = {
      like: 'liked your post "Urban Design Trends"',
      comment: 'commented: "Great perspective!" on your article',
      follow: 'started following you',
      mention: 'mentioned you in a comment'
    };
    const type = types[Math.floor(Math.random() * types.length)];

    fetch(`${apiBaseUrl}/notifications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        type,
        content: `User ${Math.floor(Math.random() * 100)} ${messages[type]}`
      })
    });
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Insyd Notifications</h1>
      <button
        onClick={triggerTestNotification}
        style={{
          padding: '10px 15px',
          background: '#0066cc',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          marginBottom: '20px'
        }}
      >
        Simulate New Activity
      </button>

      <div style={{ border: '1px solid #ddd', borderRadius: '8px' }}>
        {notifications.map((n, i) => (
          <div
            key={n.id || i}
            style={{
              padding: '15px',
              borderBottom: i < notifications.length - 1 ? '1px solid #eee' : 'none',
              backgroundColor: n.read ? '#fff' : '#f5f9ff'
            }}
          >
            <div style={{
              color: '#666',
              fontSize: '0.8rem',
              marginBottom: '5px'
            }}>
              {new Date(n.createdAt).toLocaleString()}
            </div>
            <div style={{ fontWeight: '500', color: '#666' }}>
              {n.content}
            </div>
            <div style={{
              color: '#0066cc',
              fontSize: '0.7rem',
              marginTop: '5px'
            }}>
              {n.type.toUpperCase()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}