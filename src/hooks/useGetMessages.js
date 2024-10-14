import { useState, useEffect } from 'react';
import { aget } from 'utils/util_axios';

export const useGetMessages = (chatUserId) => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await aget(`/message/get/${chatUserId}`);
        setMessages(response.data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
  }, [chatUserId]);

  return messages;
};
