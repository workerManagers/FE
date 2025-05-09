import React, { useState } from 'react';
import styled from 'styled-components';
import { FaRegBookmark, FaBookmark } from 'react-icons/fa';
import { bookmarkApi } from '../../services/api';
import { showToast } from '../common/Toast';

const Button = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.2rem;
  margin-top: -1.2rem;
  display: flex;
  align-items: center;
  color: ${props => (props.active ? '#2E7D32' : '#bbb')};
  font-size: 1.7rem;
  transition: all 0.2s ease;

  &:hover {
    color: #2E7D32;
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const BookmarkButton = ({ jobPostId, isBookmarked, bookmarkId, onBookmarkChange, disabled }) => {
  const [loading, setLoading] = useState(false);
  const userType = localStorage.getItem('userType');

  // 기업 사용자인 경우 null 반환
  if (userType === 'COMPANY') {
    return null;
  }

  const handleClick = async (e) => {
    e.stopPropagation();
    if (loading || disabled) return;
    setLoading(true);
    try {
      if (isBookmarked) {
        await bookmarkApi.deleteBookmark(bookmarkId);
        showToast.success('찜한 공고에서 해제되었습니다.');
        if (onBookmarkChange) onBookmarkChange(false, null);
      } else {
        const res = await bookmarkApi.createBookmark(jobPostId);
        if (res && (res.status === undefined || (res.status >= 200 && res.status < 300))) {
          showToast.success('공고를 찜했습니다.');
        }
        if (onBookmarkChange) onBookmarkChange(true, res.bookmarkId);
      }
      // 북마크 목록 재조회 및 콘솔 출력
      const myBookmarks = await bookmarkApi.getMyBookmarks();
      console.log('북마크 목록(getMyBookmarks):', myBookmarks);
    } catch (err) {
      let msg = '북마크 처리 중 오류가 발생했습니다.';
      if (err?.response?.data?.error) {
        msg = err.response.data.error;
      }
      showToast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={handleClick} active={isBookmarked} disabled={loading || disabled} title={isBookmarked ? '북마크 해제' : '북마크'}>
      {isBookmarked ? <FaBookmark /> : <FaRegBookmark />}
    </Button>
  );
};

export default BookmarkButton; 