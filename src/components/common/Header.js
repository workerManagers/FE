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

  const handleLogout = async () => {
    try {
      await userApi.logout();
      localStorage.removeItem('token');
      localStorage.removeItem('userType');
      if (typeof onLoginStatusChange === 'function') {
        onLoginStatusChange(false, null);
      }
      navigate('/');
      showToast.success('로그아웃되었습니다.');
    } catch (error) {
      console.error('로그아웃 실패:', error);
      showToast.error('로그아웃에 실패했습니다.');
    }
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
              <NavLink onClick={() => navigate('/resume')}>내 이력서</NavLink>
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
            {isProfileOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                style={{
                  position: 'absolute',
                  top: '100%',
                  right: '2rem',
                  background: 'white',
                  padding: '1rem',
                  borderRadius: '8px',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                  zIndex: 1000,
                }}
              >
                <div style={{ marginBottom: '0.5rem' }}>{userInfo?.username}님</div>
                <button
                  onClick={handleLogout}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#dc3545',
                    cursor: 'pointer',
                    padding: '0.5rem',
                    width: '100%',
                    textAlign: 'left',
                  }}
                >
                  로그아웃
                </button>
              </motion.div>
            )}
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