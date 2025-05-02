import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaUserCircle, FaSearch } from 'react-icons/fa';

const HeaderContainer = styled.header`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(12px);
  padding: 1rem 2rem;
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 1000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

  /* 네비게이션 바와 그 아래 내용 구분을 위한 검은 선 추가 */
  border-bottom: 2px solid #111;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const LogoSection = styled.div`
  display: flex;
  justify-content: space-between;  /* 로고와 검색창, 로그인 버튼을 같은 줄에 배치 */
  align-items: center;
  width: 100%;
  max-width: 1200px;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const Logo = styled.h1`
  color: #000;
  font-size: 1.6rem;
  font-weight: 700;
  cursor: pointer;
  margin-right: 1.5rem;

  @media (max-width: 768px) {
    font-size: 1.4rem;
  }
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  background-color: #f5f5f5;
  border-radius: 999px;
  padding: 0.4rem 1rem;
  border: 1.5px solid black;
  transition: all 0.3s ease;
  width: 50%; /* 길이를 50%로 줄임 */

  input {
    flex: 1;
    border: none;
    outline: none;
    background: transparent;
    font-size: 0.95rem;
    color: #333;

    &::placeholder {
      color: #999;
    }

    &:focus::placeholder {
      color: #000;
    }
  }

  svg {
    color: #666;
    font-size: 1.1rem;
    margin-left: 0.5rem;
  }

  @media (max-width: 768px) {
    width: 60%;  /* 모바일에서 검색창 너비를 60%로 조정 */
  }
`;

const NavBar = styled.nav`
  display: flex;
  justify-content: center;  /* 네비게이션 항목 가운데 정렬 */
  align-items: center;
  gap: 3rem;  /* 네비게이션 항목 간의 간격을 3rem으로 설정 */
  width: 100%;
  max-width: 1200px;
  margin-top: 0.5rem;

  @media (max-width: 768px) {
    gap: 1.5rem;  /* 모바일에서 간격 좁힘 */
    flex-wrap: wrap;
    justify-content: center;
  }
`;

const NavLink = styled.span`
  color: #111;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: 0.3s ease;

  &:hover {
    color: #000;
    background-color: rgba(0, 0, 0, 0.1);
    border-radius: 4px;
  }
`;

const RightMenu = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-left: 2rem; /* 오른쪽 메뉴와 검색창 간의 간격 추가 */

  @media (max-width: 768px) {
    gap: 0.8rem;
  }
`;

const AuthButton = styled(motion.button)`
  padding: 0.5rem 1rem;
  background-color: ${({ variant }) => (variant === 'login' ? '#000' : '#f0f0f0')};
  color: ${({ variant }) => (variant === 'login' ? '#fff' : '#000')};
  border: none;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${({ variant }) => (variant === 'login' ? '#222' : '#e0e0e0')};
    color: ${({ variant }) => (variant === 'login' ? '#fff' : '#000')};
  }

  @media (max-width: 768px) {
    font-size: 0.9rem;
    padding: 0.4rem 0.8rem;
  }
`;

const WelcomeText = styled.span`
  color: #000;
  font-size: 0.9rem;
`;

const Header = ({ isLoggedIn, userInfo, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    // 여기에 검색 로직을 추가하거나 결과를 필터링할 수 있습니다.
  };

  return (
    <HeaderContainer>
      {/* Logo and Search Bar */}
      <LogoSection>
        <Logo onClick={() => navigate('/')}>급구당</Logo>
        <SearchBar>
          <input
            type="text"
            placeholder="검색어를 입력하세요"
            value={searchTerm}
            onChange={handleSearch}
          />
          <FaSearch />
        </SearchBar>
        {/* Right Menu for Login/Signup or Logout */}
        <RightMenu>
          {isLoggedIn ? (
            <>
              <FaUserCircle color="#000" size={20} />
              <WelcomeText>{userInfo?.userName}</WelcomeText>
              <AuthButton variant="logout" onClick={onLogout}>로그아웃</AuthButton>
            </>
          ) : (
            <>
              <AuthButton variant="login" onClick={() => navigate('/login')}>로그인</AuthButton>
              <AuthButton variant="signup" onClick={() => navigate('/signup')}>회원가입</AuthButton>
            </>
          )}
        </RightMenu>
      </LogoSection>

      {/* Navigation Bar */}
      <NavBar>
        <NavLink onClick={() => navigate('/jobpost')}>채용공고</NavLink>
        <NavLink onClick={() => navigate('/add-job')}>직무 추가</NavLink>
        <NavLink onClick={() => navigate('/predict')}>요양예측</NavLink>
        <NavLink onClick={() => navigate('/matching')}>인력매칭</NavLink>
      </NavBar>
    </HeaderContainer>
  );
};
 
export default Header;
