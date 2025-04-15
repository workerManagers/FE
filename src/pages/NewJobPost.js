import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/JobPost.module.css';
import { jobPostApi } from '../services/api';

const NewJobPost = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    jobName: '',
    jobPostDescription: '',
    jobPeriod: '',
    deadline: '',
    companyName: '',
    companyRegion: '',
    industrialAccidentName: ''
  });

  const [jobCodes, setJobCodes] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // 토큰 확인
    const token = localStorage.getItem('token');
    if (!token) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const [jobCodesData, companiesData] = await Promise.all([
          jobPostApi.getJobCodes(),
          jobPostApi.getCompanies()
        ]);
        setJobCodes(jobCodesData);
        setCompanies(companiesData);
      } catch (error) {
        console.error('Error fetching data:', error);
        if (error.response?.status === 401 || error.response?.status === 403) {
          alert('세션이 만료되었습니다. 다시 로그인해주세요.');
          navigate('/login');
        }
      }
    };

    fetchData();
  }, [navigate]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.jobName) {
      newErrors.jobName = '직종 이름을 입력해주세요.';
    } else if (formData.jobName.length > 100) {
      newErrors.jobName = '직종 이름은 100자 이내로 입력해주세요.';
    }

    if (!formData.jobPostDescription) {
      newErrors.jobPostDescription = '모집공고 설명을 입력해주세요.';
    } else if (formData.jobPostDescription.length > 500) {
      newErrors.jobPostDescription = '모집공고 설명은 500자 이내로 입력해주세요.';
    }

    if (!formData.jobPeriod) {
      newErrors.jobPeriod = '근무 기간을 입력해주세요.';
    } else if (formData.jobPeriod.length > 50) {
      newErrors.jobPeriod = '근무 기간은 50자 이내로 입력해주세요.';
    }

    if (!formData.deadline) {
      newErrors.deadline = '마감일을 선택해주세요.';
    }

    if (!formData.companyName) {
      newErrors.companyName = '회사 이름을 입력해주세요.';
    } else if (formData.companyName.length > 100) {
      newErrors.companyName = '회사 이름은 100자 이내로 입력해주세요.';
    }

    if (!formData.industrialAccidentName) {
      newErrors.industrialAccidentName = '산업재해 이름을 입력해주세요.';
    } else if (formData.industrialAccidentName.length > 100) {
      newErrors.industrialAccidentName = '산업재해 이름은 100자 이내로 입력해주세요.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'companyName') {
      // 회사 선택 시 해당 회사의 지역 정보를 찾아서 설정
      const selectedCompany = companies.find(company => company.companyName === value);
      setFormData(prev => ({
        ...prev,
        companyName: value,
        companyRegion: selectedCompany ? selectedCompany.companyRegion : ''
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // 입력 시 에러 메시지 제거
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    // 토큰 확인
    const token = localStorage.getItem('token');
    if (!token) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }

    try {
      const response = await jobPostApi.createJobPost(formData);
      if (response.message) {
        alert(response.message);
      } else {
        alert('모집공고가 성공적으로 등록되었습니다.');
      }
      navigate('/jobpost');
    } catch (error) {
      console.error('Error creating job post:', error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        alert('세션이 만료되었습니다. 다시 로그인해주세요.');
        navigate('/login');
      } else {
        const errorMessage = error.response?.data?.message || '모집공고 등록 중 오류가 발생했습니다. 다시 시도해주세요.';
        alert(errorMessage);
      }
    }
  };

  return (
    <div className={styles.container}>
      <h1>새 공고 작성</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="jobName">직종 이름 *</label>
          <select
            id="jobName"
            name="jobName"
            value={formData.jobName}
            onChange={handleChange}
            className={styles.select}
          >
            <option value="">직종을 선택하세요</option>
            {jobCodes.map(job => (
              <option key={job.jobCodeId} value={job.jobName}>
                {job.jobName}
              </option>
            ))}
          </select>
          {errors.jobName && <span className={styles.error}>{errors.jobName}</span>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="companyName">회사 이름 *</label>
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
          <label htmlFor="companyRegion">근무지역 *</label>
          <input
            type="text"
            id="companyRegion"
            name="companyRegion"
            value={formData.companyRegion}
            onChange={handleChange}
            readOnly
            className={styles.readOnlyInput}
          />
          {errors.companyRegion && <span className={styles.error}>{errors.companyRegion}</span>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="industrialAccidentName">산업재해 이름 *</label>
          <input
            type="text"
            id="industrialAccidentName"
            name="industrialAccidentName"
            value={formData.industrialAccidentName}
            onChange={handleChange}
            maxLength={100}
            placeholder="산업재해 이름을 입력하세요"
          />
          {errors.industrialAccidentName && <span className={styles.error}>{errors.industrialAccidentName}</span>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="jobPeriod">근무 기간 *</label>
          <input
            type="text"
            id="jobPeriod"
            name="jobPeriod"
            value={formData.jobPeriod}
            onChange={handleChange}
            maxLength={50}
            placeholder="근무 기간을 입력하세요"
          />
          {errors.jobPeriod && <span className={styles.error}>{errors.jobPeriod}</span>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="deadline">마감일 *</label>
          <input
            type="date"
            id="deadline"
            name="deadline"
            value={formData.deadline}
            onChange={handleChange}
          />
          {errors.deadline && <span className={styles.error}>{errors.deadline}</span>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="jobPostDescription">모집공고 설명 *</label>
          <textarea
            id="jobPostDescription"
            name="jobPostDescription"
            value={formData.jobPostDescription}
            onChange={handleChange}
            maxLength={500}
            rows="5"
            placeholder="모집공고 설명을 입력하세요"
          />
          <div className={styles.charCount}>
            {formData.jobPostDescription.length}/500
          </div>
          {errors.jobPostDescription && <span className={styles.error}>{errors.jobPostDescription}</span>}
        </div>

        <div className={styles.buttonGroup}>
          <button type="button" onClick={() => navigate('/jobpost')} className={styles.cancelButton}>
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