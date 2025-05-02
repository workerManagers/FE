import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { chatApi } from '../../services/api';
import ChatMessage from './ChatMessage';
import { showToast } from '../common/Toast';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { useParams, useNavigate } from 'react-router-dom';
import { IoArrowBack } from 'react-icons/io5';

const PageContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: white;
  padding: 2rem;
  margin-top: 0;
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
`;

const ChatContainer = styled.div`
  max-width: 600px;
  width: 100%;
  height: 80vh;
  margin: 5.5rem auto;
  display: flex;
  flex-direction: column;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(10px);
  border-radius: 24px;
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.15);
  border: 3px solid rgba(0, 0, 0, 0.3);
  overflow: hidden;
  position: relative;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  background: white;
  border-bottom: 2px solid rgba(0, 0, 0, 0.2);
  position: sticky;
  top: 0;
  z-index: 10;
`;

const BackButton = styled(motion.button)`
  display: flex;
  align-items: center;
  padding: 0.8rem 1.5rem;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(0, 0, 0, 0.9);
    transform: translateY(-2px);
  }
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  background: rgba(248, 249, 250, 0.5);
  scroll-behavior: smooth;

  /* 스크롤바 스타일링 */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.05);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 4px;
    
    &:hover {
      background: rgba(0, 0, 0, 0.3);
    }
  }
`;

const InputContainer = styled.div`
  display: flex;
  gap: 1rem;
  padding: 1.5rem;
  background-color: white;
  border-top: 2px solid rgba(0, 0, 0, 0.2);
`;

const MessageInput = styled.input`
  flex: 1;
  padding: 1rem 1.5rem;
  border: 2px solid rgba(0, 0, 0, 0.2);
  border-radius: 12px;
  font-size: 1rem;
  background: white;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: rgba(0, 0, 0, 0.4);
    box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1);
  }

  &::placeholder {
    color: rgba(0, 0, 0, 0.4);
  }
`;

const SendButton = styled(motion.button)`
  padding: 1rem 2rem;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(0, 0, 0, 0.9);
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ChatRoom = () => {
  const { roomId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const stompClient = useRef(null);
  const userId = Number(localStorage.getItem('userId'));
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    const init = async () => {
      try {
        const chatMessages = await chatApi.getChatMessages(roomId);
        setMessages(Array.isArray(chatMessages.messages) ? chatMessages.messages : []);
      } catch (error) {
        showToast.error('메시지 로드 실패');
        setMessages([]);
      }
    };

    init();

    // 채팅방 입장 시 읽음 처리
    const markAsRead = async () => {
      try {
        await chatApi.markAsRead(roomId);
        setMessages(prev => 
          prev.map(msg => 
            msg.senderId !== userId ? { ...msg, read: true } : msg
          )
        );
      } catch (error) {
        console.error('메시지 읽음 처리 실패:', error);
      }
    };

    // WebSocket 연결 설정
    const onMessage = async (message) => {
      setMessages(prev => Array.isArray(prev) ? [...prev, message] : [message]);
      if (message.senderId !== userId) {
        await markAsRead();
      }
    };

    try {
      stompClient.current = chatApi.createWebSocketClient(token, roomId, onMessage);
      markAsRead();
    } catch (error) {
      console.error('WebSocket 연결 실패:', error);
      showToast.error('채팅 연결에 실패했습니다. 페이지를 새로고침해주세요.');
    }

    return () => {
      if (stompClient.current) {
        stompClient.current.deactivate();
      }
    };
  }, [roomId, token, userId]);

  useEffect(() => {
    // 새 메시지가 추가될 때만 스크롤 이동
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      chatApi.sendMessage(stompClient.current, roomId, newMessage);
      setNewMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  };

  // 채팅방 나가기 -> 뒤로가기로 변경
  const handleGoBack = () => {
    navigate(-1); // 이전 페이지로 이동
  };

  return (
    <PageContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <ChatContainer>
        <Header>
          <BackButton
            onClick={handleGoBack}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <IoArrowBack style={{ marginRight: '0.5rem' }} />
            뒤로가기
          </BackButton>
        </Header>
        <MessagesContainer ref={messagesContainerRef}>
          {Array.isArray(messages) && messages.map((message, index) => (
            <ChatMessage
              key={index}
              message={message}
              isMine={message.senderId === userId}
            />
          ))}
          <div ref={messagesEndRef} />
        </MessagesContainer>
        <InputContainer>
          <MessageInput
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="메시지를 입력하세요..."
          />
          <SendButton
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            전송
          </SendButton>
        </InputContainer>
      </ChatContainer>
    </PageContainer>
  );
};

export default ChatRoom; 