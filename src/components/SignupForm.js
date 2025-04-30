import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { userApi } from '../services/api';
import { showToast } from './common/Toast';
import Toast from './common/Toast';

const PageWrapper = styled.div`
  min-height: 100vh;
  background-color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1% 2%;
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
`;

const FormContainer = styled(motion.form)`
  display: flex;
  gap: 2rem;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(10px);
  padding: 2.5rem;
  border: 3px solid rgba(0, 0, 0, 0.3);
  border-radius: 24px;
  width: ${props => props.isCompany ? '80%' : '35%'};
  position: relative;
  margin-bottom: 80px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.15),
              inset 0 0 32px 0 rgba(31, 38, 135, 0.05);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 48px 0 rgba(31, 38, 135, 0.2),
                inset 0 0 32px 0 rgba(31, 38, 135, 0.1);
    border: 3px solid rgba(0, 0, 0, 0.4);
  }

  @media (max-width: 768px) {
    flex-direction: column;
    width: 95%;
    padding: 1.5rem;
    gap: 1.5rem;
    margin-bottom: 60px;
    box-shadow: 0 4px 16px 0 rgba(31, 38, 135, 0.15),
                inset 0 0 16px 0 rgba(31, 38, 135, 0.05);

    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 6px 24px 0 rgba(31, 38, 135, 0.2),
                  inset 0 0 16px 0 rgba(31, 38, 135, 0.1);
    }
  }
`;

const MainSection = styled.div`
  flex: ${props => props.isCompany ? '1' : '1'};
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  width: 100%;
  padding-right: ${props => props.isCompany ? '2rem' : '0'};
  border-right: ${props => props.isCompany ? '1px solid rgba(0, 0, 0, 0.3)' : 'none'};

  @media (max-width: 768px) {
    padding-right: 0;
    border-right: none;
    gap: 0.6rem;
  }
`;

const CompanySection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  padding-left: 2rem;
  border-left: 1px solid rgba(0, 0, 0, 0.3);

  @media (max-width: 768px) {
    padding-left: 0;
    padding-top: 1.2rem;
    border-left: none;
    border-top: 1px solid rgba(0, 0, 0, 0.3);
  }
`;

const Title = styled.h1`
  color: #000000;
  font-size: clamp(1.2rem, 1.8vw, 1.4rem);
  font-weight: 600;
  margin-bottom: 0.8rem;
  width: 100%;
  position: relative;
  display: inline-block;

  &:after {
    content: '';
    position: absolute;
    left: 0;
    bottom: -4px;
    width: 40px;
    height: 2px;
    background-color: #000000;
    transition: width 0.3s ease;
  }

  &:hover:after {
    width: 100%;
  }
`;

const UserTypeSelector = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.8rem;
  width: 100%;
`;

const UserTypeButton = styled(motion.button)`
  padding: 0.4rem 1.2rem;
  border: 2px solid #000000;
  border-radius: 6px;
  background: ${props => props.active ? '#000000' : 'white'};
  color: ${props => props.active ? 'white' : '#000000'};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: clamp(0.8rem, 1.2vw, 0.9rem);

  &:hover {
    background: ${props => props.active ? '#000000' : '#f5f5f5'};
  }
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  width: 100%;
  margin-bottom: 0.4rem;
`;

const Label = styled.label`
  color: #000000;
  font-size: clamp(0.8rem, 1.2vw, 0.9rem);
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: clamp(0.3rem, 1vw, 0.5rem);
  border: 2px solid #000000;
  border-radius: 6px;
  font-size: clamp(0.8rem, 1.2vw, 0.9rem);
  background: white;
  color: #000000;

  &:focus {
    outline: none;
    border-color: #000000;
    box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1);
  }

  &::placeholder {
    color: #666666;
  }
`;

const RadioGroup = styled.div`
  display: flex;
  gap: 1.2rem;
  width: ${props => props.isCompany ? '90%' : '300px'};
  
  @media (max-width: 480px) {
    gap: 1rem;
    width: 100%;
  }
`;

const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  color: #000000;
  cursor: pointer;
  font-size: clamp(0.8rem, 1.2vw, 0.9rem);
