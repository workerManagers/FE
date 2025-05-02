import React, { useState } from 'react';
import styled from 'styled-components';

const Overlay = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(30,32,38,0.45);
  z-index: 4000;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const CustomizerBox = styled.div`
  background: #fff;
  border-radius: 22px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.18);
  padding: 2rem 1.5rem 1.2rem 1.5rem;
  min-width: 340px;
  max-width: 95vw;
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
  position: relative;
`;

const SectionRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1.2rem;
  margin-bottom: 0.7rem;
`;

const Section = styled.div`
  margin-bottom: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 1.1rem;
  flex-wrap: wrap;
  min-width: 0;
`;

const Label = styled.label`
  font-weight: 600;
  color: #23272f;
  min-width: 110px;
  font-size: 1.05rem;
`;

const ColorInput = styled.input`
  width: 38px;
  height: 38px;
  border: none;
  border-radius: 10px;
  background: #f4f5f7;
  box-shadow: 0 1px 4px rgba(180,180,200,0.10);
  cursor: pointer;
`;

const RangeInput = styled.input`
  width: 160px;
`;

const Select = styled.select`
  padding: 0.5rem 1.1rem;
  border-radius: 8px;
  border: 1.5px solid #e5e7eb;
  font-size: 1rem;
  background: #f8fafc;
`;

const Checkbox = styled.input`
  width: 20px;
  height: 20px;
`;

const PreviewBubble = styled.div`
  display: inline-block;
  padding: 0.7rem 1.3rem;
  background: ${props => props.color || '#6366f1'};
  color: #fff;
  border-radius: ${props => props.radius || 18}px;
  box-shadow: ${props => props.shadow ? '0 2px 8px rgba(99,102,241,0.13)' : 'none'};
  font-size: 1rem;
  margin-left: 1.2rem;
  min-width: 60px;
  text-align: center;
`;

const PreviewFont = styled.span`
  font-family: ${props => props.fontFamily};
  margin-left: 1.2rem;
  color: #23272f;
  font-size: 1rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1.2rem;
  justify-content: flex-end;
  position: sticky;
  bottom: 0;
  background: #fff;
  padding-top: 1.5rem;
  margin-top: 1.5rem;
`;

const Button = styled.button`
  padding: 0.8rem 2.1rem;
  border-radius: 14px;
  border: none;
  font-weight: 700;
  font-size: 1.08rem;
  background: linear-gradient(90deg, #f3f4f6 0%, #e5e7eb 100%);
  color: #23272f;
  box-shadow: 0 2px 8px rgba(180,180,200,0.13);
  cursor: pointer;
  transition: background 0.18s, color 0.13s;
  &:hover {
    background: linear-gradient(90deg, #e5e7eb 0%, #f3f4f6 100%);
    color: #6366f1;
  }
`;

function ChatRoomCustomizer({ onClose, onSave, initial }) {
  // 옵션 상태
  const [bgColor, setBgColor] = useState(initial?.bgColor || '#f8f9fa');
  const [bubbleColor, setBubbleColor] = useState(initial?.bubbleColor || '#6366f1');
  const [bubbleRadius, setBubbleRadius] = useState(initial?.bubbleRadius || 18);
  const [bubbleShadow, setBubbleShadow] = useState(initial?.bubbleShadow ?? true);
  const [headerColor, setHeaderColor] = useState(initial?.headerColor || '#fff');
  const [dividerColor, setDividerColor] = useState(initial?.dividerColor || '#b0b4c0');

  // 저장
  const handleSave = () => {
    const theme = {
      bgColor, bubbleColor, bubbleRadius, bubbleShadow, headerColor, dividerColor
    };
    localStorage.setItem('chatTheme', JSON.stringify(theme));
    if (onSave) onSave(theme);
    onClose();
  };

  return (
    <Overlay>
      <CustomizerBox>
        <h2 style={{marginBottom:'1.2rem', fontWeight:700, fontSize:'1.25rem'}}>채팅방 꾸미기</h2>
        <SectionRow>
          <Row>
            <Label>채팅방 배경색</Label>
            <ColorInput type="color" value={bgColor} onChange={e => setBgColor(e.target.value)} />
          </Row>
          <Row>
            <Label>내 말풍선 색상</Label>
            <ColorInput type="color" value={bubbleColor} onChange={e => setBubbleColor(e.target.value)} />
            <PreviewBubble color={bubbleColor} radius={bubbleRadius} shadow={bubbleShadow}>안녕하세요</PreviewBubble>
          </Row>
        </SectionRow>
        <SectionRow>
          <Row>
            <Label>말풍선 둥글기</Label>
            <RangeInput type="range" min={8} max={32} value={bubbleRadius} onChange={e => setBubbleRadius(Number(e.target.value))} />
            <span>{bubbleRadius}px</span>
            <PreviewBubble color={bubbleColor} radius={bubbleRadius} shadow={bubbleShadow}>ㅎㅇ</PreviewBubble>
          </Row>
          <Row>
            <Label>말풍선 그림자</Label>
            <Checkbox type="checkbox" checked={bubbleShadow} onChange={e => setBubbleShadow(e.target.checked)} />
            <PreviewBubble color={bubbleColor} radius={bubbleRadius} shadow={bubbleShadow}>shadow</PreviewBubble>
          </Row>
        </SectionRow>
        <SectionRow>
          <Row>
            <Label>상단바 색상</Label>
            <ColorInput type="color" value={headerColor} onChange={e => setHeaderColor(e.target.value)} />
          </Row>
          <Row>
            <Label>구분선 색상</Label>
            <ColorInput type="color" value={dividerColor} onChange={e => setDividerColor(e.target.value)} />
          </Row>
        </SectionRow>
        <ButtonGroup>
          <Button onClick={onClose}>취소</Button>
          <Button onClick={handleSave}>저장</Button>
        </ButtonGroup>
      </CustomizerBox>
    </Overlay>
  );
}

export default ChatRoomCustomizer; 