import { useSocket } from 'contexts/SocketContext';
import { useEffect } from 'react';

export const useSocketMessage = (onMessageReceived) => {
  const socket = useSocket();

  useEffect(() => {
    if (!socket) return;

    socket.on('newMessage', (message) => {
      onMessageReceived(message);
    });

    return () => {
      socket.off('newMessage');
    };
  }, [socket, onMessageReceived]);
};
