import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/JobPost.module.css';
import { createJobPost } from '../api/jobPostApi';

const NewJobPost = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    industrialAccidentId: '',
    companyId: '',
    jobCodeId: '',
    jobPostDescription: '',
    jobPeriod: '',
    deadline: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // deadline을 ISO 형식으로 변환
      const deadlineDate = new Date(formData.deadline);
      deadlineDate.setHours(23, 59, 59);
      
      const postData = {
        ...formData,
        deadline: deadlineDate.toISOString()
      };

      await createJobPost(postData);
      navigate('/jobpost');
    } catch (error) {
      alert('공고 등록 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>새 공고 작성</h1>
      
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label>산재보험 ID</label>
          <input
            type="number"
            name="industrialAccidentId"
            value={formData.industrialAccidentId}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label>회사 ID</label>
          <input
            type="number"
            name="companyId"
            value={formData.companyId}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label>직종 코드 ID</label>
          <input
            type="number"
            name="jobCodeId"
            value={formData.jobCodeId}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label>공고 설명</label>
          <textarea
            name="jobPostDescription"
            value={formData.jobPostDescription}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label>고용형태</label>
          <select
            name="jobPeriod"
            value={formData.jobPeriod}
            onChange={handleChange}
            required
          >
            <option value="">고용형태 선택</option>
            <option value="정규직">정규직</option>
            <option value="계약직">계약직</option>
            <option value="인턴">인턴</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label>마감일</label>
          <input
            type="date"
            name="deadline"
            value={formData.deadline}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.buttonGroup}>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className={styles.cancelButton}
          >
            취소
          </button>
          <button type="submit" className={styles.submitButton}>
            등록
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewJobPost; 