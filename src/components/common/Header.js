import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const HeaderContainer = styled.header`
  width: 100%;
  height: 60px;
  background-color: #000000;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2rem;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  cursor: pointer;
`;

const Nav = styled.nav`
  display: flex;
  gap: 1.5rem;
  align-items: center;
`;

const NavButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  padding: 0.5rem 1rem;
  transition: all 0.2s ease;

  &:hover {
    opacity: 0.8;
  }
`;

const Header = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const userName = localStorage.getItem('userName');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    navigate('/login');
  };

  return (
    <HeaderContainer>
      <Logo onClick={() => navigate('/')}>급구당</Logo>
      <Nav>
        {token ? (
          <>
            <span>{userName}님 환영합니다</span>
            <NavButton onClick={handleLogout}>로그아웃</NavButton>
          </>
        ) : (
          <>
            <NavButton onClick={() => navigate('/login')}>로그인</NavButton>
            <NavButton onClick={() => navigate('/signup')}>회원가입</NavButton>
          </>
        )}
      </Nav>
    </HeaderContainer>
  );
};

export default Header; 