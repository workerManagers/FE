import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';
import { chatApi } from '../../services/api';
import { showToast } from '../common/Toast';
import { IoArrowBack } from 'react-icons/io5';

const RoomListContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  padding: 0.8rem 1.5rem;
  border: 1.5px solid #e0e0e0;
  border-radius: 4px;
  background-color: white;
  color: #181818;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  margin-right: 1rem;
  transition: all 0.2s ease;

  &:hover {
    background-color: #f8f9fa;
    transform: translateY(-2px);
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
`;

const Title = styled.h2`
  margin: 0;
  font-size: 1.5rem;
  color: #181818;
`;

const RoomCard = styled.div`
  background-color: white;
  border-radius: 0.5rem;
  padding: 1rem;
  margin-bottom: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
  }
`;

const RoomTitle = styled.h3`
  margin: 0;
  color: #333;
  font-size: 1.1rem;
`;

const RoomInfo = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 0.5rem;
  color: #666;
  font-size: 0.9rem;
`;

const LastMessage = styled.p`
  margin: 0.5rem 0 0;
  color: #666;
  font-size: 0.9rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ChatRoomList = () => {
  const [rooms, setRooms] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const jobPostId = queryParams.get('jobPostId');

  useEffect(() => {
    const loadChatRooms = async () => {
      try {
        const chatRooms = await chatApi.getRecruiterChatRooms();
        // jobPostId가 있으면 해당 공고의 채팅방만 필터링
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
    <RoomListContainer>
      <Header>
        <BackButton onClick={handleGoBack}>
          <IoArrowBack style={{ marginRight: '0.3rem' }} />
          뒤로가기
        </BackButton>
        <Title>{jobPostId ? '1대1 문의 목록' : '전체 1대1 문의 목록'}</Title>
      </Header>
      {rooms.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
          {jobPostId ? '이 공고에 대한 1대1 문의가 없습니다.' : '1대1 문의가 없습니다.'}
        </div>
      ) : (
        rooms.map((room) => (
          <RoomCard key={room.id} onClick={() => handleRoomClick(room.id)}>
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
  );
};

export default ChatRoomList; 