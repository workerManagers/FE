import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
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
    transform: translateY(-1px);
  }
`;

const Header = ({ isLoggedIn, userInfo, onLoginStatusChange }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await userApi.logout();
      localStorage.removeItem('token');
      onLoginStatusChange(false, null);
      showToast.success('로그아웃되었습니다.');
      navigate('/login');
    } catch (error) {
      console.error('로그아웃 중 오류:', error);
      showToast.error('로그아웃 중 오류가 발생했습니다.');
    }
  };

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <HeaderContainer>
      <LogoSection>
        <Logo onClick={() => navigate('/')}>급구당</Logo>
        <NavMenu>
          {isLoggedIn && userInfo?.userType === 'COMPANY' && (
            <>
              <NavLink onClick={() => navigate('/jobpost')}>모집공고</NavLink>
              <NavLink onClick={() => navigate('/add-job')}>직무 추가</NavLink>
              <NavLink onClick={() => navigate('/predict')}>요양기간 예측</NavLink>
              <NavLink onClick={() => navigate('/matching')}>대체인력 매칭</NavLink>
            </>
          )}
          {isLoggedIn && userInfo?.userType === 'INDIVIDUAL' && (
            <>
              <NavLink onClick={() => navigate('/jobs')}>채용공고</NavLink>
              <NavLink onClick={() => navigate('/profile')}>내 프로필</NavLink>
            </>
          )}
        </NavMenu>
      </LogoSection>
      <UserSection>
        {isLoggedIn ? (
          <>
            <ProfileButton>
              <FaUserCircle />
            </ProfileButton>
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
          <AuthButton
            variant="login"
            onClick={handleLogin}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            로그인
          </AuthButton>
        )}
      </UserSection>
    </HeaderContainer>
  );
};

export default Header; 