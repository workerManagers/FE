import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { FaUserCircle, FaBookmark, FaComments } from 'react-icons/fa';
import { userApi, tokenService } from '../../services/api';
import { showToast } from './Toast';
import { chatApi } from '../../services/api';
import SessionTimer from './SessionTimer';
import SessionExtendModal from './SessionExtendModal';
import ChatRoomListDropdown from '../chat/ChatRoomListDropdown';

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.05rem 4vw 1.05rem 4vw;
  background: rgba(245,246,248,0.97);
  backdrop-filter: blur(18px) saturate(180%);
  box-shadow: 0 8px 32px rgba(30,41,59,0.07), 0 1.5px 6px rgba(0,0,0,0.03);
  border-radius: 0;
  border: none;
  border-bottom: 1.8px solidrgb(200, 206, 216);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  max-height: 75px;
`;

const LogoSection = styled.div`
  display: flex;
  align-items: center;
  gap: 2.8rem;
`;

const Logo = styled.h1`
  color: #23272f;
  font-size: 2.3rem;
  font-weight: 900;
  margin: 0;
  cursor: pointer;
  letter-spacing: -2.5px;
  text-shadow: 0 2px 16px rgba(163,170,184,0.10);
  transition: color 0.18s;
  border-radius: 14px;
  padding: 0.1rem 1.2rem 0.1rem 0.7rem;
  background: none;
  &:hover {
    color: #23272f;
    background: none;
    text-shadow: none;
  }
`;

const NavMenu = styled.nav`
  display: flex;
  gap: 0.7rem;
`;

const NavLink = styled.a`
  color: #23272f;
  text-decoration: none;
  font-size: 1.15rem;
  font-weight: 700;
  padding: 0.7rem 1.8rem;
  border-radius: 999px;
  cursor: pointer;
  transition: color 0.18s;
  position: relative;
  background: none;
  box-shadow: none;
  border: none;

  &:hover {
    color: #23272f;
    background: none;
    box-shadow: none;
  }
  &.active {
    color: #6B7280;
    font-weight: 900;
    background: none;
    box-shadow: none;
  }
