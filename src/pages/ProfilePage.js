import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { userApi } from '../services/api';
import { showToast } from '../components/common/Toast';
import Toast from '../components/common/Toast';
import penguin from '../assets/img/img2.png';

const PageContainer = styled(motion.div)`
  min-height: 100vh;
  background-color: #f7f7f7;
  padding: 7.5rem 2rem 2rem;
`;

const ProfileContainer = styled.div`
  max-width: 800px;
  margin: 1rem auto;
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 180px;
    background: linear-gradient(135deg,rgb(74, 80, 86) 0%);
    z-index: 1;
  }
`;

const ProfileHeader = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 2rem;
  padding: 1.5rem 3rem;
  position: relative;
  z-index: 2;
`;

const ProfileImageContainer = styled.div`
  width: 150px;
  height: 150px;
  padding: 0.8rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const ProfileImage = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  
  img {
    width: 120%;
    height: 120%;
    object-fit: contain;
  }
`;

const ProfileInfo = styled.div`
  flex: 1;
  padding-top: 0.8rem;
`;

const Name = styled.h1`
  font-size: 2rem;
  margin-bottom: 0.6rem;
  color: white;
  font-weight: 600;
  letter-spacing: -0.5px;
`;

const UserType = styled.span`
  display: inline-block;
  padding: 0.5rem 1rem;
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  backdrop-filter: blur(10px);
`;

const ProfileSection = styled.div`
  padding: 1.5rem 3rem;
  background-color: white;
`;

const SectionTitle = styled.h2`
  font-size: 1.3rem;
  color: rgb(74, 80, 86);
  margin-bottom: 1.5rem;
  font-weight: 600;
  letter-spacing: -0.5px;
  position: relative;
  padding-left: 1rem;
  display: flex;
  align-items: center;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 4px;
    height: 18px;
    background: linear-gradient(to bottom,rgb(183, 209, 241),rgb(142, 197, 194));
    border-radius: 2px;
  }
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.2rem;
`;

const InfoItem = styled.div`
  padding: 1.2rem;
  border-radius: 12px;
  background: #f8f9fa;
  transition: all 0.2s ease;
  border: 1px solid #e9ecef;

  &:hover {
    transform: translateY(-2px);
    border-color:rgb(154, 168, 184);
    box-shadow: 0 2px 8px rgba(74, 144, 226, 0.1);
  }
`;

const InfoLabel = styled.div`
  font-size: 0.85rem;
  color: #868e96;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 500;
`;

const InfoValue = styled.div`
  font-size: 1.1rem;
  color: #333;
  font-weight: 500;
  letter-spacing: -0.3px;
`;

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50vh;
  font-size: 1.1rem;
  color: #666;
`;

const ToggleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  margin-top: 1.5rem;
`;

const ToggleLabel = styled.span`
  font-size: 1rem;
  color: #495057;
  flex: 1;
`;

const ToggleSwitch = styled.label`
  position: relative;
  display: inline-block;
  width: 52px;
  height: 28px;

  input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  span {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    transition: .4s;
    border-radius: 34px;

    &:before {
      position: absolute;
      content: "";
      height: 20px;
      width: 20px;
      left: 4px;
      bottom: 4px;
      background-color: white;
      transition: .4s;
      border-radius: 50%;
    }
  }

  input:checked + span {
    background-color: #6366f1;
  }

  input:checked + span:before {
    transform: translateX(24px);
  }
`;

const getUserTypeLabel = (userType) => {
  switch (userType) {
    case 'INDIVIDUAL':
      return '일반 회원';
    case 'COMPANY':
      return '기업 회원';
    default:
      return userType;
  }
};

const ProfilePage = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [matchingEnabled, setMatchingEnabled] = useState(false);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const data = await userApi.getUserInfo();
        console.log('받아온 사용자 정보:', data);
        setUserInfo(data);
        setMatchingEnabled(data.matchingEnabled);
      } catch (error) {
        console.error('사용자 정보 조회 실패:', error);
        showToast.error('사용자 정보를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  const handleMatchingToggle = async () => {
    try {
      await userApi.updateMatchingStatus(!matchingEnabled);
      setMatchingEnabled(!matchingEnabled);
      showToast.success('매칭 상태가 변경되었습니다.');
    } catch (error) {
      console.error('매칭 상태 변경 실패:', error);
      showToast.error('매칭 상태 변경에 실패했습니다.');
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <LoadingContainer>로딩 중...</LoadingContainer>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <ProfileContainer>
        <ProfileHeader>
          <ProfileImageContainer>
            <ProfileImage>
              <img src={penguin} alt="Profile" />
            </ProfileImage>
          </ProfileImageContainer>
          <ProfileInfo>
            <Name>{userInfo?.userName}</Name>
            <UserType>{getUserTypeLabel(userInfo?.userType)}</UserType>
          </ProfileInfo>
        </ProfileHeader>

        <ProfileSection>
          <SectionTitle>기본 정보</SectionTitle>
          <InfoGrid>
            <InfoItem>
              <InfoLabel>이메일</InfoLabel>
              <InfoValue>{userInfo?.userEmail}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>나이</InfoLabel>
              <InfoValue>{userInfo?.userAge}세</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>성별</InfoLabel>
              <InfoValue>{userInfo?.userSex === '여' ? '여성' : '남성'}</InfoValue>
            </InfoItem>
            {userInfo?.userType === 'COMPANY' && userInfo?.companyInfo && (
              <>
                <InfoItem>
                  <InfoLabel>회사명</InfoLabel>
                  <InfoValue>{userInfo.companyInfo.companyName || '-'}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>회사 위치</InfoLabel>
                  <InfoValue>{userInfo.companyInfo.companyRegion || '-'}</InfoValue>
                </InfoItem>
              </>
            )}
          </InfoGrid>

          {userInfo?.userType === 'INDIVIDUAL' && (
            <ToggleContainer>
              <ToggleLabel>매칭 서비스 활성화</ToggleLabel>
              <ToggleSwitch>
                <input
                  type="checkbox"
                  checked={matchingEnabled}
                  onChange={handleMatchingToggle}
                />
                <span />
              </ToggleSwitch>
            </ToggleContainer>
          )}
        </ProfileSection>
      </ProfileContainer>
      <Toast />
    </PageContainer>
  );
};

export default ProfilePage; 