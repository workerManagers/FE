import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { chatApi } from '../../services/api';
import { showToast } from '../common/Toast';
import { IoArrowBack } from 'react-icons/io5';

const PageContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: white;
  padding: 2rem;
`;

const RoomListContainer = styled.div`
  max-width: 800px;
  width: 100%;
  margin: 0 auto;
  min-height: calc(100vh - 8rem);
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 2.5rem;
  position: sticky;
  top: 0;
  z-index: 10;
  background: white;
  padding: 1rem 0;
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

const Title = styled.h2`
  margin: 0;
  font-size: 2rem;
  color: #000000;
  font-weight: 600;
  margin-left: 1.5rem;
  position: relative;

  &:after {
    content: '';
    position: absolute;
    left: 0;
    bottom: -10px;
    width: 60px;
    height: 3px;
    background-color: #000000;
    transition: width 0.3s ease;
  }

  &:hover:after {
    width: 120px;
  }
`;

const RoomCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(10px);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  border-radius: 24px;
  border: 3px solid rgba(0, 0, 0, 0.3);
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.15);

  &:hover {
    transform: translateY(-5px);
    border: 3px solid rgba(0, 0, 0, 0.4);
    box-shadow: 0 12px 48px 0 rgba(0, 0, 0, 0.2);
  }

  &:first-child {
    margin-top: 1rem;
  }
`;

const RoomTitle = styled.h3`
  margin: 0;
  color: #000000;
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 1rem;
`;

const RoomInfo = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
  color: rgba(0, 0, 0, 0.6);
  font-size: 0.9rem;
  gap: 1rem;
  flex-wrap: wrap;
`;

const LastMessage = styled.p`
  margin: 1rem 0 0;
  color: rgba(0, 0, 0, 0.6);
  font-size: 0.9rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: rgba(0, 0, 0, 0.6);
  font-size: 1.1rem;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(10px);
  border-radius: 24px;
  border: 3px solid rgba(0, 0, 0, 0.3);
  margin-top: 2rem;
`;

const ChatRoomList = () => {
  const [rooms, setRooms] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const jobPostId = queryParams.get('jobPostId');

  useEffect(() => {
    // 페이지 로드 시 스크롤을 맨 위로 이동
    window.scrollTo(0, 0);
    
    const loadChatRooms = async () => {
      try {
        const chatRooms = await chatApi.getRecruiterChatRooms();
        const filteredRooms = jobPostId 
          ? chatRooms.filter(room => room.jobPostId === Number(jobPostId))
          : chatRooms;
        setRooms(filteredRooms);
      } catch (error) {
        showToast.error('채팅방 목록 로드 실패');
      }
    };

    loadChatRooms();
  }, [jobPostId]);

  const handleRoomClick = (roomId) => {
    navigate(`/chat/${roomId}`);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <PageContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <RoomListContainer>
        <Header>
          <BackButton
            onClick={handleGoBack}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <IoArrowBack style={{ marginRight: '0.5rem' }} />
            뒤로가기
          </BackButton>
          <Title>{jobPostId ? '1대1 문의 목록' : '전체 1대1 문의 목록'}</Title>
        </Header>
        {rooms.length === 0 ? (
          <EmptyState>
            {jobPostId ? '이 공고에 대한 1대1 문의가 없습니다.' : '1대1 문의가 없습니다.'}
          </EmptyState>
        ) : (
          rooms.map((room) => (
            <RoomCard
              key={room.id}
              onClick={() => handleRoomClick(room.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <RoomTitle>{room.jobName}</RoomTitle>
              <RoomInfo>
                <span>문의자: {room.applicantName}</span>
                <span>담당자: {room.recruiterName}</span>
                <span>{new Date(room.createdAt).toLocaleString()}</span>
              </RoomInfo>
            </RoomCard>
          ))
        )}
      </RoomListContainer>
    </PageContainer>
  );
};

export default ChatRoomList; 