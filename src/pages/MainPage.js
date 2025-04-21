import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { userApi } from '../services/api';
import { showToast } from '../components/common/Toast';
import Toast from '../components/common/Toast';
import { FaUserCircle, FaSearch } from 'react-icons/fa';

const PageContainer = styled(motion.div)`
  min-height: 100vh;
  background-color: #f8f9fa;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #1a237e 0%, #0d47a1 100%);
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

const MainContent = styled.main`
  padding-top: 5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: calc(100vh - 4rem);
`;

const SearchSection = styled.section`
  width: 100%;
  max-width: 800px;
  margin: 4rem auto;
  padding: 2rem;
  text-align: center;
`;

const SearchTitle = styled.h2`
  font-size: 2rem;
  color: #212529;
  margin-bottom: 1.5rem;
`;

const SearchBox = styled.div`
  display: flex;
  align-items: center;
  background: white;
  border: 2px solid #dee2e6;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  margin: 0 auto;
  max-width: 600px;

  &:focus-within {
    border-color: #ff6b6b;
  }
`;

const SearchInput = styled.input`
  flex: 1;
  border: none;
  padding: 0.8rem;
  font-size: 1rem;
  outline: none;
  background: none;

  &::placeholder {
    color: #adb5bd;
  }
`;

const SearchIcon = styled(FaSearch)`
  color: #adb5bd;
  font-size: 1.2rem;
`;

const JobSection = styled.section`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const JobGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

const JobCard = styled(motion.div)`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

const CompanyLogo = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 8px;
  background-color: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  font-weight: bold;
  color: #495057;
`;

const JobTitle = styled.h3`
  font-size: 1.2rem;
  color: #212529;
  margin: 0.5rem 0;
`;

const CompanyName = styled.p`
  font-size: 1rem;
  color: #495057;
  margin: 0.5rem 0;
`;

const JobInfo = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  font-size: 0.9rem;
  color: #868e96;
`;

const Tag = styled.span`
  background: #f1f3f5;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  color: #495057;
`;

// 임시 채용공고 데이터
const MOCK_JOBS = [
  {
    id: 1,
    company: '삼성전자',
    title: '생산직 대체인력 모집',
    location: '경기도 수원시',
    salary: '시급 15,000원',
    period: '3개월',
    tags: ['제조', '생산직', '3교대']
  },
  {
    id: 2,
    company: 'LG화학',
    title: '품질관리 임시직 채용',
    location: '충청북도 청주시',
    salary: '시급 14,000원',
    period: '6개월',
    tags: ['품질관리', '화학', '주간']
  },
  {
    id: 3,
    company: '현대자동차',
    title: '자동차 조립 단기계약직',
    location: '울산광역시',
    salary: '시급 16,000원',
    period: '4개월',
    tags: ['자동차', '조립', '2교대']
  },
  {
    id: 4,
    company: 'SK하이닉스',
    title: '반도체 생산직 대체인력',
    location: '경기도 이천시',
    salary: '시급 15,500원',
    period: '5개월',
    tags: ['반도체', '생산직', '교대근무']
  },
  {
    id: 5,
    company: '포스코',
    title: '제철소 생산직 모집',
    location: '경상북도 포항시',
    salary: '시급 16,500원',
    period: '3개월',
    tags: ['제철', '생산직', '야간']
  },
  {
    id: 6,
    company: '한화솔루션',
    title: '화학제품 생산직 채용',
    location: '충청남도 서산시',
    salary: '시급 14,500원',
    period: '4개월',
    tags: ['화학', '생산직', '주간']
  }
];

const MainPage = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const userInfo = await userApi.getUserInfo();
          setUserInfo(userInfo);
          setIsLoggedIn(true);
        } catch (error) {
          console.error('사용자 정보 조회 중 오류:', error);
          localStorage.removeItem('token');
          setIsLoggedIn(false);
          setUserInfo(null);
          showToast.error('세션이 만료되었습니다. 다시 로그인해주세요.');
          navigate('/login');
        }
      } else {
        setIsLoggedIn(false);
        setUserInfo(null);
      }
    };

    checkLoginStatus();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await userApi.logout();
      localStorage.removeItem('token');
      setIsLoggedIn(false);
      setUserInfo(null);
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

  const handleJobClick = (jobId) => {
    // 채용공고 상세 페이지로 이동
    navigate(`/jobs/${jobId}`);
  };

  return (
    <PageContainer>
      <Toast />
      <Header>
        <LogoSection>
          <Logo onClick={() => navigate('/')}>급구당</Logo>
          <NavMenu>
            {isLoggedIn && userInfo?.userType === 'COMPANY' && (
              <>
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
      </Header>
      <MainContent>
        <SearchSection>
          <SearchTitle>
            {isLoggedIn && userInfo?.userType === 'COMPANY'
              ? '필요한 대체인력을 찾아보세요'
              : '원하는 직무, 회사를 검색해보세요'}
          </SearchTitle>
          <SearchBox>
            <SearchIcon />
            <SearchInput
              type="text"
              placeholder={
                isLoggedIn && userInfo?.userType === 'COMPANY'
                  ? '직무, 지역을 검색해 주세요'
                  : '직무, 회사를 검색해 주세요'
              }
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchBox>
        </SearchSection>
        <JobSection>
          <JobGrid>
            {MOCK_JOBS.map((job) => (
              <JobCard
                key={job.id}
                onClick={() => handleJobClick(job.id)}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
              >
                <CompanyLogo>{job.company[0]}</CompanyLogo>
                <CompanyName>{job.company}</CompanyName>
                <JobTitle>{job.title}</JobTitle>
                <JobInfo>
                  <span>{job.location}</span>
                  <span>•</span>
                  <span>{job.salary}</span>
                </JobInfo>
                <JobInfo>
                  <span>계약기간: {job.period}</span>
                </JobInfo>
                <JobInfo>
                  {job.tags.map((tag, index) => (
                    <Tag key={index}>{tag}</Tag>
                  ))}
                </JobInfo>
              </JobCard>
            ))}
          </JobGrid>
        </JobSection>
      </MainContent>
    </PageContainer>
  );
};

export default MainPage; 