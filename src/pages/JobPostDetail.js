import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { jobPostApi, userApi, bookmarkApi, applicationApi, chatApi, resumeApi } from '../services/api';
import { showToast } from '../components/common/Toast';
import Toast from '../components/common/Toast';
import { IoArrowBack } from 'react-icons/io5';
import BookmarkButton from '../components/common/BookmarkButton';
import ResumeModal from '../components/ResumeModal';

const Container = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 6.5rem 1.5rem 2.5rem 1.5rem;
  background: #f8f9fa;
  min-height: 80vh;
  border-radius: 28px;
  box-shadow: 0 8px 32px 0 rgba(0,0,0,0.10);
  border: 2.5px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const TitleRow = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 0.7rem;
  margin-bottom: 0.3rem;
  justify-content: center;
`;

const Title = styled.h1`
  font-size: 1.32rem;
  color: #23272f;
  font-weight: 800;
  letter-spacing: -0.5px;
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 1.5px 8px 0 rgba(124,58,237,0.06);
  border: 1.5px solid #e5e7eb;
  padding: 0.7rem 1.5rem 0.7rem 1.5rem;
  display: inline-block;
  margin: 0;
`;

const CompanyName = styled.span`
  font-size: 1.08rem;
  font-weight: 600;
  color: #6366f1;
  margin-bottom: 1.2rem;
  background: #f3f4f6;
  border-radius: 8px;
  padding: 0.4rem 1.1rem;
  box-shadow: 0 1px 6px rgba(124,58,237,0.07);
  border: 1.2px solid #e5e7eb;
  display: inline-block;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0px;
  margin-bottom: 2.2rem;
  width: 100%;
  background: #f4f5f7;
  border-radius: 14px 14px 0 0;
  overflow: hidden;
  border: 1.5px solid #e5e7eb;
  box-shadow: 0 2px 8px rgba(180,180,200,0.09);
`;

const InfoItem = styled.div`
  background: #fff;
  border-right: 1.5px solid #e5e7eb;
  border-bottom: 1.5px solid #e5e7eb;
  padding: 1.2rem 1rem 1.1rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  align-items: flex-start;
  min-width: 0;
  &:last-child {
    border-right: none;
  }
`;

const InfoLabel = styled.span`
  font-weight: 700;
  color: #222;
  font-size: 0.97rem;
`;

const InfoValue = styled.span`
  color: #444;
  font-size: 1.01rem;
  font-weight: 500;
`;

const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0px;
  width: 100%;
  margin-bottom: 2.2rem;
  background: #f4f5f7;
  border-radius: 0 0 14px 14px;
  overflow: hidden;
  border-left: 1.5px solid #e5e7eb;
  border-right: 1.5px solid #e5e7eb;
  border-bottom: 1.5px solid #e5e7eb;
  box-shadow: 0 2px 8px rgba(180,180,200,0.09);
`;

const DetailSection = styled.div`
  background-color: #fff;
  border-right: 1.5px solid #e5e7eb;
  border-bottom: 1.5px solid #e5e7eb;
  padding: 1.5rem 1.2rem 1.3rem 1.2rem;
  display: flex;
  flex-direction: column;
  min-width: 0;
  &:nth-child(2n) {
    border-right: none;
  }
  &:last-child {
    border-right: none;
    border-bottom: none;
    height: 100%;
    justify-content: flex-end;
  }
`;

const DetailTitle = styled.h2`
  font-size: 1.01rem;
  margin-bottom: 0.4rem;
  color: #23272f;
  font-weight: 700;
  border-bottom: 1.2px solid #e5e7eb;
  padding-bottom: 0.2rem;
`;

const DetailContent = styled.div`
  font-size: 0.97rem;
  line-height: 1.6;
  color: #444;
  white-space: pre-wrap;
`;

const FloatingButtonGroup = styled.div`
  display: flex;
  gap: 0.7rem;
  justify-content: flex-end;
  width: 100%;
  margin-top: 2.5rem;
  position: static;
`;

const FloatingButton = styled.button`
  padding: 0.8rem 1.5rem;
  border: 1.5px solid #d1d5db;
  border-radius: 50px;
  font-size: 0.97rem;
  font-weight: 700;
  background: linear-gradient(90deg, #f3f4f6 0%, #e5e7eb 100%);
  color: #23272f;
  box-shadow: 0 2px 12px rgba(180,180,200,0.13), 0 0 8px #fff;
  cursor: pointer;
  transition: background 0.18s, box-shadow 0.18s, color 0.13s, transform 0.13s;
  letter-spacing: -0.2px;
  &:hover {
    background: linear-gradient(90deg, #e5e7eb 0%, #f3f4f6 100%);
    color: #111;
    box-shadow: 0 4px 20px rgba(180,180,200,0.18), 0 0 12px #fff;
    transform: translateY(-2px) scale(1.03);
  }
  &:disabled {
    background: #e5e7eb;
    color: #bdbdbd;
    cursor: not-allowed;
    box-shadow: none;
    transform: none;
  }
`;

const ApplicantSection = styled.div`
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  margin-top: 2rem;
  width: 100%;
`;

