import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { applicationApi } from '../services/api';
import { jobPostApi } from '../services/api';
import { showToast } from '../components/common/Toast';
import Loading from '../components/common/Loading';

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

const TableRow = styled.tr`
  cursor: pointer;
  transition: background-color 0.2s;
  &:hover {
    background-color: #f8fafc;
  }
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

const ApplicationHistory = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      setLoading(true);
      try {
        const data = await applicationApi.getMyApplications();
        // 각 지원내역에 대해 직무명(jobName) 추가 및 로그 출력
        const applicationsWithJobName = await Promise.all(
          data.map(async (app) => {
            try {
              const jobPost = await jobPostApi.getJobPost(app.jobPostId);
              console.log('jobPostId:', app.jobPostId, 'jobName:', jobPost.jobName);
              return { ...app, jobName: jobPost.jobName };
            } catch (e) {
              console.log('jobPostId:', app.jobPostId, 'jobName fetch 실패');
              return { ...app, jobName: '' };
            }
          })
        );
        console.log('applicationsWithJobName:', applicationsWithJobName);
        setApplications(applicationsWithJobName);
      } catch (error) {
        showToast.error('지원 내역을 불러오지 못했습니다.');
      }
      setLoading(false);
    };
    fetchApplications();
  }, []);

  const handleRowClick = (jobPostId) => {
    navigate(`/jobpost/${jobPostId}`);
  };

  return (
    <PageContainer>
      <Title>지원 내역</Title>
      {loading ? (
        <Loading message="지원내역을 불러오는 중입니다..." />
      ) : applications.length === 0 ? (
        <EmptyState>지원한 내역이 없습니다.</EmptyState>
      ) : (
        <Table>
          <thead>
            <tr>
              <Th>회사명</Th>
              <Th>직무</Th>
              <Th>지원일</Th>
              <Th>상태</Th>
            </tr>
          </thead>
          <tbody>
            {applications.map(app => (
              <TableRow 
                key={app.applicationId}
                onClick={() => handleRowClick(app.jobPostId)}
              >
                <Td>{app.companyName}</Td>
                <Td>{app.jobName || '-'}</Td>
                <Td>{formatDate(app.appliedAt)}</Td>
                <Td>
                  <StatusBadge status={app.status}>
                    {app.status === 'APPLIED' ? '지원완료' : 
                     app.status === 'ACCEPTED' ? '합격' : 
                     app.status === 'REJECTED' ? '불합격' : 
                     app.status}
                  </StatusBadge>
                </Td>
              </TableRow>
            ))}
          </tbody>
        </Table>
      )}
    </PageContainer>
  );
};

export default ApplicationHistory; 