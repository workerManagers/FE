import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { chatApi } from '../../services/api';
import penguinImg from '../../assets/img/img2.png';

const DropdownContainer = styled.div`
  position: absolute;
  top: 120%;
  right: -200px;
  z-index: 2000;
  max-width: 420px;
  min-width: 320px;
  width: 100vw;
  width: 380px;
  background: linear-gradient(135deg, #23272f 60%, #18181b 100%);
  opacity: 0.97;
  border-radius: 38px 38px 32px 32px;
  box-shadow: 0 8px 40px rgba(0,0,0,0.25);
  border: 2.5px solid #e5e7eb;
  padding: 2.2rem 1.2rem 1.2rem 1.2rem;
  min-height: 400px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
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
  max-width: 380px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-height: 320px;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 0.5rem 0.2rem;
`;

const RoomCard = styled.div`
  display: flex;
  align-items: center;
  gap: 1.2rem;
  background: #f3f4f6;
  padding: 1.1rem 1.2rem;
  border-radius: 18px;
  border: 1.5px solid #e5e7eb;
  cursor: pointer;
  transition: none;
  box-shadow: 0 2px 8px rgba(180,180,200,0.06);
  position: relative;
  margin: 0.3rem 0;
`;

const ProfileCircle = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6366f1 60%, #a5b4fc 100%);
  color: #fff;
  font-size: 1.15rem;
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
  font-size: 1.01rem;
  font-weight: 700;
  color: #23272f;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const RoomTime = styled.div`
  font-size: 0.91rem;
  color: #a1a1aa;
  min-width: 60px;
  text-align: right;
`;

const RoomSub = styled.div`
  display: flex;
  align-items: center;
  gap: 0.7rem;
  margin-top: 0.1rem;
`;

const RoomName = styled.div`
  font-size: 0.93rem;
  color: #6366f1;
  font-weight: 500;
`;

const LastMessage = styled.div`
  font-size: 0.93rem;
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
  font-size: 0.8rem;
  font-weight: bold;
  margin-left: 0.7rem;
`;

const CloseBtn = styled.button`
  position: absolute;
  top: 12px;
  right: 18px;
  background: none;
  border: none;
  color: #e5e7eb;
  font-size: 1.5rem;
  cursor: pointer;
  z-index: 10;
`;

const ChatRoomListDropdown = ({ onClose }) => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const dropdownRef = useRef();

  useEffect(() => {
    const loadChatRooms = async () => {
      setLoading(true);
      try {
        const chatRooms = await chatApi.getChatRooms();
        setRooms(chatRooms.filter(room => room.lastMessage));
      } catch (error) {
        setRooms([]);
      } finally {
        setLoading(false);
      }
    };
    loadChatRooms();
  }, []);

  return (
    <DropdownContainer ref={dropdownRef}>
      <CloseBtn onClick={onClose}>&times;</CloseBtn>
      <NotchBar />
      <RoomList>
        {loading ? (
          <div style={{color:'#a3aab8',textAlign:'center',padding:'2rem 0'}}>로딩 중...</div>
        ) : rooms.length === 0 ? (
          <div style={{color:'#a3aab8',textAlign:'center',padding:'2rem 0'}}>채팅방이 없습니다.</div>
        ) : rooms.map((room) => {
          const isUnreadMessage = room.unreadCount > 0;
          const currentUserName = localStorage.getItem('userName');
          const otherUserName = currentUserName === room.user1Name ? room.user2Name : room.user1Name;
          const initials = otherUserName ? otherUserName[0] : '?';
          return (
            <RoomCard
              key={room.id}
              onClick={() => navigate(`/chat/${room.id}`)}
            >
              <ProfileCircle>
                <img src={penguinImg} alt="profile" style={{width:'100%',height:'100%',objectFit:'cover',display:'block'}} />
              </ProfileCircle>
              <RoomMain>
                <RoomTitleRow>
                  <RoomTitle>{room.jobName}</RoomTitle>
                  <RoomTime>
                    {room.lastMessageTime ? (() => {
                      try {
                        let date;
                        if (Array.isArray(room.lastMessageTime)) {
                          const [y, m, d, h, min] = room.lastMessageTime;
                          date = new Date(y, m - 1, d, h, min);
                        } else {
                          date = new Date(room.lastMessageTime);
                        }
                        if (isNaN(date.getTime())) return '';
                        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                      } catch (error) {
                        return '';
                      }
                    })() : ''}
                  </RoomTime>
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
    </DropdownContainer>
  );
};

export default ChatRoomListDropdown; 