`;

const ButtonContainer = styled.div`
  position: absolute;
  left: 50%;
  bottom: -85px;
  transform: translateX(-50%);
  width: 140px;
  z-index: 10;
`;

const SubmitButton = styled(motion.button)`
  width: 120px;
  padding: 0.6rem 0;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  margin-bottom: 20px;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  border: 1px solid rgba(255, 255, 255, 0.18);

  &:hover:not(:disabled) {
    background: rgba(0, 0, 0, 0.9);
    transform: translateY(-2px);
    box-shadow: 0 10px 40px 0 rgba(31, 38, 135, 0.4);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.span`
  color: #ff0000;
  font-size: clamp(0.7rem, 1vw, 0.8rem);
  margin-top: 0.2rem;
`;

const schema = yup.object().shape({
  userName: yup
    .string()
    .required('이름은 필수 입력값입니다.')
    .max(20, '이름은 20자 이내로 입력해주세요.'),
  password: yup
    .string()
    .required('비밀번호는 필수 입력값입니다.')
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
      '비밀번호는 8자 이상, 영문, 숫자, 특수문자를 포함해야 합니다.'
    ),
  passwordConfirm: yup
    .string()
    .required('비밀번호 확인은 필수 입력값입니다.')
    .oneOf([yup.ref('password')], '비밀번호가 일치하지 않습니다.'),
  userEmail: yup
    .string()
    .email('올바른 이메일 형식이 아닙니다.')
    .required('이메일은 필수 입력값입니다.')
    .max(50, '이메일은 50자 이내로 입력해주세요.'),
  userSex: yup
    .string()
    .required('성별은 필수 입력값입니다.'),
  userAge: yup
    .number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .nullable()
    .min(0, '나이는 0보다 작을 수 없습니다.'),
  userType: yup
    .string()
    .required('사용자 유형은 필수 입력값입니다.'),
  companyInfo: yup.object().when('userType', {
    is: 'COMPANY',
    then: () => yup.object({
      companyName: yup.string().required('회사명은 필수 입력값입니다.'),
      companyRegion: yup.string().required('회사 지역은 필수 입력값입니다.'),
      companyCode: yup.string().required('사업자 등록번호는 필수 입력값입니다.')
    }),
    otherwise: () => yup.object().nullable()
  })
});

