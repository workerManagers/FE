import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { chatApi } from '../../services/api';
import { userApi } from '../../services/api';
import { showToast } from '../common/Toast';
import { IoArrowBack } from 'react-icons/io5';

const PageContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: white;
  padding: 6rem 2rem 2rem;
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
  position: relative;

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
  display: flex;
  align-items: center;
  gap: 8px;
`;

const UnreadBadge = styled.span`
  background: #ff4757;
  color: white;
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 0.8rem;
  font-weight: bold;
  position: absolute;
  top: -10px;
  left: -10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`;

const HeaderUnreadBadge = styled(UnreadBadge)`
  position: static;
  font-size: 0.7rem;
  padding: 1px 6px;
`;

const NewMessageIndicator = styled.span`
  color: #ff4757;
  font-weight: bold;
  font-size: 0.8rem;
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

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(10px);
  border-radius: 24px;
  border: 3px solid rgba(0, 0, 0, 0.3);
  margin-top: 2rem;
`;

const LoadingSpinner = styled.div`
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ChatRoomList = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const jobPostId = queryParams.get('jobPostId');

  useEffect(() => {
    window.scrollTo(0, 0);
    
    const loadChatRooms = async () => {
      setLoading(true);
      try {
        const chatRooms = await chatApi.getChatRooms();
        console.log('채팅방 목록:', chatRooms);
        
        // 각 채팅방의 사용자 정보를 조회하여 기업/일반회원 구분
        const roomsWithUserTypes = chatRooms.map(room => {
          try {
            console.log(`\n채팅방 ${room.id} 사용자 정보:`);
            console.log('User1:', {
              name: room.user1Name,
              email: room.user1Email
            });
            console.log('User2:', {
              name: room.user2Name,
              email: room.user2Email
            });

            // 이메일이 test1@naver.com인 사용자가 기업회원
            const isUser1Company = room.user1Email === 'test1@naver.com';
            const isUser2Company = room.user2Email === 'test1@naver.com';

            const updatedRoom = {
              ...room,
              // 기업회원(test1@naver.com)이 담당자, 나머지가 문의자
              recruiterName: isUser2Company ? room.user2Name : room.user1Name,
              applicantName: isUser2Company ? room.user1Name : room.user2Name
            };

            console.log('변환된 채팅방 정보:', {
              id: room.id,
              user1: {
                name: room.user1Name,
                email: room.user1Email,
                isCompany: isUser1Company
              },
              user2: {
                name: room.user2Name,
                email: room.user2Email,
                isCompany: isUser2Company
              },
              recruiter: updatedRoom.recruiterName,
              applicant: updatedRoom.applicantName
            });

            return updatedRoom;
          } catch (error) {
            console.error(`채팅방 ${room.id} 사용자 정보 조회 실패:`, error);
            return room;
          }
        });

        // jobPostId가 있는 경우 해당 공고의 채팅방만 필터링하고, 마지막 메시지가 있는 채팅방만 표시
        const filteredRooms = roomsWithUserTypes
          .filter(room => room.lastMessage)
          .filter(room => !jobPostId || room.jobPostId === Number(jobPostId));

        console.log('최종 필터링된 채팅방 목록:', filteredRooms);
        setRooms(filteredRooms);
      } catch (error) {
        console.error('채팅방 목록 로드 실패:', error);
        showToast.error('채팅방 목록을 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
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
          <Title>{jobPostId ? '1대1 문의 목록' : '전체 채팅방'}</Title>
        </Header>
        
        {loading ? (
          <LoadingContainer>
            <LoadingSpinner />
          </LoadingContainer>
        ) : rooms.length === 0 ? (
          <EmptyState>
            {jobPostId ? '이 공고에 대한 1대1 문의가 없습니다.' : '1대1 문의가 없습니다.'}
          </EmptyState>
        ) : (
          rooms.map((room) => {
            const isUnreadMessage = room.unreadCount > 0;
            const currentUserName = localStorage.getItem('userName');
            const isLastMessageFromOther = room.lastMessage && currentUserName === room.user1Name ? 
              room.user2Name : room.user1Name;

            return (
              <RoomCard
                key={room.id}
                onClick={() => handleRoomClick(room.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isUnreadMessage && <UnreadBadge>NEW</UnreadBadge>}
                <RoomTitle>{room.jobName || '1대1 문의'}</RoomTitle>
                <RoomInfo>
                  <span>
                    {localStorage.getItem('userType') === 'COMPANY' ? '문의자' : '담당자'}
                    : {currentUserName === room.user1Name ? room.user2Name : room.user1Name}
                  </span>
                  <span>{new Date(room.createdAt).toLocaleString()}</span>
                </RoomInfo>
                {room.lastMessage && (
                  <LastMessage>
                    <span style={{
                      color: isUnreadMessage && isLastMessageFromOther ? '#000' : 'inherit',
                      fontWeight: isUnreadMessage && isLastMessageFromOther ? 'bold' : 'normal'
                    }}>
                      {room.lastMessage}
                    </span>
                    {room.lastMessageTime && (
                      <span style={{ fontSize: '0.8rem', color: 'rgba(0, 0, 0, 0.5)' }}>
                        ({new Date(room.lastMessageTime).toLocaleString()})
                      </span>
                    )}
                  </LastMessage>
                )}
              </RoomCard>
            );
          })
        )}
      </RoomListContainer>
    </PageContainer>
  );
};

export default ChatRoomList; 