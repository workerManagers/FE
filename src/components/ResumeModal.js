import React from 'react';
import styled from 'styled-components';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: #f8f9fa;
  padding: 2.5rem;
  border-radius: 28px;
  width: 90%;
  max-width: 1000px;
  max-height: 85vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 8px 32px 0 rgba(0,0,0,0.10);
  border: 2.5px solid #e5e7eb;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  background: none;
  border: none;
  font-size: 1.8rem;
  cursor: pointer;
  color: #666;
  
  &:hover {
    color: #333;
  }
`;

const Title = styled.h1`
  font-size: 1.32rem;
  color: #23272f;
  font-weight: 800;
  letter-spacing: -0.5px;
  margin-bottom: 2rem;
`;

const ResumeContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Section = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

const Label = styled.div`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #555;
`;

const Content = styled.div`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  background-color: #f8f9fa;
  white-space: pre-wrap;
  min-height: ${props => props.large ? '150px' : 'auto'};
`;

const parseResumeText = (text) => {
  const sections = {};
  const matches = {
    gender: text.match(/성별:([^\n]*)/),
    age: text.match(/나이:([^\n]*)/),
    desiredRegion: text.match(/원하는 근무지역:([^\n]*)/),
    introduction: text.match(/자기소개:([^\n]*)/),
    workExperience: text.match(/직무 경험 및 관련 활동:([^\n]*)/),
    traits: text.match(/나의 성향:([^\n]*)/)
  };

  for (const [key, match] of Object.entries(matches)) {
    sections[key] = match ? match[1].trim() : '';
  }

  return sections;
};

const ResumeModal = ({ resume, onClose }) => {
  if (!resume) return null;

  const resumeData = parseResumeText(resume.resumeText);

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <CloseButton onClick={onClose}>&times;</CloseButton>
        <Title>이력서 상세보기</Title>
        
        <ResumeContainer>
          <Section>
            <FormGroup>
              <Label>이름</Label>
              <Content>{resume.userName}</Content>
            </FormGroup>
            <FormGroup>
              <Label>성별</Label>
              <Content>{resumeData.gender}</Content>
            </FormGroup>
            <FormGroup>
              <Label>나이</Label>
              <Content>{resumeData.age}</Content>
            </FormGroup>
            <FormGroup>
              <Label>원하는 근무지역</Label>
              <Content>{resumeData.desiredRegion}</Content>
            </FormGroup>
          </Section>

          <Section>
            <FormGroup>
              <Label>자기소개</Label>
              <Content large>{resumeData.introduction}</Content>
            </FormGroup>
          </Section>

          <Section>
            <FormGroup>
              <Label>직무 경험 및 관련 활동</Label>
              <Content large>{resumeData.workExperience}</Content>
            </FormGroup>
          </Section>

          <Section>
            <FormGroup>
              <Label>나의 성향</Label>
              <Content>{resumeData.traits}</Content>
            </FormGroup>
          </Section>
        </ResumeContainer>
      </ModalContent>
    </ModalOverlay>
  );
};

export default ResumeModal; 