const SignupForm = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState('INDIVIDUAL');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      userType: 'INDIVIDUAL'
    }
  });

  const handleUserTypeChange = (type) => {
    setUserType(type);
    setValue('userType', type);
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);

    try {
      const submitData = {
        ...data,
        userType: userType,
        ...(userType === 'COMPANY' && {
          companyInfo: {
            companyName: data.companyInfo.companyName,
            companyRegion: data.companyInfo.companyRegion,
            companyCode: data.companyInfo.companyCode
          }
        })
      };

      await userApi.signup(submitData);
      showToast.success('회원가입이 완료되었습니다! 로그인 페이지로 이동합니다.');
      
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      console.error('회원가입 오류:', error);
      let errorMessage = '회원가입 중 오류가 발생했습니다.';
      
      if (error.response) {
        errorMessage = error.response.data.error || errorMessage;
      } else if (error.request) {
        errorMessage = '서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.';
      }
      
      showToast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  const errorVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <PageWrapper>
      <Toast />
      <FormContainer
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        onSubmit={handleSubmit(onSubmit)}
        isCompany={userType === 'COMPANY'}
      >
        <MainSection isCompany={userType === 'COMPANY'}>
          <Title isCompany={userType === 'COMPANY'}>회원가입</Title>
          <UserTypeSelector isCompany={userType === 'COMPANY'}>
            <UserTypeButton
              type="button"
              active={userType === 'INDIVIDUAL'}
              onClick={() => handleUserTypeChange('INDIVIDUAL')}
            >
              일반 회원
            </UserTypeButton>
            <UserTypeButton
              type="button"
              active={userType === 'COMPANY'}
              onClick={() => handleUserTypeChange('COMPANY')}
            >
              기업 회원
            </UserTypeButton>
          </UserTypeSelector>

          <InputGroup isCompany={userType === 'COMPANY'}>
            <Label>이름</Label>
            <Input
              type="text"
              {...register('userName')}
              placeholder="이름을 입력하세요"
              disabled={isSubmitting}
            />
            {errors.userName && (
              <ErrorMessage>{errors.userName.message}</ErrorMessage>
            )}
          </InputGroup>

          <InputGroup isCompany={userType === 'COMPANY'}>
            <Label>이메일</Label>
            <Input
              type="email"
              {...register('userEmail')}
              placeholder="이메일을 입력하세요"
              disabled={isSubmitting}
            />
            {errors.userEmail && (
              <ErrorMessage>{errors.userEmail.message}</ErrorMessage>
            )}
          </InputGroup>

          <InputGroup isCompany={userType === 'COMPANY'}>
            <Label>비밀번호</Label>
            <Input
              type="password"
              {...register('password')}
              placeholder="비밀번호를 입력하세요"
              disabled={isSubmitting}
            />
            {errors.password && (
              <ErrorMessage>{errors.password.message}</ErrorMessage>
            )}
          </InputGroup>

          <InputGroup isCompany={userType === 'COMPANY'}>
            <Label>비밀번호 확인</Label>
            <Input
              type="password"
              {...register('passwordConfirm')}
              placeholder="비밀번호를 다시 입력하세요"
              disabled={isSubmitting}
            />
            {errors.passwordConfirm && (
              <ErrorMessage>{errors.passwordConfirm.message}</ErrorMessage>
            )}
          </InputGroup>

          <InputGroup isCompany={userType === 'COMPANY'}>
            <Label>성별</Label>
            <RadioGroup isCompany={userType === 'COMPANY'}>
              <RadioLabel>
                <input
                  type="radio"
                  value="남"
                  {...register('userSex')}
                  disabled={isSubmitting}
                />
                남성
              </RadioLabel>
              <RadioLabel>
                <input
                  type="radio"
                  value="여"
                  {...register('userSex')}
                  disabled={isSubmitting}
                />
                여성
              </RadioLabel>
            </RadioGroup>
            {errors.userSex && (
              <ErrorMessage>{errors.userSex.message}</ErrorMessage>
            )}
          </InputGroup>

          <InputGroup isCompany={userType === 'COMPANY'}>
            <Label>나이</Label>
            <Input
              type="number"
              {...register('userAge')}
              placeholder="나이를 입력하세요"
              disabled={isSubmitting}
            />
            {errors.userAge && (
              <ErrorMessage>{errors.userAge.message}</ErrorMessage>
            )}
          </InputGroup>
        </MainSection>

        {userType === 'COMPANY' && (
          <CompanySection>
            <Title isCompany={true}>기업 정보</Title>
            <InputGroup isCompany={true}>
              <Label>회사명</Label>
              <Input
                type="text"
                {...register('companyInfo.companyName')}
                placeholder="회사명을 입력하세요"
                disabled={isSubmitting}
              />
              {errors.companyInfo?.companyName && (
                <ErrorMessage>{errors.companyInfo.companyName.message}</ErrorMessage>
              )}
            </InputGroup>

            <InputGroup isCompany={true}>
              <Label>회사 지역</Label>
              <Input
                type="text"
                {...register('companyInfo.companyRegion')}
                placeholder="회사 지역을 입력하세요"
                disabled={isSubmitting}
              />
              {errors.companyInfo?.companyRegion && (
                <ErrorMessage>{errors.companyInfo.companyRegion.message}</ErrorMessage>
              )}
            </InputGroup>

            <InputGroup isCompany={true}>
              <Label>사업자 등록번호</Label>
              <Input
                type="text"
                {...register('companyInfo.companyCode')}
                placeholder="사업자 등록번호를 입력하세요"
                disabled={isSubmitting}
              />
              {errors.companyInfo?.companyCode && (
                <ErrorMessage>{errors.companyInfo.companyCode.message}</ErrorMessage>
              )}
            </InputGroup>
          </CompanySection>
        )}

        <ButtonContainer>
          <SubmitButton
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? '처리 중...' : '가입하기'}
          </SubmitButton>
        </ButtonContainer>
      </FormContainer>
    </PageWrapper>
  );
};

export default SignupForm; 