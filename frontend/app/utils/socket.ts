import { io } from 'socket.io-client';

export function connectSocket(userId: string) {
  const socket = io('http://localhost:4000', {
    query: { userId },
    transports: ['websocket'],
  });

  socket.on('connect', () => {
    console.log('✅ WebSocket connected!');
  });

  socket.on('disconnect', () => {
    console.log('🔌 WebSocket disconnected!');
  });

  return socket;
}
