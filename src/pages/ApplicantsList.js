import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { applicationApi, userApi, resumeApi, jobPostApi } from '../services/api';
import { showToast } from '../components/common/Toast';
import Loading from '../components/common/Loading';
import { toast } from 'react-toastify';

const PageContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 7.5rem 2rem 2rem;
  min-height: 80vh;
`;

const Title = styled.h1`
  font-size: 1.7rem;
  font-weight: 700;
  margin-bottom: 2.2rem;
  color: #23272f;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 2px 8px rgba(180,180,200,0.09);
  overflow: hidden;
`;

const Th = styled.th`
  background: #f4f5f7;
  color: #6366f1;
  font-weight: 700;
  padding: 1rem 0.7rem;
  border-bottom: 2px solid #e5e7eb;
`;

const Td = styled.td`
  padding: 1rem 0.7rem;
  border-bottom: 1px solid #e5e7eb;
  color: #23272f;
  text-align: center;
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 0.3rem 1rem;
  border-radius: 12px;
  font-size: 0.97rem;
  font-weight: 600;
  background: ${({ status }) =>
    status === 'APPLIED' ? '#e0e7ff' :
    status === 'ACCEPTED' ? '#d1fae5' :
    status === 'REJECTED' ? '#fee2e2' : '#f3f4f6'};
  color: ${({ status }) =>
    status === 'APPLIED' ? '#6366f1' :
    status === 'ACCEPTED' ? '#059669' :
    status === 'REJECTED' ? '#ef4444' : '#23272f'};
`;

const EmptyState = styled.div`
  text-align: center;
  color: #a1a1aa;
  font-size: 1.13rem;
  margin-top: 3rem;
