import React from 'react';
import styled from 'styled-components';

const MessageContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
  align-items: ${props => props.isMine ? 'flex-end' : 'flex-start'};
`;

const MessageContent = styled.div`
  background-color: ${props => props.isMine ? '#007bff' : '#f1f1f1'};
  color: ${props => props.isMine ? 'white' : 'black'};
  padding: 0.75rem 1rem;
  border-radius: 1rem;
  max-width: 70%;
  word-wrap: break-word;
  text-align: ${props => props.isMine ? 'right' : 'left'};
`;

const MessageTime = styled.span`
  font-size: 0.75rem;
  color: #666;
  margin-top: 0.25rem;
`;

const ChatMessage = ({ message, isMine }) => {
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return '';
    return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  const time = message.sentAt || message.createdAt;

  const readStatus = isMine
    ? (message.read ? '읽음' : '안읽음')
    : '';

  return (
    <MessageContainer isMine={isMine}>
      <MessageContent isMine={isMine}>
        {message.content}
      </MessageContent>
      <MessageTime>
        {formatTime(time)}
        {readStatus && (
          <span style={{ marginLeft: 8, color: message.read ? '#007bff' : '#aaa', fontWeight: 500 }}>
            {readStatus}
          </span>
        )}
      </MessageTime>
    </MessageContainer>
  );
};

export default ChatMessage; 