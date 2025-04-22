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
  border: 2px solid #000000;
  border-radius: 10px;
  width: 100%;
  max-width: 400px;
  position: relative;
  overflow: hidden;
  margin: 1rem;

  @media (max-width: 480px) {
    padding: 1.5rem;
    margin: 0.5rem;
  }
`;

const Title = styled(motion.h1)`
  text-align: center;
  color: #000000;
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
  color: #000000;
  font-weight: 500;
  font-size: 0.9rem;

  @media (max-width: 480px) {
    font-size: 0.85rem;
  }
`;

const Input = styled(motion.input)`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #000000;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background-color: white;
  color: #000000;

  &:focus {
    outline: none;
    border-color: #000000;
    box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1);
  }

  &::placeholder {
    color: #666666;
  }

  @media (max-width: 480px) {
    padding: 0.6rem 0.8rem;
    font-size: 0.9rem;
  }
`;

const ErrorMessage = styled(motion.span)`
  color: #ff0000;
  font-size: 0.875rem;
  margin-top: 0.25rem;
  display: block;
  font-weight: 500;

  @media (max-width: 480px) {
    font-size: 0.8rem;
  }
`;

const SubmitButton = styled(motion.button)`
  width: 100%;
  padding: 1rem;
  background: #000000;
  color: white;
  border: 2px solid #000000;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 1rem;
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    background: white;
    color: #000000;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  @media (max-width: 480px) {
    padding: 0.8rem;
    font-size: 0.9rem;
  }
`;

const SignupLink = styled(motion.div)`
  text-align: center;
  margin-top: 1.5rem;
  color: #000000;
  font-size: 0.9rem;

  a {
    color: #000000;
    text-decoration: none;
    font-weight: 600;
    margin-left: 0.5rem;
    transition: all 0.3s ease;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const schema = yup.object().shape({
  userEmail: yup
    .string()
    .email('올바른 이메일 형식이 아닙니다.')
    .required('이메일은 필수 입력값입니다.'),
  password: yup
    .string()
    .required('비밀번호는 필수 입력값입니다.'),
});

const LoginForm = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);

    try {
      const response = await userApi.login(data);
      // 로그인 성공 시 토큰과 사용자 이름 저장
      localStorage.setItem('token', response.accessToken);
      localStorage.setItem('userName', response.userName);
      showToast.success(`${response.userName}님 안녕하세요!`);
      
      setTimeout(() => {
        navigate('/'); // 로그인 후 메인 페이지로 이동
      }, 1500);
    } catch (error) {
      console.error('로그인 오류:', error);
      let errorMessage = '로그인 중 오류가 발생했습니다.';
      
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
          로그인
        </Title>

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

        <SubmitButton
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={isSubmitting}
        >
          {isSubmitting ? '처리 중...' : '로그인'}
        </SubmitButton>

        <SignupLink
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          계정이 없으신가요?
          <motion.a
            href="/signup"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            회원가입
          </motion.a>
        </SignupLink>
      </FormContainer>
    </>
  );
};

export default LoginForm; 