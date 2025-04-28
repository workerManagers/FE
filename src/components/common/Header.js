import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
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
  gap: 1rem;
`;

const WelcomeMessage = styled.span`
  color: white;
  font-size: 0.9rem;
  font-weight: 500;
  margin-right: 0.5rem;
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

const Header = ({ isLoggedIn, userInfo, onLoginStatusChange }) => {
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = () => {
    // 1. localStorage 정리
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    localStorage.removeItem('userName');
    localStorage.removeItem('userId');
    
    // 2. 부모 컴포넌트에 로그아웃 알림
    if (onLoginStatusChange) {
      onLoginStatusChange(false, null);
    }
    
    // 3. 페이지 이동 후 토스트 메시지 표시
    navigate('/login', { replace: true });
    setTimeout(() => {
      showToast.success('로그아웃되었습니다.');
    }, 100);
  };

  // 로그인 상태에 따라 메뉴 표시 여부 결정
  const shouldShowCompanyMenu = isLoggedIn && userInfo?.userType === 'COMPANY';
  const shouldShowIndividualMenu = isLoggedIn && userInfo?.userType === 'INDIVIDUAL';

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
              <NavLink onClick={() => navigate('/resume')}>내 이력서</NavLink>
              <NavLink onClick={() => navigate('/bookmarks')}>찜한 공고</NavLink>
            </>
          )}
        </NavMenu>
      </LogoSection>

      <UserSection>
        {isLoggedIn ? (
          <>
            <ProfileButton onClick={() => setIsProfileOpen(!isProfileOpen)}>
              <FaUserCircle />
            </ProfileButton>
            <WelcomeMessage>{userInfo?.userName}</WelcomeMessage>
            <AuthButton
              variant="logout"
              onClick={handleLogout}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              로그아웃
            </AuthButton>
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