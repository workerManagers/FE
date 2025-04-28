import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { resumeApi } from '../services/api';
import { showToast } from '../components/common/Toast';

const Container = styled.div`
  max-width: 800px;
  margin: 80px auto 0;
  padding: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  color: #333;
  margin-bottom: 2rem;
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 400px;
  padding: 1rem;
  margin-bottom: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  line-height: 1.6;
  resize: vertical;
  background-color: ${props => props.isEditing ? 'white' : '#f8f9fa'};
  cursor: ${props => props.isEditing ? 'text' : 'default'};

  &:focus {
    outline: none;
    border-color: ${props => props.isEditing ? '#007bff' : '#ddd'};
    box-shadow: ${props => props.isEditing ? '0 0 0 2px rgba(0,123,255,0.25)' : 'none'};
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
`;

const Button = styled.button`
  padding: 0.8rem 2rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    opacity: 0.9;
  }

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
    transform: none;
  }
`;

const SaveButton = styled(Button)`
  background-color: #007bff;
  color: white;
`;

const DeleteButton = styled(Button)`
  background-color: #dc3545;
  color: white;
`;

const EmptyMessage = styled.div`
  text-align: center;
  padding: 2rem;
  background-color: #f8f9fa;
  border-radius: 8px;
  margin-bottom: 2rem;
  color: #6c757d;
  font-size: 1.1rem;
  line-height: 1.6;
`;

const EmptyTitle = styled.h3`
  color: #495057;
  margin-bottom: 1rem;
  font-size: 1.3rem;
`;

const ResumePage = () => {
  const navigate = useNavigate();
  const [resumeText, setResumeText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [hasResume, setHasResume] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const userType = localStorage.getItem('userType');
    const token = localStorage.getItem('token');

    if (!token) {
      navigate('/login');
      return;
    }

    if (userType !== 'INDIVIDUAL') {
      showToast.error('일반 사용자만 접근할 수 있습니다.');
      navigate('/');
      return;
    }

    fetchResume();
  }, [navigate]);

  const fetchResume = async () => {
    try {
      const response = await resumeApi.getResume();
      if (response && response.resumeText) {
        setResumeText(response.resumeText);
        setHasResume(true);
      }
    } catch (error) {
      console.error('이력서 조회 실패:', error);
      if (error.response?.status === 401) {
        showToast.error('로그인이 필요합니다.');
        navigate('/login');
        return;
      }
      showToast.error(error.response?.data?.message || '이력서를 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!resumeText.trim()) {
      showToast.error('자기소개서 내용을 입력해주세요.');
      return;
    }

    try {
      if (hasResume) {
        await resumeApi.updateResume(resumeText);
        showToast.success('이력서가 성공적으로 수정되었습니다.');
        setIsEditing(false);
      } else {
        await resumeApi.createResume(resumeText);
        setHasResume(true);
        showToast.success('이력서가 성공적으로 등록되었습니다.');
      }
    } catch (error) {
      if (error.response?.status === 401) {
        showToast.error('로그인이 필요합니다.');
        navigate('/login');
        return;
      }
      showToast.error(error.response?.data?.message || '이력서 저장에 실패했습니다.');
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    if (window.confirm('수정을 취소하시겠습니까? 변경사항이 저장되지 않습니다.')) {
      fetchResume();  // 원래 데이터로 복원
      setIsEditing(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('정말로 이력서를 삭제하시겠습니까?')) {
      return;
    }

    try {
      await resumeApi.deleteResume();
      setResumeText('');
      setHasResume(false);
      showToast.success('이력서가 성공적으로 삭제되었습니다.');
    } catch (error) {
      if (error.response?.status === 401) {
        showToast.error('로그인이 필요합니다.');
        navigate('/login');
        return;
      }
      showToast.error(error.response?.data?.message || '이력서 삭제에 실패했습니다.');
    }
  };

  if (isLoading) {
    return <Container>로딩 중...</Container>;
  }

  return (
    <Container>
      <Title>자기소개서 관리</Title>
      {!hasResume && (
        <EmptyMessage>
          <EmptyTitle>등록된 자기소개서가 없습니다</EmptyTitle>
          아래 입력창에 자기소개서를 작성하고 등록해주세요.
        </EmptyMessage>
      )}
      <TextArea
        value={resumeText}
        onChange={(e) => setResumeText(e.target.value)}
        placeholder="자기소개서를 작성해주세요..."
        readOnly={hasResume && !isEditing}
        isEditing={!hasResume || isEditing}
      />
      <ButtonGroup>
        {hasResume ? (
          isEditing ? (
            <>
              <SaveButton onClick={handleSave}>저장하기</SaveButton>
              <DeleteButton onClick={handleCancel}>취소</DeleteButton>
            </>
          ) : (
            <>
              <SaveButton onClick={handleEdit}>수정하기</SaveButton>
              <DeleteButton onClick={handleDelete}>삭제하기</DeleteButton>
            </>
          )
        ) : (
          <SaveButton onClick={handleSave}>등록하기</SaveButton>
        )}
      </ButtonGroup>
    </Container>
  );
};

export default ResumePage; 