import { useGetMessages } from 'hooks/useGetMessages';
import { useSendMessage } from 'hooks/useSendMessage';
import { useSocketMessage } from 'hooks/useSocketMessage';
import React, { useState, useEffect, useCallback } from 'react';

const ChatScreen = () => {
  // Hardcoded receiverId
  const receiverId = "66fff5366395a28936315834";

  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState([]);

  // Fetch messages using custom hook
  const fetchedMessages = useGetMessages(receiverId);

  // Send message using custom hook
  const sendMessage = useSendMessage(receiverId);

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      const sentMessage = await sendMessage(newMessage);
      if (sentMessage) {
        setMessages((prevMessages) => [...prevMessages, sentMessage]);
      }
      setNewMessage(''); // Clear input after sending
    }
  };

  // Handle real-time messages using socket
  useSocketMessage((message) => {
    if (message.senderId === receiverId || message.receiverId === receiverId) {
      setMessages((prevMessages) => [...prevMessages, message]);
    }
  });

  // Update messages when fetched from the server
  useEffect(() => {
    if (fetchedMessages.length) {
      setMessages(fetchedMessages);
    }
  }, [fetchedMessages]);

  // Render chat messages
  const renderMessages = useCallback(() => {
    return messages.map((message) => (
      <div
        key={message._id}
        style={{
          alignSelf: message.senderId === receiverId ? 'flex-start' : 'flex-end',
          backgroundColor: message.senderId === receiverId ? '#f1f1f1' : '#87cefa',
          padding: '10px',
          marginBottom: '10px',
          borderRadius: '10px'
        }}
      >
        {message.message}
        <div style={{ fontSize: '10px', color: '#999' }}>
          {new Date(message.createdAt).toLocaleString()}
        </div>
      </div>
    ));
  }, [messages, receiverId]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100vh'
      }}
    >
      {/* Message list */}
      <div
        style={{
          flexGrow: 1,
          padding: '20px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {renderMessages()}
      </div>

      {/* Message input */}
      <div
        style={{
          padding: '10px',
          borderTop: '1px solid #ccc',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          style={{
            flexGrow: 1,
            padding: '10px',
            borderRadius: '20px',
            border: '1px solid #ccc',
            marginRight: '10px'
          }}
        />
        <button
          onClick={handleSendMessage}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: '#fff',
            borderRadius: '20px',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatScreen;
