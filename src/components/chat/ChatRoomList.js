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
  background-color: #f8f9fa;
  padding: 6rem 0 2rem;
`;

const RoomListContainer = styled.div`
  max-width: 1100px;
  width: 100%;
  margin: 0 auto;
  min-height: calc(100vh - 8rem);
  background: #fff;
  border-radius: 28px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.09);
  padding: 2.5rem 2.5rem 2.5rem 2.5rem;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 2.5rem;
  position: sticky;
  top: 0;
  z-index: 10;
  background: rgba(255,255,255,0.85);
  backdrop-filter: blur(8px);
  padding: 1.2rem 0 1.2rem 0;
  border-radius: 18px 18px 0 0;
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
  margin-right: 1.2rem;
  &:hover {
    background: linear-gradient(90deg, #e5e7eb 0%, #f3f4f6 100%);
    color: #6366f1;
    box-shadow: 0 4px 20px rgba(180,180,200,0.18);
    transform: translateY(-2px) scale(1.03);
  }
`;

const Title = styled.h2`
  margin: 0;
  font-size: 2.1rem;
  color: #23272f;
  font-weight: 700;
  margin-left: 1.5rem;
  position: relative;
  letter-spacing: -0.5px;
  &:after {
    content: '';
    position: absolute;
    left: 0;
    bottom: -10px;
    width: 90px;
    height: 3px;
    background-color: #6366f1;
    transition: width 0.3s ease;
  }
  &:hover:after {
    width: 170px;
  }
`;

const RoomCard = styled(motion.div)`
  background: #fff;
  padding: 1.5rem 1.3rem 1.3rem 1.3rem;
  margin-bottom: 1.2rem;
  border-radius: 18px;
  border: 1.5px solid #e5e7eb;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 12px rgba(180,180,200,0.10);
  position: relative;
  &:hover {
    transform: translateY(-5px) scale(1.02);
    border: 1.5px solid #6366f1;
    box-shadow: 0 8px 32px 0 rgba(99,102,241,0.13);
  }
  &:first-child {
    margin-top: 1rem;
  }
`;

const RoomTitle = styled.h3`
  margin: 0;
  color: #23272f;
  font-size: 1.15rem;
  font-weight: 700;
  margin-bottom: 0.7rem;
`;

const RoomInfo = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 0.5rem;
  color: #6b7280;
  font-size: 0.97rem;
  gap: 1rem;
  flex-wrap: wrap;
`;

const LastMessage = styled.p`
  margin: 1rem 0 0;
  color: #23272f;
  font-size: 0.97rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const UnreadBadge = styled.span`
  background: #6366f1;
  color: white;
  padding: 2px 10px;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: bold;
  position: absolute;
  top: -10px;
  left: -10px;
  box-shadow: 0 2px 4px rgba(99,102,241,0.13);
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
  padding: 3rem 1rem;
  color: #a3aab8;
  font-size: 1.13rem;
  background: #f4f5f7;
  border-radius: 24px;
  border: 1.5px solid #e5e7eb;
  margin-top: 2rem;
  box-shadow: 0 2px 8px rgba(180,180,200,0.07);
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  background: #f4f5f7;
  border-radius: 24px;
  border: 1.5px solid #e5e7eb;
  margin-top: 2rem;
  box-shadow: 0 2px 8px rgba(180,180,200,0.07);
`;

const LoadingSpinner = styled.div`
  width: 44px;
  height: 44px;
  border: 5px solid #e5e7eb;
  border-top: 5px solid #6366f1;
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
                <RoomTitle>{room.jobName}</RoomTitle>
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