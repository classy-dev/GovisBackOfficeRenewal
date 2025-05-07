import React, { useRef } from 'react';
import html2canvas from 'html2canvas';
import JsPDF from 'jspdf';
import styled from '@emotion/styled';
import Modal from '@ComponentFarm/modules/Modal/Modal';
import RechartsWrapper from '@ComponentFarm/llm/RechartsWrapper';

const PreviewContent = styled.div`
  max-height: 70vh;
  overflow-y: auto;
  padding: 2rem;
  background: #f5f5f5;

  .preview-page {
    background: white;
    margin-bottom: 2rem;
    padding: 3rem;
    box-shadow: 0 0.2rem 0.4rem rgba(0, 0, 0, 0.1);

    &:last-child {
      margin-bottom: 0;
    }
  }
`;

const UserQuestion = styled.div`
  margin-bottom: 3.2rem;

  .talk {
    display: flex;
    align-items: center;
    width: fit-content;

    margin-left: auto;
    padding: 2rem 3.2rem;
    color: #181818;
    font-size: 1.6rem;
    border-radius: 0.4rem;
    background: #ffe47b;
  }
`;

const AnswerSection = styled.div`
  .title {
    display: flex;
    align-items: center;
    height: 3.2rem;
    margin-bottom: 2.4rem;
    font-size: 2rem;
    font-weight: bold;
    padding-left: 4.8rem;
    background: url('/images/llm/ico_data_analyze.webp') no-repeat left center;
    background-size: 3.2rem;
    text-align: left;
  }

  .answer-text {
    font-size: 1.6rem;
    line-height: 1.5;
    margin-bottom: 2rem;
    white-space: pre-wrap;
    text-align: left;
  }

  table {
    width: 100%;
    text-align: left;
    border-collapse: collapse;

    th,
    td {
      padding: 1.2rem;
      border: 1px solid #e0e0e0;
      text-align: left;
    }

    td[data-type='number'] {
      text-align: right;
    }
  }
`;

const PageNumber = styled.div`
  text-align: right;
  color: #666;
  font-size: 1.2rem;
  margin-top: 2rem;
`;

interface PDFPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  previewData: any[];
}

export const PDFPreviewModal: React.FC<PDFPreviewModalProps> = ({
  isOpen,
  onClose,
  previewData,
}) => {
  const previewRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!previewRef.current) return;

    try {
      const pdf = new JsPDF('p', 'mm', 'a4');
      const pages = previewRef.current.querySelectorAll('.preview-page');

      for (let i = 0; i < pages.length; i++) {
        const pageElement = pages[i] as HTMLElement;
        const pageHeight = pageElement.offsetHeight;
        const a4Height = 297; // A4 높이 (mm)
        const scale = 0.7; // PDF에 들어갈 크기 비율

        // 한 페이지에 들어갈 수 있는 높이 계산
        const contentHeight =
          (a4Height * pageElement.offsetWidth) / (210 * scale);
        const numberOfSlices = Math.ceil(pageHeight / contentHeight);

        for (let slice = 0; slice < numberOfSlices; slice++) {
          // 첫 페이지가 아니면 새 페이지 추가
          if (i > 0 || slice > 0) {
            pdf.addPage();
          }

          // eslint-disable-next-line no-await-in-loop
          const canvas = await html2canvas(pageElement, {
            scale: 2,
            useCORS: true,
            logging: false,
            windowHeight: pageHeight,
            y: slice * contentHeight,
            height: Math.min(contentHeight, pageHeight - slice * contentHeight),
          });

          const imgData = canvas.toDataURL('image/png');

          // PDF 페이지 크기
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = pdf.internal.pageSize.getHeight();

          // 이미지 크기를 PDF 페이지의 70%로 조정
          const imgWidth = pdfWidth * scale;
          const imgHeight = (canvas.height * imgWidth) / canvas.width;

          // 중앙 정렬을 위한 여백 계산
          const xOffset = (pdfWidth - imgWidth) / 2;
          const yOffset = 20; // 상단 여백 고정

          // 이미지를 PDF 페이지에 추가
          pdf.addImage(imgData, 'PNG', xOffset, yOffset, imgWidth, imgHeight);

          // 페이지 번호 추가
          pdf.setFontSize(8);
          if (numberOfSlices > 1) {
            pdf.text(
              `${i + 1}/${pages.length} - ${slice + 1}/${numberOfSlices}`,
              pdfWidth - 20,
              pdfHeight - 10
            );
          } else {
            pdf.text(`${i + 1}/${pages.length}`, pdfWidth - 20, pdfHeight - 10);
          }
        }
      }

      const now = new Date();
      const fileName = `GOCHAT_대화내역_${now.toLocaleDateString()}_${now
        .toLocaleTimeString('ko-KR', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        })
        .replace(':', '')}.pdf`;
      pdf.save(fileName);
      onClose();
    } catch (error) {
      console.error('PDF 생성 중 오류 발생:', error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="PDF 미리보기"
      onFormSubmit={handleDownload}
      submitButtonText="PDF 다운로드"
      cancelButtonText="취소"
    >
      <PreviewContent ref={previewRef}>
        {previewData.map((history, index) => (
          <div key={index} className="preview-page">
            <UserQuestion>
              <div className="talk">{history.question_text}</div>
            </UserQuestion>

            <AnswerSection>
              <h2 className="title">데이터 분석 결과</h2>
              <div className="answer-text">{history.answer_text}</div>

              {history.answer_chart && (
                <RechartsWrapper
                  type={history.answer_chart.type}
                  data={history.answer_chart.data}
                  options={history.answer_chart.options}
                  title={history.answer_chart.title}
                />
              )}

              {history.answer_table && history.answer_table.length > 0 && (
                <table>
                  <thead>
                    <tr>
                      {history.answer_metadata?.columns.map(
                        (col: string, i: number) => <th key={i}>{col}</th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {history.answer_table.map(
                      (row: any[], rowIndex: number) => (
                        <tr key={rowIndex}>
                          {row.map((cell: any, cellIndex: number) => (
                            <td key={cellIndex}>
                              {typeof cell === 'number'
                                ? cell.toLocaleString()
                                : cell}
                              {history.answer_metadata?.units?.[cellIndex]}
                            </td>
                          ))}
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              )}
            </AnswerSection>

            <PageNumber>
              {index + 1} / {previewData.length}
            </PageNumber>
          </div>
        ))}
      </PreviewContent>
    </Modal>
  );
};
