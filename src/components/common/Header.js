import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { FaUserCircle, FaBookmark } from 'react-icons/fa';
import { userApi } from '../../services/api';
import { showToast } from './Toast';

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: linear-gradient(135deg,rgb(0, 0, 0) 0%,rgb(0, 0, 0) 100%);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
`;

const LogoSection = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
`;

const Logo = styled.h1`
  color: white;
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0;
  cursor: pointer;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const NavMenu = styled.nav`
  display: flex;
  gap: 1rem;
`;

const NavLink = styled.a`
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  font-size: 1rem;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    color: white;
  }

  &.active {
    color: white;
    background-color: rgba(255, 255, 255, 0.15);
    font-weight: 600;
  }
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
`;

const WelcomeMessage = styled.span`
  color: white;
  font-size: 0.9rem;
  font-weight: 500;
  margin-right: 0.5rem;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 0.5rem;
  border-radius: 50%;
  transition: all 0.2s ease;
  position: relative;
  margin-right: -0.5rem;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const BookmarkCount = styled.span`
  position: absolute;
  top: 0;
  right: 0;
  background-color: #ff4757;
  color: white;
  font-size: 0.7rem;
  padding: 0.1rem 0.4rem;
  border-radius: 10px;
  min-width: 18px;
  text-align: center;
`;

const ProfileButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 0.5rem;
  border-radius: 50%;
  transition: all 0.2s ease;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const AuthButton = styled(motion.button)`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  background-color: ${props => props.variant === 'login' ? 'white' : 'rgba(255, 255, 255, 0.1)'};
  color: ${props => props.variant === 'login' ? '#1a237e' : 'white'};
  transition: all 0.2s ease;

  &:hover {
    background-color: ${props => props.variant === 'login' ? '#f8f9fa' : 'rgba(255, 255, 255, 0.2)'};
  }
`;

const ProfileDropdown = styled(motion.div)`
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 0.5rem;
  min-width: 200px;
  z-index: 1001;
  margin-top: -0.5rem;
`;

const DropdownItem = styled.div`
  padding: 0.6rem 1rem;
  color: #333;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background-color: #f8f9fa;
  }
`;

const Divider = styled.div`
  height: 1px;
  background-color: #dee2e6;
  margin: 0.3rem 0;
`;

const Header = ({ isLoggedIn, userInfo, onLoginStatusChange }) => {
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [bookmarkCount, setBookmarkCount] = useState(0);

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

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    localStorage.removeItem('userName');
    localStorage.removeItem('userId');
    
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
              <NavLink onClick={() => navigate('/jobpost')}>채용공고</NavLink>
              <NavLink onClick={() => navigate('/add-job')}>직무 추가</NavLink>
              <NavLink onClick={() => navigate('/predict')}>요양기간 예측</NavLink>
              <NavLink onClick={() => navigate('/matching')}>대체인력 매칭</NavLink>
            </>
          )}
          {isLoggedIn && userInfo?.userType === 'INDIVIDUAL' && (
            <>
              <NavLink onClick={() => navigate('/job-matching')}>직무 매칭</NavLink>
            </>
          )}
        </NavMenu>
      </LogoSection>

      <UserSection>
        {isLoggedIn ? (
          <>
            {userInfo?.userType === 'INDIVIDUAL' && (
              <IconButton onClick={() => navigate('/bookmarks')} title="찜한 공고">
                <FaBookmark />
                {bookmarkCount > 0 && <BookmarkCount>{bookmarkCount}</BookmarkCount>}
              </IconButton>
            )}
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
    </HeaderContainer>
  );
};

export default Header;