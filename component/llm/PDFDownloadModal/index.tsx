import React, { useState } from 'react';
import styled from '@emotion/styled';
import { fetchChatHistoryDetail } from '@ApiFarm/llm';
import Modal from '@ComponentFarm/modules/Modal/Modal';
import { PDFPreviewModal } from './PDFPreviewModal';

const ModalContent = styled.div`
  padding: 0 1rem;
`;

const CheckboxList = styled.div`
  max-height: 40rem;
  overflow-y: auto;
  margin: 2rem 0;
`;

const CheckboxItem = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #eee;

  &:last-child {
    border-bottom: none;
  }

  input[type='checkbox'] {
    margin-right: 1.2rem;
    width: 1.8rem;
    height: 1.8rem;
  }

  .item-content {
    display: flex;
    justify-content: space-between;
    width: 100%;

    .question {
      font-size: 1.6rem;
      color: #2a2a2a;
    }

    .date {
      font-size: 1.4rem;
      color: #909090;
    }
  }
`;

const SelectionInfo = styled.div`
  text-align: right;
  padding: 1rem;
  color: #666;
  font-size: 1.4rem;
`;

interface PDFDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  historyList: {
    chat_history_idx: number;
    question_text: string;
    created_at: string;
  }[];
}

export const PDFDownloadModal: React.FC<PDFDownloadModalProps> = ({
  isOpen,
  onClose,
  historyList,
}) => {
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckboxChange = (chat_history_idx: number) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(chat_history_idx)) {
      newSelected.delete(chat_history_idx);
    } else {
      newSelected.add(chat_history_idx);
    }
    setSelectedItems(newSelected);
  };

  const handlePreview = async () => {
    if (selectedItems.size === 0) return;

    setIsLoading(true);
    try {
      const selectedHistories = await Promise.all(
        Array.from(selectedItems).map(idx => fetchChatHistoryDetail(idx))
      );
      setPreviewData(selectedHistories);
      setIsPreviewOpen(true);
      onClose(); // 선택 모달 닫기
    } catch (error) {
      console.error('대화 내역 조회 실패:', error);
      // TODO: 에러 처리
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="대화 내역 PDF 다운로드"
        onFormSubmit={handlePreview}
        submitButtonText={isLoading ? '불러오는 중...' : '미리보기'}
        cancelButtonText="취소"
      >
        <ModalContent>
          <SelectionInfo>
            {selectedItems.size}개 선택됨 (최대 10개)
          </SelectionInfo>
          <CheckboxList>
            {historyList.map(item => (
              <CheckboxItem key={item.chat_history_idx}>
                <input
                  type="checkbox"
                  checked={selectedItems.has(item.chat_history_idx)}
                  onChange={() => handleCheckboxChange(item.chat_history_idx)}
                  disabled={
                    selectedItems.size >= 10 &&
                    !selectedItems.has(item.chat_history_idx)
                  }
                />
                <div className="item-content">
                  <span className="question">{item.question_text}</span>
                  <span className="date">
                    {new Date(item.created_at).toLocaleTimeString('ko-KR', {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: false,
                    })}
                  </span>
                </div>
              </CheckboxItem>
            ))}
          </CheckboxList>
        </ModalContent>
      </Modal>

      <PDFPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => {
          setIsPreviewOpen(false);
          setPreviewData([]);
        }}
        previewData={previewData}
      />
    </>
  );
};
