import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { chatApi } from '../../services/api';
import ChatMessage from './ChatMessage';
import { showToast } from '../common/Toast';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { useParams, useNavigate } from 'react-router-dom';
import { IoArrowBack } from 'react-icons/io5';

const ChatContainer = styled.div`
  width: 400px;
  height: 800px;
  margin: 0 auto;
  margin-top: 40px;
  display: flex;
  flex-direction: column;
  background: #f7f8fa;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 0.5rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 0.5rem 1rem 0 1rem;
`;

const LeaveButton = styled.button`
  background: #dc3545;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 0.5rem 1.2rem;
  font-size: 1rem;
  cursor: pointer;
  font-weight: 600;
  &:hover {
    background: #b52a37;
  }
`;

const InputContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  padding: 1rem;
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const MessageInput = styled.input`
  flex: 1;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 0.25rem;
  font-size: 1rem;
  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

const SendButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  font-size: 1rem;
  &:hover {
    background-color: #0056b3;
  }
`;

const ChatRoom = () => {
  const { roomId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);
  const stompClient = useRef(null);
  const userId = Number(localStorage.getItem('userId'));
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    // 채팅방 메시지 로드
    const loadMessages = async () => {
      try {
        const chatMessages = await chatApi.getChatMessages(roomId);
        console.log('채팅 메시지 응답:', chatMessages);
        setMessages(Array.isArray(chatMessages.messages) ? chatMessages.messages : []);
      } catch (error) {
        showToast.error('메시지 로드 실패');
        setMessages([]);
      }
    };

    // 채팅방 입장 시 읽음 처리
    const markAsRead = async () => {
      try {
        await chatApi.markAsRead(roomId);
        // 메시지 목록의 read 상태 업데이트
        setMessages(prev => 
          prev.map(msg => 
            msg.senderId !== userId ? { ...msg, read: true } : msg
          )
        );
      } catch (error) {
        console.error('메시지 읽음 처리 실패:', error);
      }
    };

    // SockJS + STOMP 연결
    const socket = new SockJS('http://localhost:8080/ws-chat');
    stompClient.current = new Client({
      webSocketFactory: () => socket,
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      onConnect: () => {
        // 구독
        stompClient.current.subscribe(`/topic/chat.${roomId}`, async (message) => {
          try {
            const parsed = JSON.parse(message.body);
            setMessages((prev) => Array.isArray(prev) ? [...prev, parsed] : [parsed]);
            
            // 새 메시지가 상대방으로부터 온 경우 읽음 처리
            if (parsed.senderId !== userId) {
              await markAsRead();
            }
          } catch (e) {}
        });
      },
      onStompError: (frame) => {
        console.error('STOMP error:', frame);
      },
    });
    stompClient.current.activate();

    loadMessages();
    markAsRead(); // 채팅방 입장 시 읽음 처리

    return () => {
      if (stompClient.current) {
        stompClient.current.deactivate();
      }
    };
  }, [roomId, token, userId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (
      stompClient.current &&
      stompClient.current.connected &&
      newMessage.trim()
    ) {
      stompClient.current.publish({
        destination: '/app/chat.send',
        body: JSON.stringify({
          chatRoomId: roomId,
          content: newMessage,
        }),
      });
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
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // 채팅방 나가기 -> 뒤로가기로 변경
  const handleGoBack = () => {
    navigate(-1); // 이전 페이지로 이동
  };

  return (
    <ChatContainer>
      <Header>
        <LeaveButton onClick={handleGoBack}>
          <IoArrowBack style={{ marginRight: '0.3rem' }} />
          뒤로가기
        </LeaveButton>
      </Header>
      <MessagesContainer>
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
        <SendButton onClick={handleSendMessage}>전송</SendButton>
      </InputContainer>
    </ChatContainer>
  );
};

export default ChatRoom; 