`;

const UnreadBadge = styled.span`
  position: absolute;
  top: -7px;
  right: -7px;
  background: linear-gradient(90deg, #A3AAB8 0%, #E5E7EB 100%);
  color: #23272f;
  font-size: 0.72rem;
  padding: 2px 8px;
  border-radius: 12px;
  font-weight: bold;
  box-shadow: 0 2px 8px rgba(163,170,184,0.13);
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
`;

const WelcomeMessage = styled.span`
  color: #23272f;
  font-size: 1.01rem;
  font-weight: 600;
  margin-right: 0.5rem;
  letter-spacing: -0.5px;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  color: #6B7280;
  font-size: 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 0.5rem;
  border-radius: 50%;
  transition: background 0.18s, color 0.18s;
  position: relative;
  margin-right: -0.5rem;

  &:hover {
    background: rgba(163,170,184,0.09);
    color: #23272f;
  }
`;

const BookmarkCount = styled.span`
  position: absolute;
  top: 0;
  right: 0;
  background: linear-gradient(90deg, #A3AAB8 0%, #E5E7EB 100%);
  color: #23272f;
  font-size: 0.7rem;
  padding: 0.1rem 0.4rem;
  border-radius: 10px;
  min-width: 18px;
  text-align: center;
`;

const ProfileButton = styled.button`
  background: none;
  border: none;
  color: #6B7280;
  font-size: 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 0.5rem;
  border-radius: 50%;
  transition: background 0.18s, color 0.18s;

  &:hover {
    background: rgba(163,170,184,0.09);
    color: #23272f;
  }
`;

const AuthButton = styled(motion.button)`
  padding: 0.5rem 1.2rem;
  border: none;
  border-radius: 8px;
  font-size: 1.01rem;
  font-weight: 600;
  cursor: pointer;
  background: rgba(79, 70, 229, 0.1);
  color: #4F46E5;
  box-shadow: 0 2px 8px rgba(79, 70, 229, 0.15);
  transition: all 0.18s;

  &:hover {
    background: rgba(79, 70, 229, 0.15);
    color: #4F46E5;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(79, 70, 229, 0.2);
  }
`;

const ProfileDropdown = styled(motion.div)`
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 2rem;
  background: rgba(245,246,248,0.98);
  border-radius: 14px;
  box-shadow: 0 8px 32px rgba(163,170,184,0.13);
  padding: 0.7rem 0.5rem;
  min-width: 210px;
  z-index: 1001;
  margin-top: -0.5rem;
  border: 1.5px solid #E5E7EB;
`;

const DropdownItem = styled.div`
  padding: 0.7rem 1.2rem;
  color: #23272f;
  cursor: pointer;
  border-radius: 8px;
  transition: background 0.18s, color 0.18s;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background: #F3F4F6;
    color: #6B7280;
  }
`;

const Divider = styled.div`
  height: 1px;
  background: #e6eaf1;
  margin: 0.3rem 0;
`;

const TimerToggleButton = styled(motion.button)`
  background: rgba(123, 90, 255, 0.08);
  border: 1.5px solid #e6eaf1;
  color: #7B5AFF;
  cursor: pointer;
  font-size: 0.92rem;
  padding: 0.18rem 0.8rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.3rem;
  height: 32px;
  min-width: 100px;
  white-space: nowrap;
  font-weight: 600;
  position: static;
  margin: 0 -20px;
  box-shadow: 0 2px 8px rgba(123,90,255,0.07);
  transition: background 0.18s, color 0.18s;
  &:hover {
    background: rgba(123, 90, 255, 0.13);
    color: #5F3DC4;
  }
  &::before {
    content: '⏳';
    font-size: 1.1rem;
  }
`;

const TimerWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 32px;
  min-width: 110px;
  margin-right: 1.2rem;
`;

const Header = ({ isLoggedIn, userInfo, onLoginStatusChange }) => {
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [bookmarkCount, setBookmarkCount] = useState(0);
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);
  const [showExtendModal, setShowExtendModal] = useState(false);
  const [showTimer, setShowTimer] = useState(localStorage.getItem('showTimer') !== 'false');
  const [showChatList, setShowChatList] = useState(false);
  const chatIconRef = useRef();

  const toggleTimer = () => {
    const newShowTimer = !showTimer;
    setShowTimer(newShowTimer);
    localStorage.setItem('showTimer', newShowTimer.toString());
  };

  const checkUnreadMessages = async () => {
    if (!isLoggedIn) return;
    
    try {
      const response = await chatApi.getChatRooms();
      const hasUnread = response.some(room => room.unreadCount > 0);
      setHasUnreadMessages(hasUnread);
    } catch (error) {
      console.error('Failed to check unread messages:', error);
    }
  };

  // 새 메시지 확인
  useEffect(() => {
    if (isLoggedIn) {
      checkUnreadMessages();
      
      // 15초마다 새 메시지 확인
      const interval = setInterval(checkUnreadMessages, 15000);
      return () => clearInterval(interval);
    }
  }, [isLoggedIn]);

  // 페이지 포커스될 때마다 확인
  useEffect(() => {
    if (isLoggedIn) {
      const handleFocus = () => {
        checkUnreadMessages();
      };

      window.addEventListener('focus', handleFocus);
      return () => {
        window.removeEventListener('focus', handleFocus);
      };
    }
  }, [isLoggedIn]);

  // 북마크 수 가져오기
  useEffect(() => {
    if (isLoggedIn && userInfo?.userType === 'INDIVIDUAL') {
      // TODO: 북마크 수를 가져오는 API 호출
    }
  }, [isLoggedIn, userInfo]);

  // 프로필 드롭다운 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isProfileOpen && !event.target.closest('.profile-menu')) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileOpen]);

  // 세션 만료 체크
  useEffect(() => {
    if (isLoggedIn) {
      const checkSessionExpiry = () => {
        const remainingTime = tokenService.getRemainingTime();
        if (remainingTime <= 5 * 60 * 1000 && remainingTime > 0) {
          setShowExtendModal(true);
        }
      };

      // 1분마다 세션 만료 체크
      const expiryCheckInterval = setInterval(checkSessionExpiry, 60000);
      return () => clearInterval(expiryCheckInterval);
    }
  }, [isLoggedIn]);

  // 외부 클릭 시 닫기
  useEffect(() => {
    if (!showChatList) return;
    const handleClick = (e) => {
      if (chatIconRef.current && !chatIconRef.current.contains(e.target)) {
        setShowChatList(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showChatList]);

  const handleLogout = () => {
    tokenService.clearTokens();
    if (onLoginStatusChange) {
      onLoginStatusChange(false, null);
    }
    navigate('/login', { replace: true });
    setTimeout(() => {
      showToast.success('로그아웃되었습니다.');
    }, 100);
  };

  return (
    <HeaderContainer>
      <LogoSection>
        <Logo onClick={() => navigate('/')}>급구당</Logo>
        <NavMenu>
          {isLoggedIn && userInfo?.userType === 'COMPANY' && (
            <>
              {/* <NavLink onClick={() => navigate('/jobpost')}>채용공고</NavLink> */}
              <NavLink onClick={() => navigate('/add-job')}>직무 추가</NavLink>
              <NavLink onClick={() => navigate('/predict')}>요양기간 예측</NavLink>
              <NavLink onClick={() => navigate('/matching')}>대체인력 매칭</NavLink>
            </>
          )}
          {isLoggedIn && userInfo?.userType === 'INDIVIDUAL' && (
            <>
              <NavLink onClick={() => navigate('/job-matching')}>채용공고 매칭</NavLink>
              <NavLink onClick={() => navigate('/applications/my-applications')}>지원내역</NavLink>
            </>
          )}
        </NavMenu>
      </LogoSection>

      <UserSection>
        {isLoggedIn ? (
          <>
            <TimerWrapper>
              {!showTimer && (
                <TimerToggleButton
                  onClick={toggleTimer}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  타이머
                </TimerToggleButton>
              )}
              {showTimer && <SessionTimer onToggle={toggleTimer} />}
            </TimerWrapper>
            {userInfo?.userType === 'INDIVIDUAL' && (
              <IconButton onClick={() => navigate('/bookmarks')} title="찜한 공고">
                <FaBookmark />
                {bookmarkCount > 0 && <BookmarkCount>{bookmarkCount}</BookmarkCount>}
              </IconButton>
            )}
            <IconButton
              ref={chatIconRef}
              style={{ position: 'relative' }}
              onClick={() => setShowChatList(v => !v)}
              title="채팅 목록"
            >
              <FaComments />
              {hasUnreadMessages && <UnreadBadge>NEW</UnreadBadge>}
              {showChatList && (
                <ChatRoomListDropdown onClose={() => setShowChatList(false)} />
              )}
            </IconButton>
            <ProfileButton 
              className="profile-menu"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
            >
              <FaUserCircle />
            </ProfileButton>
            {isProfileOpen && (
              <ProfileDropdown
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="profile-menu"
              >
                <DropdownItem onClick={() => {
                  navigate('/profile');
                  setIsProfileOpen(false);
                }}>
                  내 정보
                </DropdownItem>
                {userInfo?.userType === 'COMPANY' && (
                  <>
                    <Divider />
                    <DropdownItem onClick={() => {
                      navigate('/jobpost');
                      setIsProfileOpen(false);
                    }}>
                      내 공고
                    </DropdownItem>
                  </>
                )}
                {userInfo?.userType === 'INDIVIDUAL' && (
                  <>
                    <Divider />
                    <DropdownItem onClick={() => {
                      navigate('/resume');
                      setIsProfileOpen(false);
                    }}>
                      내 이력서
                    </DropdownItem>
                  </>
                )}
                <Divider />
                <DropdownItem onClick={handleLogout}>
                  로그아웃
                </DropdownItem>
              </ProfileDropdown>
            )}
            <WelcomeMessage>{userInfo?.userName}</WelcomeMessage>
          </>
        ) : (
          <>
            <AuthButton
              variant="login"
              onClick={() => navigate('/login')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              로그인
            </AuthButton>
            <AuthButton
              variant="signup"
              onClick={() => navigate('/signup')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              회원가입
            </AuthButton>
          </>
        )}
      </UserSection>
      {showExtendModal && (
        <SessionExtendModal onClose={() => setShowExtendModal(false)} />
      )}
    </HeaderContainer>
  );
};

export default Header;