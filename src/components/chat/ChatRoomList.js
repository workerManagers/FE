import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { chatApi } from '../../services/api';
import { userApi } from '../../services/api';
import { showToast } from '../common/Toast';
import { IoArrowBack } from 'react-icons/io5';
import penguinImg from '../../assets/img/img2.png';
import Loading from '../../components/common/Loading';

const PageContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f8f9fa;
  padding: 6rem 0 2rem;
`;

const RoomListContainer = styled.div`
  max-width: 640px;
  margin: 0 auto;
  padding-top: 6rem;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: flex-start;
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


const PhoneContainer = styled.div`
  max-width: 640px;
  min-width: 320px;
  width: 100%;
  background: linear-gradient(135deg, #23272f 60%, #18181b 100%);
  opacity: 0.97;
  border-radius: 38px 38px 32px 32px;
  box-shadow: 0 8px 40px rgba(0,0,0,0.25);
  border: 2.5px solid #e5e7eb;
  padding: 2.5rem 1.5rem;
  margin-top: -25px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  min-height: 600px;
  position: relative;
`;

const NotchBar = styled.div`
  width: 60px;
  height: 7px;
  background: #e5e7eb;
  border-radius: 8px;
  margin: 0 auto 1.2rem auto;
`;

const RoomList = styled.div`
  width: 100%;
  max-width: 640px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-height: 400px;
  overflow-y: scroll;
  overflow-x: hidden;
  padding: 1.2rem 1.2rem;
`;

const RoomCard = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 1.2rem;
  background: #f3f4f6;
  padding: 1.1rem 1.5rem;
  border-radius: 18px;
  border: 1.5px solid #e5e7eb;
  cursor: pointer;
  transition: none;
  box-shadow: 0 2px 8px rgba(180,180,200,0.06);
  position: relative;
`;

const ProfileCircle = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6366f1 60%, #a5b4fc 100%);
  color: #fff;
  font-size: 1.35rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: hidden;
`;

const RoomMain = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
`;

const RoomTitleRow = styled.div`
  display: flex;
  align-items: center;
  background: transparent;
  justify-content: space-between;
  gap: 1rem;
`;

const RoomTitle = styled.div`
  font-size: 1.08rem;
  font-weight: 700;
  color: #23272f;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const RoomTime = styled.div`
  font-size: 0.93rem;
  color: #a1a1aa;
  min-width: 70px;
  text-align: right;
`;

const RoomSub = styled.div`
  display: flex;
  align-items: center;
  gap: 0.7rem;
  margin-top: 0.1rem;
`;

const RoomName = styled.div`
  font-size: 0.97rem;
  color: #6366f1;
  font-weight: 500;
`;

const LastMessage = styled.div`
  font-size: 0.97rem;
  color: #6b7280;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
`;

const UnreadBadge = styled.span`
  background: #6366f1;
  color: white;
  padding: 2px 10px;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: bold;
  margin-left: 0.7rem;
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
        
        // 각 채팅방의 사용자 정보를 조회하여 기업/일반회원 구분
        const roomsWithUserTypes = chatRooms.map(room => {
          try {
            // 이메일이 test1@naver.com인 사용자가 기업회원
            const isUser1Company = room.user1Email === 'test1@naver.com';
            const isUser2Company = room.user2Email === 'test1@naver.com';

            const updatedRoom = {
              ...room,
              // 기업회원(test1@naver.com)이 담당자, 나머지가 문의자
              recruiterName: isUser2Company ? room.user2Name : room.user1Name,
              applicantName: isUser2Company ? room.user1Name : room.user2Name
            };

            return updatedRoom;
          } catch (error) {
            return room;
          }
        });

        // jobPostId가 있는 경우 해당 공고의 채팅방만 필터링하고, 마지막 메시지가 있는 채팅방만 표시
        const filteredRooms = roomsWithUserTypes
          .filter(room => room.lastMessage)
          .filter(room => !jobPostId || room.jobPostId === Number(jobPostId));

        setRooms(filteredRooms);
      } catch (error) {
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
          {/* <Title>{jobPostId ? '1대1 문의 목록' : '전체 채팅방'}</Title> */}
        </Header>
        
        {loading ? (
          <Loading message="채팅방 목록을 불러오는 중입니다..." />
        ) : rooms.length === 0 ? (
          <EmptyState>
            {jobPostId ? '이 공고에 대한 1대1 문의가 없습니다.' : '1대1 문의가 없습니다.'}
          </EmptyState>
        ) : (
          <PhoneContainer>
            <NotchBar />
            <RoomList>
              {rooms.map((room) => {
                const isUnreadMessage = room.unreadCount > 0;
                const currentUserName = localStorage.getItem('userName');
                const otherUserName = currentUserName === room.user1Name ? room.user2Name : room.user1Name;
                const initials = otherUserName ? otherUserName[0] : '?';
                return (
                  <RoomCard
                    key={room.id}
                    onClick={() => handleRoomClick(room.id)}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <ProfileCircle>
                      <img src={penguinImg} alt="profile" style={{width:'100%',height:'100%',objectFit:'cover',display:'block'}} />
                    </ProfileCircle>
                    <RoomMain>
                      <RoomTitleRow>
                        <RoomTitle>{room.jobName}</RoomTitle>
                        <RoomTime>{room.lastMessageTime ? new Date(room.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</RoomTime>
                      </RoomTitleRow>
                      <RoomSub>
                        <RoomName>{otherUserName}</RoomName>
                        <LastMessage>{room.lastMessage || ''}</LastMessage>
                        {isUnreadMessage && <UnreadBadge>NEW</UnreadBadge>}
                      </RoomSub>
                    </RoomMain>
                  </RoomCard>
                );
              })}
            </RoomList>
          </PhoneContainer>
        )}
      </RoomListContainer>
    </PageContainer>
  );
};

export default ChatRoomList; 