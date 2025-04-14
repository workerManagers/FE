import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { userApi } from '../services/api';
import { showToast } from './common/Toast';
import Toast from './common/Toast';

const FormContainer = styled(motion.form)`
  background: white;
  padding: 2.5rem;
  border-radius: 15px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  position: relative;
  overflow: hidden;
  margin: 1rem;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(to right, #4a90e2, #357abd);
  }

  @media (max-width: 480px) {
    padding: 1.5rem;
    margin: 0.5rem;
    border-radius: 10px;
  }
`;

const Title = styled(motion.h1)`
  text-align: center;
  color: #2c3e50;
  margin-bottom: 2rem;
  font-size: 1.8rem;
  font-weight: 600;

  @media (max-width: 480px) {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
  }
`;

const InputGroup = styled(motion.div)`
  margin-bottom: 2rem;
  position: relative;

  @media (max-width: 480px) {
    margin-bottom: 1.5rem;
  }
`;

const Label = styled(motion.label)`
  display: block;
  margin-bottom: 0.5rem;
  color: #34495e;
  font-weight: 500;
  font-size: 0.9rem;

  @media (max-width: 480px) {
    font-size: 0.85rem;
  }
`;

const Input = styled(motion.input)`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background-color: #f8f9fa;
  box-sizing: border-box;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;

  &:focus {
    outline: none;
    border-color: #4a90e2;
    box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.2);
    background-color: white;
  }

  &::placeholder {
    color: #95a5a6;
  }

  &[type="number"] {
    -moz-appearance: textfield;
    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
  }

  @media (max-width: 480px) {
    padding: 0.6rem 0.8rem;
    font-size: 0.9rem;
  }
`;

const RadioGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;

  @media (max-width: 480px) {
    gap: 0.5rem;
  }
`;

const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  background-color: #f8f9fa;
  transition: all 0.3s ease;

  &:hover {
    background-color: #e9ecef;
  }

  @media (max-width: 480px) {
    padding: 0.4rem 0.8rem;
    font-size: 0.9rem;
  }
`;

const RadioInput = styled.input`
  margin: 0;
  cursor: pointer;
`;

const SuccessMessage = styled(motion.div)`
  color: #27ae60;
  background-color: #d4edda;
  border: 1px solid #c3e6cb;
  padding: 0.75rem 1.25rem;
  margin-bottom: 1rem;
  border-radius: 8px;
  font-size: 0.9rem;
  text-align: center;
`;

const ErrorMessage = styled(motion.span)`
  color: #e74c3c;
  font-size: 0.875rem;
  margin-top: 0.25rem;
  display: block;
  position: absolute;
  bottom: -1.5rem;
  font-weight: 500;

  @media (max-width: 480px) {
    font-size: 0.8rem;
    bottom: -1.2rem;
  }
`;

const ApiErrorMessage = styled(motion.div)`
  color: #e74c3c;
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  padding: 0.75rem 1.25rem;
  margin-bottom: 1rem;
  border-radius: 8px;
  font-size: 0.9rem;
  text-align: center;
`;

