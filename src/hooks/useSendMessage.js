import { useSocket } from 'contexts/SocketContext';
import { apost } from 'utils/util_axios';

export const useSendMessage = (receiverId) => {
  const socket = useSocket();

  const sendMessage = async (message) => {
    try {
      // Make the API request to store the message in the database
      const response = await apost(`/message/send/${receiverId}`, {
        message
      });

      const sentMessage = response.data;

      // Emit the message via Socket.IO for real-time updates
      if (socket) {
        socket.emit('sendMessage', {
          receiverId,
          ...sentMessage // This includes the message and senderId, etc.
        });
      }

      return sentMessage;
    } catch (error) {
      console.error('Error sending message:', error);
      return null;
    }
  };

  return sendMessage;
};
