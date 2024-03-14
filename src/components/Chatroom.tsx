import React, { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import type { DefaultEventsMap } from '@socket.io/component-emitter';

interface Message {
    sender: string;
    recipient: string;
    text: string;
}

interface ChatRoomProps {
    currentUser: string;
    recipient: string;
}

const ChatRoom: React.FC<ChatRoomProps> = ({ currentUser, recipient }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [socket, setSocket] = useState<Socket<DefaultEventsMap, DefaultEventsMap> | null>(null);

  useEffect(() => {
    const newSocket = io('your_websocket_server_url');
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on('connect', () => {
      console.log('Connected to server');
    });

    const handleMessage = (message: Message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    };

    socket.on('message', handleMessage);

    return () => {
      socket.off('message', handleMessage);
    };
  }, [socket]);

  const sendMessage = () => {
    if (!message.trim()) return;
    const newMessage: Message = {
      sender: currentUser,
      recipient,
      text: message.trim(),
    };
    socket?.emit('message', newMessage);
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setMessage('');
  };

  return (
    <div>
      <h2>Chat Room</h2>
      <div>
        {messages.map((msg, index) => (
          <div key={index}>
            <p>{msg.sender}: {msg.text}</p>
          </div>
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default ChatRoom;