const ApplicantList = styled.div`
  margin-top: 1.5rem;
`;

const ApplicantItem = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid #eee;
  display: grid;
  grid-template-columns: 1fr 2fr auto;
  gap: 1rem;
  align-items: center;

  &:last-child {
    border-bottom: none;
  }
`;

const ApplicantName = styled.span`
  font-weight: 600;
  color: #333;
`;

const ResumeText = styled.p`
  color: #666;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

const ChatButton = styled.button`
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.2s;

  &:hover {
    background-color: #218838;
  }
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
  const [applicants, setApplicants] = useState([]);
  const [selectedResume, setSelectedResume] = useState(null);
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

  useEffect(() => {
    const fetchApplicants = async () => {
      if (userInfo?.userType === 'COMPANY' && jobPost?.companyName === userInfo?.companyInfo?.companyName) {
        try {
          const applicantsData = await applicationApi.getJobPostApplications(id);
          console.log('지원자 데이터:', applicantsData);
          setApplicants(applicantsData);
        } catch (error) {
          console.error('지원자 목록 조회 실패:', error);
        }
      }
    };

    if (jobPost && userInfo) {
      fetchApplicants();
    }
  }, [id, jobPost, userInfo]);

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

  const handleChatClick = async (applicantName) => {
    try {
      const userData = await userApi.getUserByName(applicantName);
      if (!userData || !userData.userId) {
        showToast.error('사용자 정보를 찾을 수 없습니다.');
        return;
      }
      
      const response = await chatApi.createChatRoom(userData.userId);
      navigate(`/chat/${response.id}`);
    } catch (error) {
      console.error('채팅방 생성 실패:', error);
      showToast.error('채팅방 생성에 실패했습니다.');
    }
  };

  const handleApplicantClick = async (applicant) => {
    try {
      console.log('클릭한 지원자 정보:', applicant);
      if (!applicant.userId) {
        showToast.error('지원자의 ID 정보를 찾을 수 없습니다.');
        return;
      }
      const resumeData = await resumeApi.getResumeByUserId(applicant.userId);
      console.log('받아온 이력서 데이터:', resumeData);
      if (!resumeData) {
        showToast.error('이력서 정보를 찾을 수 없습니다.');
        return;
      }
      setSelectedResume(resumeData);
    } catch (error) {
      console.error('이력서 정보 조회 실패:', error);
      showToast.error('이력서 정보를 불러오는데 실패했습니다.');
    }
  };

  if (loading) {
    return <Container>Loading...</Container>;
  }

  if (error) {
    return (
      <Container>
        <div>{error}</div>
        <FloatingButton onClick={() => {
          if (location.state?.from) {
            navigate(location.state.from);
          } else {
            navigate('/jobpost');
          }
        }}>목록으로 돌아가기</FloatingButton>
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
      <CompanyName>{jobPost.companyName}</CompanyName>
      <TitleRow>
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
      <InfoGrid>
        <InfoItem>
          <InfoLabel>직무</InfoLabel>
          <InfoValue>{jobPost.jobName}</InfoValue>
        </InfoItem>
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
      <DetailGrid>
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
        <DetailSection>
          <FloatingButtonGroup>
            <FloatingButton onClick={() => navigate(-1)}>
              <IoArrowBack style={{ marginRight: '0.1rem', marginTop: '0.1rem', fontSize: '1.2rem' }} />
            </FloatingButton>
            {userInfo?.userType === 'COMPANY' && userInfo?.companyInfo?.companyName === jobPost?.companyName && (
              <>
                <FloatingButton onClick={handleEdit}>수정</FloatingButton>
                <FloatingButton onClick={handleDelete}>삭제</FloatingButton>
              </>
            )}
            {userInfo?.userType === 'INDIVIDUAL' && (
              <>
                <FloatingButton onClick={handleApply} disabled={hasApplied}>
                  {hasApplied ? '지원완료' : '지원하기'}
                </FloatingButton>
              </>
            )}
          </FloatingButtonGroup>
        </DetailSection>
      </DetailGrid>
      {isAuthor && (
        <ApplicantSection>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
            지원자 목록
            <span style={{ fontSize: '1rem', color: '#666', marginLeft: '1rem' }}>
              총 {applicants.length}명의 지원자
            </span>
          </h2>
          <ApplicantList>
            {applicants.length === 0 ? (
              <p>아직 지원자가 없습니다.</p>
            ) : (
              applicants.map((applicant, index) => (
                <ApplicantItem key={index}>
                  <ApplicantName 
                    onClick={() => handleApplicantClick(applicant)}
                    style={{ cursor: 'pointer' }}
                  >
                    {applicant.userName}
                  </ApplicantName>
                  <ResumeText>{applicant.resumeText}</ResumeText>
                  <ChatButton 
                    onClick={() => handleChatClick(applicant.userName)}
                  >
                    1:1 채팅
                  </ChatButton>
                </ApplicantItem>
              ))
            )}
          </ApplicantList>
        </ApplicantSection>
      )}

      {selectedResume && (
        <ResumeModal 
          resume={selectedResume} 
          onClose={() => setSelectedResume(null)} 
        />
      )}
    </Container>
  );
}

export default JobPostDetail; 