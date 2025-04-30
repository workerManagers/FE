import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { jobPostApi, userApi, bookmarkApi, applicationApi, chatApi } from '../services/api';
import { showToast } from '../components/common/Toast';
import Toast from '../components/common/Toast';
import { IoArrowBack } from 'react-icons/io5';
import BookmarkButton from '../components/common/BookmarkButton';

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 6rem 1.5rem 3.5rem 1.5rem;
  background: #f7f8fa;
  min-height: 100vh;
`;

const Title = styled.h1`
  font-size: 2.2rem;
  margin-bottom: 0.7rem;
  color: #181818;
  font-weight: 800;
  letter-spacing: -1px;
  margin-top: 1rem;
`;

const DetailSection = styled.div`
  margin-bottom: 2.2rem;
  padding: 1.7rem 1.5rem;
  background-color: #fff;
  border-radius: 18px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.07), 0 1.5px 6px rgba(0,0,0,0.04);
`;

const DetailTitle = styled.h2`
  font-size: 1.25rem;
  margin-bottom: 0.7rem;
  color: #222;
  font-weight: 700;
`;

const DetailContent = styled.div`
  font-size: 1.05rem;
  line-height: 1.7;
  color: #444;
  white-space: pre-wrap;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
  gap: 1.2rem;
  margin-bottom: 1.5rem;
`;

const InfoItem = styled.div`
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  padding: 1.1rem 1rem 0.9rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  align-items: flex-start;
`;

const InfoLabel = styled.span`
  font-weight: 700;
  color: #222;
  font-size: 1.01rem;
`;

const InfoValue = styled.span`
  color: #444;
  font-size: 1.08rem;
  font-weight: 500;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1.1rem;
  margin-top: 2.5rem;
`;

const Button = styled.button`
  padding: 0.8rem 1.7rem;
  padding: 0.8rem 2rem;
  border: none;
  border-radius: 999px;
  font-size: 1.07rem;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  font-weight: 600;
  box-shadow: 0 1px 4px rgba(0,0,0,0.07);
  transition: background 0.18s, color 0.18s, box-shadow 0.18s;
  letter-spacing: -0.2px;
  transition: all 0.2s ease;

  &:hover {
    opacity: 0.93;
    box-shadow: 0 4px 16px rgba(0,0,0,0.10);
    transform: translateY(-2px);
    opacity: 0.9;
  }

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
    transform: none;
  }
`;

const EditButton = styled(Button)`
  background-color: #181818;
  color: #fff;
`;

const DeleteButton = styled(Button)`
  background-color: #dc3545;
  color: #fff;
`;

const BackButton = styled(Button)`
  background-color: #fff;
  color: #181818;
  border: 1.5px solid #e0e0e0;
`;

const ApplyButton = styled(Button)`
  background-color: #1a7f37;
  color: #fff;
  background-color: #4CAF50;
  color: white;

  &:hover {
    background-color: #45a049;
  }
`;

const ChatButton = styled(Button)`
  background-color: #007bff;
  color: #fff;
  &:hover {
    background-color: #0056b3;
  }
`;

const ChatInquiryButton = styled(Button)`
  background-color: #6c757d;
  color: #fff;
  &:hover {
    background-color: #5a6268;
  }
`;

const Loading = styled.div`
  text-align: center;
  padding: 2.5rem;
  font-size: 1.2rem;
  color: #888;
`;

const Error = styled.div`
  text-align: center;
  padding: 2.5rem;
  color: #d32f2f;
  font-size: 1.1rem;
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 2.2rem;
`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.7rem;
`;

const CompanyName = styled.span`
  font-size: 1.25rem;
  font-weight: 700;
  color: #444;
  margin-top: 0.2rem;
  margin-bottom: 0.2rem;
`;

const Content = styled.div``;

const Section = styled.div`
  margin-bottom: 2.2rem;
`;

const SectionTitle = styled.h3`
  font-size: 1.18rem;
  margin-bottom: 1rem;
  color: #222;
  font-weight: 700;
`;

function JobPostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [jobPost, setJobPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkId, setBookmarkId] = useState(null);
  const [bookmarkLoading, setBookmarkLoading] = useState(true);
  const [hasApplied, setHasApplied] = useState(false);
  const userType = localStorage.getItem('userType');

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });
  };

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userData = await userApi.getUserInfo();
        console.log('현재 사용자 정보:', userData);
        setUserInfo(userData);
      } catch (error) {
        console.error('사용자 정보 조회 실패:', error);
      }
    };

    const token = localStorage.getItem('token');
    if (token) {
      fetchUserInfo();
    }
  }, []);

  useEffect(() => {
    const fetchJobPost = async () => {
      try {
        const data = await jobPostApi.getJobPost(id);
        console.log('채용공고 정보:', data);
        setJobPost(data);
        setError(null);
        if (userType === 'INDIVIDUAL') {
          checkApplicationStatus();
        }
      } catch (error) {
        console.error('Error fetching job post:', error);
        setError('채용공고를 불러오는 중 오류가 발생했습니다.');
        if (error.response?.status === 404) {
          setError('존재하지 않는 채용공고입니다.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchJobPost();
  }, [id]);

  useEffect(() => {
    const fetchBookmark = async () => {
      setBookmarkLoading(true);
      try {
        const data = await bookmarkApi.getMyBookmarks();
        const bookmarks = Array.isArray(data.bookmarks) ? data.bookmarks : [];
        console.log('JobPostDetail 북마크 API 응답:', data);
        bookmarks.forEach(b => {
          const isMatch = Number(b.jobPostId) === Number(id);
          console.log(
            `[비교] jobPostId=${id} (type:${typeof id}), bookmark.jobPostId=${b.jobPostId} (type:${typeof b.jobPostId}), isMatch=${isMatch}`
          );
        });
        const found = bookmarks.find(b => Number(b.jobPostId) === Number(id));
        if (found) {
          setIsBookmarked(true);
          setBookmarkId(found.bookmarkId);
        } else {
          setIsBookmarked(false);
          setBookmarkId(null);
        }
      } catch (e) {}
      setBookmarkLoading(false);
    };
    if (id) fetchBookmark();
  }, [id]);

  const checkApplicationStatus = async () => {
    try {
      const applications = await applicationApi.getMyApplications();
      setHasApplied(applications.some(app => app.jobPostId === parseInt(id)));
    } catch (error) {
      console.error('지원 상태 확인 실패:', error);
    }
  };

  const handleEdit = () => {
    navigate(`/jobpost/${id}/edit`);
  };

  const handleDelete = async () => {
    try {
      await jobPostApi.deleteJobPost(id);
      showToast.success('채용공고가 삭제되었습니다.');
      setTimeout(() => {
        navigate('/jobpost');
      }, 2000);
    } catch (error) {
      console.error('Error deleting job post:', error);
      if (error.response?.status === 403) {
        showToast.error('권한이 없습니다. 다시 로그인해주세요.');
        localStorage.removeItem('token');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        showToast.error('채용공고 삭제 중 오류가 발생했습니다.');
      }
    }
  };

  const handleApply = async () => {
    try {
      const response = await applicationApi.applyToJob(parseInt(id));
      setHasApplied(true);
      showToast.success(response.message || '채용공고 지원이 완료되었습니다.');
    } catch (error) {
      showToast.error(error.response?.data?.message || '지원에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handleChatClick = async () => {
    try {
      const res = await chatApi.createChatRoom(jobPost.jobPostId);
      console.log('채팅방 생성 응답:', res);
      const roomId = res.roomId || res.id || (res.data && (res.data.roomId || res.data.id));
      console.log('이동할 roomId:', roomId);
      if (!roomId) {
        showToast.error('채팅방 ID를 찾을 수 없습니다. 관리자에게 문의하세요.');
        return;
      }
      navigate(`/chat/${roomId}`);
    } catch (error) {
      showToast.error('채팅방 생성에 실패했습니다.');
    }
  };

  const handleChatInquiryClick = () => {
    navigate(`/chat/recruiter?jobPostId=${id}`);
  };

  if (loading) {
    return <Container>Loading...</Container>;
  }

  if (error) {
    return (
      <Container>
        <div>{error}</div>
        <BackButton onClick={() => {
          if (location.state?.from) {
            navigate(location.state.from);
          } else {
            navigate('/jobpost');
          }
        }}>목록으로 돌아가기</BackButton>
      </Container>
    );
  }

  if (!jobPost) {
    return null;
  }

  const isAuthor = userInfo && 
                   userInfo.userType === 'COMPANY' && 
                   userInfo.companyInfo && 
                   userInfo.companyInfo.companyName === jobPost.companyName;

  return (
    <Container>
      <Toast />
      <Header>
        <TitleRow>
          <Title>{jobPost.jobName}</Title>
          <BookmarkButton
            jobPostId={jobPost.jobPostId}
            isBookmarked={isBookmarked}
            bookmarkId={bookmarkId}
            onBookmarkChange={() => {
              setBookmarkLoading(true);
              (async () => {
                try {
                  const data = await bookmarkApi.getMyBookmarks();
                  const bookmarks = Array.isArray(data.bookmarks) ? data.bookmarks : [];
                  const found = bookmarks.find(b => Number(b.jobPostId) === Number(jobPost.jobPostId));
                  setIsBookmarked(!!found);
                  setBookmarkId(found ? found.bookmarkId : null);
                } catch (e) {}
                setBookmarkLoading(false);
              })();
            }}
            disabled={bookmarkLoading}
          />
        </TitleRow>
        <CompanyName>{jobPost.companyName}</CompanyName>
      </Header>

      <Content>
        <Section>
          <SectionTitle>기본 정보</SectionTitle>
          <InfoGrid>
            <InfoItem>
              <InfoLabel>근무지역</InfoLabel>
              <InfoValue>{jobPost.jobRegion}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>고용기간</InfoLabel>
              <InfoValue>{jobPost.jobPeriod}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>경력 유형</InfoLabel>
              <InfoValue>
                {jobPost.careerType === 'NEWCOMER' ? '신입' :
                 jobPost.careerType === 'EXPERIENCED' ? '경력' :
                 jobPost.careerType === 'ANY' ? '신입/경력' : jobPost.careerType}
              </InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>마감일</InfoLabel>
              <InfoValue>{formatDate(jobPost.deadline)}</InfoValue>
            </InfoItem>
          </InfoGrid>
        </Section>

        <DetailSection>
          <DetailTitle>모집공고 설명</DetailTitle>
          <DetailContent>{jobPost.jobPostDescription}</DetailContent>
        </DetailSection>

        <DetailSection>
          <DetailTitle>주요 업무</DetailTitle>
          <DetailContent>{jobPost.mainTasks}</DetailContent>
        </DetailSection>

        <DetailSection>
          <DetailTitle>자격요건</DetailTitle>
          <DetailContent>{jobPost.qualifications}</DetailContent>
        </DetailSection>

        <DetailSection>
          <DetailTitle>우대사항</DetailTitle>
          <DetailContent>{jobPost.preferredQualifications}</DetailContent>
        </DetailSection>

        <DetailSection>
          <DetailTitle>인재상</DetailTitle>
          <DetailContent>{jobPost.idealCandidate}</DetailContent>
        </DetailSection>
      </Content>

      <ButtonGroup>
        <BackButton onClick={() => navigate(-1)}>
          <IoArrowBack style={{ marginRight: '0.3rem' }} />
          뒤로가기
        </BackButton>
        
        {userInfo?.userType === 'COMPANY' && (
          <>
            <EditButton onClick={handleEdit}>수정하기</EditButton>
            <DeleteButton onClick={handleDelete}>삭제하기</DeleteButton>
            <ChatInquiryButton onClick={handleChatInquiryClick}>
              1대1 문의 목록
            </ChatInquiryButton>
          </>
        )}
        
        {userInfo?.userType === 'INDIVIDUAL' && (
          <>
            <ApplyButton onClick={handleApply} disabled={hasApplied}>
              {hasApplied ? '지원완료' : '지원하기'}
            </ApplyButton>
            <ChatButton onClick={handleChatClick}>1대1 문의하기</ChatButton>
          </>
        )}
      </ButtonGroup>
    </Container>
  );
}

export default JobPostDetail; 