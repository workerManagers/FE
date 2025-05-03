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
  background-color: ${props => props.bgColor || '#f8f9fa'};
  padding: 0;
  margin: 0;
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
`;

const ChatContainer = styled.div`
  max-width: 700px;
  width: 100%;
  height: 88vh;
  margin: 5.5rem auto;
  display: flex;
  flex-direction: column;
  background: #fff;
  border-radius: 28px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.09);
  border: 2px solid ${props => props.dividerColor || '#b0b4c0'};
  overflow: hidden;
  position: relative;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.3rem 2rem 1.3rem 2rem;
  background: rgba(255,255,255,0.85);
  backdrop-filter: blur(8px);
  border-bottom: 2px solid #b0b4c0;
  position: sticky;
  top: 0;
  z-index: 10;
  border-radius: 28px 28px 0 0;
  box-shadow: 0 2px 8px rgba(180,180,200,0.07);
`;

const BackButton = styled(motion.button)`
  display: flex;
  align-items: center;
  padding: 0.8rem 1.5rem;
  background: linear-gradient(90deg, #f3f4f6 0%, #e5e7eb 100%);
  color: #23272f;
  border: none;
  border-radius: 18px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(180,180,200,0.13);
  transition: all 0.2s;
  &:hover {
    background: linear-gradient(90deg, #e5e7eb 0%, #f3f4f6 100%);
    color: #6366f1;
    box-shadow: 0 4px 20px rgba(180,180,200,0.18);
    transform: translateY(-2px) scale(1.03);
  }
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  padding: 1.5rem 2rem;
  background: #f4f5f7;
  scroll-behavior: smooth;
  font-family: ${props => props.fontFamily || 'inherit'};
  font-size: ${props => props.fontSize || 1}em;
  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-track {
    background: #f8f9fa;
    border-radius: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: #e5e7eb;
    border-radius: 4px;
    &:hover {
      background: #cbd5e1;
    }
  }
`;

const InputContainer = styled.div`
  display: flex;
  gap: 1rem;
  padding: 1.5rem 2rem;
  background-color: #fff;
  border-top: 2px solid #b0b4c0;
`;

const MessageInput = styled.input`
  flex: 1;
  padding: 1rem 1.5rem;
  border: 1.5px solid #e5e7eb;
  border-radius: 14px;
  font-size: 1rem;
  background: #f8fafc;
  transition: all 0.2s ease;
  &:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 2px #e0e7ff;
  }
  &::placeholder {
    color: #a3aab8;
  }
`;

const SendButton = styled(motion.button)`
  padding: 1rem 2rem;
  background: linear-gradient(90deg, #f3f4f6 0%, #e5e7eb 100%);
  color: #23272f;
  border: none;
  border-radius: 14px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(180,180,200,0.13);
  transition: all 0.2s;
  &:hover {
    background: linear-gradient(90deg, #e5e7eb 0%, #f3f4f6 100%);
    color: #6366f1;
    box-shadow: 0 4px 20px rgba(180,180,200,0.18);
    transform: translateY(-2px) scale(1.03);
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    box-shadow: none;
    transform: none;
  }
`;

const ChatRoom = () => {
  const { roomId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [roomInfo, setRoomInfo] = useState(null);
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
        if (chatMessages.room) setRoomInfo(chatMessages.room);
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

  useEffect(() => {
    const fetchRoomInfo = async () => {
      try {
        const rooms = await chatApi.getChatRooms();
        const found = rooms.find(room => room.id === Number(roomId));
        if (found) setRoomInfo(found);
      } catch (error) {
        showToast.error('채팅방 정보를 불러오지 못했습니다.');
      }
    };
    fetchRoomInfo();
  }, [roomId]);

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

  // 상대방 이름 구하기 (역할 없이 이름만)
  let otherUserName = '';
  const userName = localStorage.getItem('userName');
  if (roomInfo) {
    if (userName === roomInfo.user1Name) {
      otherUserName = roomInfo.user2Name;
    } else {
      otherUserName = roomInfo.user1Name;
    }
  }

  return (
    <PageContainer>
      <ChatContainer>
        <Header>
          <div style={{display:'flex',alignItems:'center'}}>
            <BackButton
              onClick={handleGoBack}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <IoArrowBack style={{ marginRight: '0.5rem' }} />
              뒤로가기
            </BackButton>
          </div>
          {otherUserName && (
            <span style={{ fontWeight: 600, fontSize: '1.08rem', color: '#6366f1', marginLeft: '1.2rem' }}>
              {otherUserName}님과 채팅중입니다.
            </span>
          )}
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