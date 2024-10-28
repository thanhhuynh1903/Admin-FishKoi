import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { 
  Box, 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  List, 
  ListItem, 
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
  Container,
  Avatar
} from '@mui/material';
import { 
  Send as SendIcon, 
  Person as PersonIcon,
  Message as MessageIcon,
  AccessTime as AccessTimeIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { aget, apost } from 'utils/util_axios';

const ADMIN_ID = "6707fe5445f0dc6fdde0b347";

// Styled Components
const ChatContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  height: '100vh',
  backgroundColor: theme.palette.background.default
}));

const Sidebar = styled(Paper)(({ theme }) => ({
  width: 280,
  borderRight: `1px solid ${theme.palette.divider}`,
  display: 'flex',
  flexDirection: 'column'
}));

const ChatArea = styled(Box)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
}));

const MessageList = styled(Box)(({ theme }) => ({
  flex: 1,
  overflow: 'auto',
  padding: theme.spacing(3),
  backgroundColor: theme.palette.background.default
}));

const MessageBubble = styled(Paper)(({ theme, isAdmin }) => ({
  padding: theme.spacing(1.5),
  maxWidth: '70%',
  width: 'fit-content',
  marginBottom: theme.spacing(1),
  backgroundColor: isAdmin ? theme.palette.primary.main : theme.palette.grey[100],
  color: isAdmin ? theme.palette.primary.contrastText : theme.palette.text.primary,
  alignSelf: isAdmin ? 'flex-end' : 'flex-start'
}));

const TimeStamp = styled(Typography)(({ theme, isAdmin }) => ({
  fontSize: '0.75rem',
  color: isAdmin ? theme.palette.primary.contrastText : theme.palette.text.secondary,
  opacity: 0.8,
  marginTop: theme.spacing(0.5),
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5)
}));

const InputArea = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper
}));

