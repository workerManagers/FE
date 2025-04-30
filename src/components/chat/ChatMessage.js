import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const MessageContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  margin-bottom: 1.5rem;
  align-items: ${props => props.isMine ? 'flex-end' : 'flex-start'};
  padding: 0 1rem;
`;

const MessageContent = styled(motion.div)`
  background: ${props => props.isMine ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.85)'};
  color: ${props => props.isMine ? 'white' : '#000000'};
  padding: 1rem 1.5rem;
  border-radius: 1.5rem;
  max-width: 70%;
  word-wrap: break-word;
  text-align: ${props => props.isMine ? 'right' : 'left'};
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
  }
`;

const MessageTime = styled.span`
  font-size: 0.8rem;
  color: rgba(0, 0, 0, 0.5);
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ReadStatus = styled.span`
  color: ${props => props.read ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.3)'};
  font-weight: 500;
  font-size: 0.8rem;
`;

const ChatMessage = ({ message, isMine }) => {
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return '';
    return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  const time = message.sentAt || message.createdAt;
  const readStatus = isMine ? (message.read ? '읽음' : '안읽음') : '';

  return (
    <MessageContainer
      isMine={isMine}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <MessageContent
        isMine={isMine}
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", duration: 0.5 }}
      >
        {message.content}
      </MessageContent>
      <MessageTime>
        {formatTime(time)}
        {readStatus && (
          <ReadStatus read={message.read}>
            {readStatus}
          </ReadStatus>
        )}
      </MessageTime>
    </MessageContainer>
  );
};

export default ChatMessage; 