const SubmitButton = styled(motion.button)`
  width: 100%;
  padding: 1rem;
  background: linear-gradient(to right, #4a90e2, #357abd);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 1rem;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(74, 144, 226, 0.3);
  }

  &:active {
    transform: translateY(0);
  }

  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 5px;
    height: 5px;
    background: rgba(255, 255, 255, 0.5);
    opacity: 0;
    border-radius: 100%;
    transform: scale(1, 1) translate(-50%);
    transform-origin: 50% 50%;
  }

  &:focus:not(:active)::after {
    animation: ripple 1s ease-out;
  }

  @keyframes ripple {
    0% {
      transform: scale(0, 0);
      opacity: 0.5;
    }
    100% {
      transform: scale(20, 20);
      opacity: 0;
    }
  }

  @media (max-width: 480px) {
    padding: 0.8rem;
    font-size: 0.9rem;
  }
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
    .oneOf([yup.ref('password'), null], '비밀번호가 일치하지 않습니다.'),
  userSex: yup
    .string()
    .max(20, '성별은 20자 이내로 입력해주세요.'),
  userAge: yup
    .number()
    .min(0, '나이는 0보다 작을 수 없습니다.')
    .nullable(),
  userEmail: yup
    .string()
    .email('올바른 이메일 형식이 아닙니다.')
    .max(20, '이메일은 20자 이내로 입력해주세요.')
    .required('이메일은 필수 입력값입니다.'),
});

const SignupForm = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const password = watch('password');

  const onSubmit = async (data) => {
    setIsSubmitting(true);

    try {
      await userApi.signup(data);
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
    <>
      <Toast />
      <FormContainer
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Title
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          회원가입
        </Title>

        <InputGroup variants={itemVariants}>
          <Label>이름</Label>
          <Input
            type="text"
            {...register('userName')}
            placeholder="이름을 입력하세요"
            whileFocus={{ scale: 1.02 }}
            disabled={isSubmitting}
          />
          <AnimatePresence>
            {errors.userName && (
              <ErrorMessage
                variants={errorVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
              >
                {errors.userName.message}
              </ErrorMessage>
            )}
          </AnimatePresence>
        </InputGroup>

        <InputGroup variants={itemVariants}>
          <Label>이메일</Label>
          <Input
            type="email"
            {...register('userEmail')}
            placeholder="이메일을 입력하세요"
            whileFocus={{ scale: 1.02 }}
            disabled={isSubmitting}
          />
          <AnimatePresence>
            {errors.userEmail && (
              <ErrorMessage
                variants={errorVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
              >
                {errors.userEmail.message}
              </ErrorMessage>
            )}
          </AnimatePresence>
        </InputGroup>

        <InputGroup variants={itemVariants}>
          <Label>비밀번호</Label>
          <Input
            type="password"
            {...register('password')}
            placeholder="비밀번호를 입력하세요"
            whileFocus={{ scale: 1.02 }}
            disabled={isSubmitting}
          />
          <AnimatePresence>
            {errors.password && (
              <ErrorMessage
                variants={errorVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
              >
                {errors.password.message}
              </ErrorMessage>
            )}
          </AnimatePresence>
        </InputGroup>

        <InputGroup variants={itemVariants}>
          <Label>비밀번호 확인</Label>
          <Input
            type="password"
            {...register('passwordConfirm')}
            placeholder="비밀번호를 다시 입력하세요"
            whileFocus={{ scale: 1.02 }}
            disabled={isSubmitting}
          />
          <AnimatePresence>
            {errors.passwordConfirm && (
              <ErrorMessage
                variants={errorVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
              >
                {errors.passwordConfirm.message}
              </ErrorMessage>
            )}
          </AnimatePresence>
        </InputGroup>

        <InputGroup variants={itemVariants}>
          <Label>성별</Label>
          <RadioGroup>
            <RadioLabel>
              <RadioInput
                type="radio"
                value="male"
                {...register('userSex')}
                disabled={isSubmitting}
              />
              남성
            </RadioLabel>
            <RadioLabel>
              <RadioInput
                type="radio"
                value="female"
                {...register('userSex')}
                disabled={isSubmitting}
              />
              여성
            </RadioLabel>
          </RadioGroup>
          <AnimatePresence>
            {errors.userSex && (
              <ErrorMessage
                variants={errorVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
              >
                {errors.userSex.message}
              </ErrorMessage>
            )}
          </AnimatePresence>
        </InputGroup>

        <InputGroup variants={itemVariants}>
          <Label>나이</Label>
          <Input
            type="number"
            {...register('userAge')}
            placeholder="나이를 입력하세요 (선택사항)"
            whileFocus={{ scale: 1.02 }}
            disabled={isSubmitting}
          />
          <AnimatePresence>
            {errors.userAge && (
              <ErrorMessage
                variants={errorVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
              >
                {errors.userAge.message}
              </ErrorMessage>
            )}
          </AnimatePresence>
        </InputGroup>

        <SubmitButton
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={isSubmitting}
        >
          {isSubmitting ? '처리 중...' : '가입하기'}
        </SubmitButton>
      </FormContainer>
    </>
  );
};

export default SignupForm; 