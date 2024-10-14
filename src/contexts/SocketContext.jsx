import React, { createContext, useState, useEffect, useContext } from 'react';
import io from 'socket.io-client';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const newSocket = io('https://fengshuikoiapi.onrender.com', {
      query: { userId: userId },
      reconnectionAttempts: 5, // Attempt to reconnect 5 times if disconnected
      reconnectionDelay: 2000, // Wait 2 seconds before trying to reconnect
    });
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [userId]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  return useContext(SocketContext);
};