const AdminChat = () => {
  const [socket, setSocket] = useState(null);
  const [activeSessions, setActiveSessions] = useState(new Map());
  const [currentSession, setCurrentSession] = useState(null);
  const [message, setMessage] = useState("");
  const [queueCount, setQueueCount] = useState(0);
  const [users, setUsers] = useState([]);
  const messagesEndRef = useRef(null);
  const [isMessageSending, setIsMessageSending] = useState(false);

  // Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await aget('/user/allUsers');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    // Load active sessions from localStorage
    const loadStoredSessions = () => {
      const storedSessions = localStorage.getItem('activeSessions');
      if (storedSessions) {
        try {
          const parsedSessions = new Map(JSON.parse(storedSessions));
          setActiveSessions(parsedSessions);
          // If there was a current session, restore it
          const storedCurrentSession = localStorage.getItem('currentSession');
          if (storedCurrentSession && parsedSessions.has(storedCurrentSession)) {
            setCurrentSession(storedCurrentSession);
          }
        } catch (error) {
          console.error('Error parsing stored sessions:', error);
        }
      }
    };

    loadStoredSessions();

    const newSocket = io('http://localhost:5000', {
      query: { userId: ADMIN_ID }
    });

    newSocket.on('connect', () => {
      console.log('Admin connected to server');
      // Rejoin all active sessions
      activeSessions.forEach((session, sessionId) => {
        newSocket.emit('adminRejoinSession', { sessionId });
      });
    });

    newSocket.on('chatStart', async ({ sessionId }) => {
      const userId = sessionId.split('_')[2];
      
      try {
        // Fetch messages history when session starts
        const response = await aget(`/messages/get/${userId}`);
        const messageHistory = response.data;
        
        setActiveSessions(prev => {
          const updated = new Map(prev);
          
          // Check if user already has a session
          const existingSession = Array.from(updated.values()).find(
            session => session.userId === userId
          );
          
          if (!existingSession) {
            updated.set(sessionId, { 
              messages: messageHistory, // Include message history
              userId: userId 
            });
            localStorage.setItem('activeSessions', JSON.stringify(Array.from(updated.entries())));
          }
          
          return updated;
        });
      } catch (error) {
        console.error('Error fetching message history:', error);
        // Still create session even if history fetch fails
        setActiveSessions(prev => {
          const updated = new Map(prev);
          if (!Array.from(updated.values()).find(session => session.userId === userId)) {
            updated.set(sessionId, { messages: [], userId: userId });
            localStorage.setItem('activeSessions', JSON.stringify(Array.from(updated.entries())));
          }
          return updated;
        });
      }
    });

    newSocket.on('userReconnected', async ({ userId, sessionId }) => {
      try {
        const response = await aget(`/messages/get/${userId}`);
        const messageHistory = response.data;
  
        setActiveSessions(prev => {
          const updated = new Map(prev);
          // Update the session ID for the user if needed
          Array.from(updated.entries()).forEach(([key, session]) => {
            if (session.userId === userId && key !== sessionId) {
              updated.delete(key);
              updated.set(sessionId, {
                ...session,
                messages: messageHistory // Update with latest messages
              });
            }
          });
          localStorage.setItem('activeSessions', JSON.stringify(Array.from(updated.entries())));
          return updated;
        });
      } catch (error) {
        console.error('Error fetching message history:', error);
      }
    });

    newSocket.on('newMessage', ({ sessionId, senderId, message, timestamp }) => {
      setActiveSessions(prev => {
        const updated = new Map(prev);
        const session = updated.get(sessionId);
        if (session) {
          // Check for duplicate messages
          const messageExists = session.messages.some(m => 
            (m.senderId === senderId && 
             m.message === message && 
             Math.abs(new Date(m.timestamp).getTime() - new Date(timestamp).getTime()) < 1000)
          );
          
          if (!messageExists) {
            session.messages.push({ senderId, message, timestamp });
            updated.set(sessionId, session);
            // Store updated sessions
            localStorage.setItem('activeSessions', JSON.stringify(Array.from(updated.entries())));
          }
        }
        return updated;
      });
    });

    newSocket.on('chatEnd', ({ sessionId }) => {
      setActiveSessions(prev => {
        const updated = new Map(prev);
        updated.delete(sessionId);
        localStorage.setItem('activeSessions', JSON.stringify(Array.from(updated.entries())));
        if (currentSession === sessionId) {
          setCurrentSession(null);
          localStorage.removeItem('currentSession');
        }
        return updated;
      });
    });

    setSocket(newSocket);

    return () => newSocket.disconnect();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentSession]);

  useEffect(() => {
    if (currentSession) {
      localStorage.setItem('currentSession', currentSession);
    }
  }, [currentSession]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || !currentSession || !socket || isMessageSending) return;

    const session = activeSessions.get(currentSession);
    if (!session) return;

    try {
      setIsMessageSending(true);
      const messageData = {
        sessionId: currentSession,
        senderId: ADMIN_ID,
        message: message.trim(),
        timestamp: new Date().toISOString()
      };

      // Optimistically update UI
      setActiveSessions(prev => {
        const updated = new Map(prev);
        const session = updated.get(currentSession);
        if (session) {
          session.messages.push(messageData);
          updated.set(currentSession, session);
        }
        return updated;
      });

      // Send message via API
      await apost(`/messages/send/${session.userId}`, {
        message: message.trim()
      });

      // Send via socket
      socket.emit('sendMessage', messageData);
      
      setMessage("");
    } catch (error) {
      console.error('Error sending message:', error);
      // Rollback optimistic update if failed
      setActiveSessions(prev => {
        const updated = new Map(prev);
        const session = updated.get(currentSession);
        if (session) {
          session.messages = session.messages.filter(msg => 
            msg.timestamp !== messageData.timestamp
          );
          updated.set(currentSession, session);
        }
        return updated;
      });
      alert('Failed to send message. Please try again.');
    } finally {
      setIsMessageSending(false);
    }
  };

  const formatTime = (timestamp) => {
    const date = timestamp.$date ? new Date(timestamp.$date) : new Date(timestamp);
    return date.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Find user name from users array
  const getUserName = (userId) => {
    const user = users.find(u => u._id === userId);
    return user ? user.name : `Anonymous`;
  };

  return (
    <ChatContainer>
      {/* Sidebar */}
      <Sidebar elevation={0}>
        <Box p={2}>
          <Typography variant="h6" component="div" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <MessageIcon /> Active Chats
          </Typography>
        </Box>
        <Divider />
        <List sx={{ flex: 1, overflow: 'auto' }}>
          {Array.from(activeSessions.entries()).map(([sessionId, session]) => (
            <ListItem key={sessionId} disablePadding>
              <ListItemButton 
                selected={currentSession === sessionId}
                onClick={() => setCurrentSession(sessionId)}
              >
                <ListItemIcon>
                  <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
                    <PersonIcon fontSize="small" />
                  </Avatar>
                </ListItemIcon>
                <ListItemText 
                  primary={getUserName(session.userId)}
                  secondary={`${session.messages.length} messages`}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Sidebar>

      {/* Chat Area */}
      <ChatArea>
        {currentSession ? (
          <>
            {/* Chat Header */}
            <Paper elevation={0} sx={{ px: 3, py: 2, borderBottom: 1, borderColor: 'divider' }}>
              <Typography variant="h6">
                Chat with {getUserName(activeSessions.get(currentSession)?.userId)}
              </Typography>
            </Paper>

            {/* Messages */}
            <MessageList>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {activeSessions.get(currentSession)?.messages.map((msg, idx) => (
                  <MessageBubble key={idx} isAdmin={msg.senderId === ADMIN_ID} elevation={0}>
                    <Typography>{msg.message}</Typography>
                    <TimeStamp isAdmin={msg.senderId === ADMIN_ID}>
                      <AccessTimeIcon sx={{ fontSize: '0.875rem' }} />
                      {formatTime(msg.createdAt || msg.timestamp)}
                    </TimeStamp>
                  </MessageBubble>
                ))}
              </Box>
              <div ref={messagesEndRef} />
            </MessageList>

            {/* Input Area */}
            <InputArea>
              <form onSubmit={handleSendMessage}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                    fullWidth
                    size="small"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message..."
                    variant="outlined"
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    endIcon={<SendIcon />}
                    disabled={!message.trim()}
                  >
                    Send
                  </Button>
                </Box>
              </form>
            </InputArea>
          </>
        ) : (
          <Box 
            sx={{ 
              flex: 1, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              color: 'text.secondary'
            }}
          >
            <Typography variant="body1">
              Select a chat to start messaging
            </Typography>
          </Box>
        )}
      </ChatArea>
    </ChatContainer>
  );
};

export default AdminChat;