`;

const ResumeModalBackground = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.35);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ResumePreviewContainer = styled.div`
  background: linear-gradient(135deg, #f8fafc 0%, #e0e7ef 100%);
  border-radius: 22px;
  box-shadow: 0 8px 40px rgba(30,41,59,0.13);
  padding: 2.5rem 2rem 2rem 2rem;
  max-width: 900px;
  width: 100%;
  margin: 0 auto;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
`;

const ResumePreviewBody = styled.div`
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 2px 12px rgba(30,41,59,0.07);
  padding: 1.5rem 1.2rem;
  font-size: 1.08rem;
  color: #22223b;
  line-height: 1.8;
  white-space: pre-wrap;
  word-break: break-all;
  font-family: 'Pretendard', 'Noto Sans KR', sans-serif;
  max-width: 1100px;
  width: 100%;
  max-height: 60vh;
  overflow-y: auto;
`;

const ResumeSectionDivider = styled.div`
  width: 100%;
  height: 1.5px;
  background: linear-gradient(90deg, #e0e7ef 0%, #cbd5e1 100%);
  margin: 1.1rem 0 1.1rem 0;
  border-radius: 2px;
`;

const ModalClose = styled.button`
  position: absolute;
  top: 1.1rem;
  right: 1.1rem;
  background: none;
  border: none;
  font-size: 2rem;
  color: #bdbdbd;
  cursor: pointer;
  transition: color 0.15s;
  &:hover {
    color: #6366f1;
  }
`;

const ModalTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 0.7rem;
  color: #23272f;
  align-self: flex-start;
`;

const ModalDivider = styled.hr`
  width: 100%;
  border: none;
  border-top: 1.5px solid #e5e7eb;
  margin: 0 0 1.2rem 0;
`;

const ModalContent = styled.pre`
  font-size: 1.08rem;
  color: #23272f;
  background: #f8fafc;
  border-radius: 10px;
  padding: 1.2rem 1rem;
  width: 100%;
  min-height: 120px;
  max-height: 55vh;
  overflow-y: auto;
  white-space: pre-wrap;
  box-sizing: border-box;
`;

function formatDate(dateValue) {
  if (!dateValue) return '';
  try {
    if (Array.isArray(dateValue)) {
      // [year, month, day, hour, minute, second]
      const [year, month, day, hour, minute, second] = dateValue;
      const date = new Date(year, month - 1, day, hour, minute, second);
      if (isNaN(date.getTime())) return '';
      return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    }
    // 기존 문자열 처리
    const date = new Date(dateValue);
    if (isNaN(date.getTime())) return '';
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '';
  }
}

const ApplicantsList = () => {
  const { jobPostId } = useParams();
  const navigate = useNavigate();
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resumeModal, setResumeModal] = useState({ open: false, content: '', userName: '', applicationId: '' });
  const [resumeSections, setResumeSections] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const fetchApplicants = async () => {
      setLoading(true);
      try {
        const data = await applicationApi.getJobPostApplications(jobPostId);
        // 각 지원자의 userId로 이메일 추가 조회
        const applicantsWithEmail = await Promise.all(
          (Array.isArray(data) ? data : []).map(async (app) => {
            try {
              const user = await userApi.getUserById(app.userId);
              return { ...app, userEmail: user.userEmail || '' };
            } catch {
              console.log('지원자 id:', app.userId, '이메일 조회 실패');
              return { ...app, userEmail: '' };
            }
          })
        );
        setApplicants(applicantsWithEmail);
      } catch (error) {
        showToast.error('지원자 목록을 불러오지 못했습니다.');
        setApplicants([]);
      }
      setLoading(false);
    };
    fetchApplicants();
  }, [jobPostId]);

  const handleApplicantClick = async (app) => {
    console.log('지원자 클릭, userId:', app.userId);
    try {
      const resume = await resumeApi.getResumeByUserId(app.userId);
      const text = resume.resumeText || '';
      // 이력서 섹션 파싱
      const gender = text.match(/성별:([^\n]*)/);
      const age = text.match(/나이:([^\n]*)/);
      const region = text.match(/원하는 근무지역:([^\n]*)/);
      const intro = text.match(/자기소개:([\s\S]*?)(?=직무 경험 및 관련 활동:|나의 성향:|$)/);
      const exp = text.match(/직무 경험 및 관련 활동:([\s\S]*?)(?=나의 성향:|$)/);
      const traits = text.match(/나의 성향:([\s\S]*)/);
      const sections = [
        gender ? { label: '성별', value: gender[1].trim() } : null,
        age ? { label: '나이', value: age[1].trim() } : null,
        region ? { label: '원하는 근무지역', value: region[1].trim() } : null,
        intro ? { label: '자기소개', value: intro[1].trim() } : null,
        exp ? { label: '직무 경험 및 관련 활동', value: exp[1].trim() } : null,
        traits ? { label: '나의 성향', value: traits[1].trim() } : null,
      ].filter(Boolean);
      setResumeSections(sections);
      setResumeModal({ open: true, content: '', userName: app.userName, applicationId: app.applicationId });
    } catch (e) {
      setResumeSections([]);
      setResumeModal({ open: true, content: '이력서를 불러오지 못했습니다.', userName: app.userName, applicationId: app.applicationId });
    }
  };

  const closeModal = () => setResumeModal({ open: false, content: '', userName: '', applicationId: '' });

  return (
    <PageContainer>
      <Title>지원자 목록</Title>
      {loading ? (
        <Loading message="지원자 목록을 불러오는 중입니다..." />
      ) : applicants.length === 0 ? (
        <EmptyState>아직 지원자가 없습니다.</EmptyState>
      ) : (
        <Table>
          <thead>
            <tr>
              <Th>이름</Th>
              <Th>이메일</Th>
              <Th>지원일</Th>
              <Th>상태</Th>
            </tr>
          </thead>
          <tbody>
            {applicants.map(app => (
              <tr key={app.applicationId} style={{ cursor: 'pointer' }} onClick={() => handleApplicantClick(app)}>
                <Td>{app.userName}</Td>
                <Td>{app.userEmail || '-'}</Td>
                <Td>{formatDate(app.appliedAt)}</Td>
                <Td>
                  <StatusBadge status={app.status}>
                    {app.status === 'APPLIED' ? '지원완료' : 
                     app.status === 'ACCEPTED' ? '합격' : 
                     app.status === 'REJECTED' ? '불합격' : 
                     app.status}
                  </StatusBadge>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      {resumeModal.open && (
        <ResumeModalBackground onClick={closeModal}>
          <ResumePreviewContainer onClick={e => e.stopPropagation()}>
            <ModalClose onClick={closeModal} title="닫기">&times;</ModalClose>
            <ModalTitle>{resumeModal.userName}님의 이력서</ModalTitle>
            <ModalDivider />
            {resumeSections.length > 0 ? (
              <ResumePreviewBody>
                <div style={{display:'flex', gap:'1.2rem', marginBottom:'1.1rem', flexWrap:'wrap', alignItems:'center'}}>
                  {resumeSections.slice(0,3).map(section => (
                    <div key={section.label} style={{display:'flex', alignItems:'center', gap:'0.3rem'}}>
                      <span style={{fontWeight:600, color:'#2563eb', fontSize:'1.04rem'}}>{section.label}:</span>
                      <span style={{color:'#222', fontSize:'1.04rem'}}>{section.value}</span>
                    </div>
                  ))}
                </div>
                {[3,4,5].map(idx => resumeSections[idx] && (
                  <React.Fragment key={resumeSections[idx].label}>
                    <ResumeSectionDivider />
                    <div style={{marginBottom:'0.7rem'}}>
                      <div style={{fontWeight:600, color:'#2563eb', fontSize:'1.04rem', marginBottom:'0.3rem'}}>{resumeSections[idx].label}</div>
                      <div style={{color:'#222', fontSize:'1.04rem', whiteSpace:'pre-wrap'}}>{resumeSections[idx].value}</div>
                    </div>
                  </React.Fragment>
                ))}
                <button
                  disabled={isProcessing}
                  onClick={async () => {
                    if (isProcessing) return;
                    setIsProcessing(true);
                    try {
                      // 1. 선택된 지원자 채용
                      await applicationApi.updateApplicationStatus(resumeModal.applicationId, "HIRED");
                      // 1-2. 공고 상태를 CLOSED로 변경
                      await jobPostApi.updateRecruitmentStatus(jobPostId, "CLOSED");

                      // 2. 나머지 지원자 불합격 처리
                      const rejectedApplicants = applicants.filter(
                        app => app.applicationId !== resumeModal.applicationId && app.status !== "REJECTED" && app.status !== "HIRED"
                      );
                      await Promise.all(
                        rejectedApplicants.map(app =>
                          applicationApi.updateApplicationStatus(app.applicationId, "REJECTED")
                        )
                      );

                      closeModal();
                      navigate('/', {
                        state: {
                          toast: {
                            message: "채용 완료 및 나머지 지원자 불합격 처리되었습니다.",
                            type: "success"
                          }
                        }
                      });
                    } catch (e) {
                      showToast.error("채용 처리에 실패했습니다.");
                    } finally {
                      setIsProcessing(false);
                    }
                  }}
                  style={{
                    marginTop: "1.5rem",
                    padding: "0.7rem 2rem",
                    background: "#6366f1",
                    color: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    fontWeight: "bold",
                    fontSize: "1.1rem",
                    cursor: isProcessing ? "not-allowed" : "pointer"
                  }}
                >
                  채용하기
                </button>
              </ResumePreviewBody>
            ) : (
              <ModalContent>{resumeModal.content}</ModalContent>
            )}
          </ResumePreviewContainer>
        </ResumeModalBackground>
      )}
    </PageContainer>
  );
};

export default ApplicantsList; 