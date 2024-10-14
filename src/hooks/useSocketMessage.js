import { useSocket } from 'contexts/SocketContext';
import { useEffect } from 'react';
import sound from "../assets/notification.mp3"

export const useSocketMessage = (onMessageReceived) => {
  const socket = useSocket();

  useEffect(() => {
    if (!socket) return;

    socket.on('newMessage', (message) => {
      const notification = new Audio(sound);
      notification.play();
      onMessageReceived(message);
    });

    return () => {
      socket.off('newMessage');
    };
  }, [socket, onMessageReceived]);
};
