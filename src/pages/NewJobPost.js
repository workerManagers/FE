import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/JobPost.module.css';
import { jobPostApi } from '../services/api';
import { showToast } from '../components/common/Toast';
import Toast from '../components/common/Toast';

const NewJobPost = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    companyName: '',
    jobName: '',
    jobPostDescription: '',
    mainTasks: '',
    qualifications: '',
    preferredQualifications: '',
    idealCandidate: '',
    jobPeriod: '',
    jobRegion: '',
    deadline: ''
  });
  const [companies, setCompanies] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const data = await jobPostApi.getCompanies();
        setCompanies(data);
      } catch (error) {
        console.error('Error fetching companies:', error);
        showToast.error('회사 목록을 불러오는 중 오류가 발생했습니다.');
      }
    };

    fetchCompanies();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'companyName') {
      // 회사 선택 시 해당 회사의 지역 정보를 찾아서 설정
      const selectedCompany = companies.find(company => company.companyName === value);
      setFormData(prev => ({
        ...prev,
        companyName: value,
        jobRegion: selectedCompany ? selectedCompany.companyRegion : ''
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.companyName) newErrors.companyName = '회사명을 입력해주세요';
    if (!formData.jobName) newErrors.jobName = '직무명을 입력해주세요';
    if (!formData.jobPostDescription) newErrors.jobPostDescription = '모집공고 설명을 입력해주세요';
    if (!formData.mainTasks) newErrors.mainTasks = '주요 업무를 입력해주세요';
    if (!formData.qualifications) newErrors.qualifications = '자격요건을 입력해주세요';
    if (!formData.jobPeriod) newErrors.jobPeriod = '고용형태를 선택해주세요';
    if (!formData.jobRegion) newErrors.jobRegion = '근무지역을 선택해주세요';
    if (!formData.deadline) newErrors.deadline = '마감일을 선택해주세요';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      // 마감일 형식 변환
      const deadlineDate = new Date(formData.deadline);
      deadlineDate.setHours(23, 59, 59);
      
      const postData = {
        ...formData,
        deadline: deadlineDate.toISOString()
      };

      console.log('Sending job post data:', postData);
      await jobPostApi.createJobPost(postData);
      navigate('/jobpost');
    } catch (error) {
      console.error('Error creating job post:', error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.removeItem('token');
        navigate('/login', { 
          replace: true,
          state: { message: '세션이 만료되었습니다. 다시 로그인해주세요.', type: 'error' }
        });
      } else {
        setErrors({ submit: '공고 등록 중 오류가 발생했습니다.' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <Toast />
      <h1 className={styles.title}>새 공고 작성</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="companyName">회사명</label>
          <select
            id="companyName"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            className={styles.select}
          >
            <option value="">회사를 선택하세요</option>
            {companies.map(company => (
              <option key={company.companyId} value={company.companyName}>
                {company.companyName}
              </option>
            ))}
          </select>
          {errors.companyName && <span className={styles.error}>{errors.companyName}</span>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="jobRegion">근무지역</label>
          <input
            type="text"
            id="jobRegion"
            name="jobRegion"
            value={formData.jobRegion}
            onChange={handleChange}
            className={styles.input}
            readOnly
          />
          {errors.jobRegion && <span className={styles.error}>{errors.jobRegion}</span>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="jobName">직무명</label>
          <input
            type="text"
            id="jobName"
            name="jobName"
            value={formData.jobName}
            onChange={handleChange}
            className={styles.input}
          />
          {errors.jobName && <span className={styles.error}>{errors.jobName}</span>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="jobPostDescription">모집공고 설명</label>
          <textarea
            id="jobPostDescription"
            name="jobPostDescription"
            value={formData.jobPostDescription}
            onChange={handleChange}
            className={styles.textarea}
            rows="3"
          />
          {errors.jobPostDescription && <span className={styles.error}>{errors.jobPostDescription}</span>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="mainTasks">주요 업무</label>
          <textarea
            id="mainTasks"
            name="mainTasks"
            value={formData.mainTasks}
            onChange={handleChange}
            className={styles.textarea}
            rows="3"
          />
          {errors.mainTasks && <span className={styles.error}>{errors.mainTasks}</span>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="qualifications">자격요건</label>
          <textarea
            id="qualifications"
            name="qualifications"
            value={formData.qualifications}
            onChange={handleChange}
            className={styles.textarea}
            rows="3"
          />
          {errors.qualifications && <span className={styles.error}>{errors.qualifications}</span>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="preferredQualifications">우대사항</label>
          <textarea
            id="preferredQualifications"
            name="preferredQualifications"
            value={formData.preferredQualifications}
            onChange={handleChange}
            className={styles.textarea}
            rows="3"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="idealCandidate">인재상</label>
          <textarea
            id="idealCandidate"
            name="idealCandidate"
            value={formData.idealCandidate}
            onChange={handleChange}
            className={styles.textarea}
            rows="3"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="jobPeriod">근무 기간</label>
          <input
            type="text"
            id="jobPeriod"
            name="jobPeriod"
            value={formData.jobPeriod}
            onChange={handleChange}
            className={styles.input}
            placeholder="예: 2년"
          />
          {errors.jobPeriod && <span className={styles.error}>{errors.jobPeriod}</span>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="deadline">마감일</label>
          <input
            type="date"
            id="deadline"
            name="deadline"
            value={formData.deadline}
            onChange={handleChange}
            className={styles.input}
          />
          {errors.deadline && <span className={styles.error}>{errors.deadline}</span>}
        </div>

        {errors.submit && <div className={styles.error}>{errors.submit}</div>}

        <div className={styles.buttonGroup}>
          <button type="button" onClick={() => navigate('/jobpost')} className={styles.cancelButton}>
            취소
          </button>
          <button type="submit" className={styles.submitButton} disabled={loading}>
            {loading ? '등록 중...' : '등록'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewJobPost; 