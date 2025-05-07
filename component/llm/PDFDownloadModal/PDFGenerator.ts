import html2canvas from 'html2canvas';
import JsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { IChatHistoryDetailRes } from '@InterfaceFarm/llm';

// 파일 상단에 인터페이스 확장
interface ExtendedChatHistory extends IChatHistoryDetailRes {
  chartImage?: string;
}

export const generatePDF = async (histories: ExtendedChatHistory[]) => {
  const pdf = new JsPDF();
  let yOffset = 20;

  const processedHistories = await Promise.all(
    histories.map(async (history, i) => {
      // 페이지 번호 추가
      pdf.setFontSize(10);
      pdf.text(
        `${i + 1}/${histories.length}`,
        pdf.internal.pageSize.width - 20,
        10
      );

      // 질문 추가
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      const questionLines = pdf.splitTextToSize(
        `Q. ${history.question_text}`,
        pdf.internal.pageSize.width - 40
      );
      pdf.text(questionLines, 20, yOffset);
      yOffset += 10 * questionLines.length;

      // 답변 추가
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      const answerLines = pdf.splitTextToSize(
        `A. ${history.answer_text}`,
        pdf.internal.pageSize.width - 40
      );
      pdf.text(answerLines, 20, yOffset);
      yOffset += 10 * answerLines.length;

      // 차트가 있는 경우
      if (history.answer_chart) {
        const chartElement = document.querySelector('.recharts-wrapper');
        if (chartElement) {
          const canvas = await html2canvas(chartElement as HTMLElement);
          history.chartImage = canvas.toDataURL('image/png');
        }
      }

      // 테이블이 있는 경우
      if (history.answer_table && history.answer_table.length > 0) {
        autoTable(pdf, {
          head: [history.answer_metadata?.columns || []],
          body: history.answer_table,
          startY: yOffset,
          margin: { left: 20 },
          styles: { fontSize: 10 },
        });
        yOffset = (pdf as any).lastAutoTable.finalY + 20;
      }

      // 다음 히스토리를 위한 새 페이지 추가
      if (i < histories.length - 1) {
        pdf.addPage();
        yOffset = 20;
      }

      return history;
    })
  );

  // PDF 생성 로직
  for (let i = 0; i < processedHistories.length; i++) {
    const { chartImage } = processedHistories[i];
    if (chartImage) {
      pdf.addImage(chartImage, 'PNG', 20, yOffset, 170, 100);
      yOffset += 110;
    }

    // 테이블이 있는 경우
    if (
      processedHistories[i].answer_table &&
      processedHistories[i].answer_table.length > 0
    ) {
      autoTable(pdf, {
        head: [processedHistories[i].answer_metadata?.columns || []],
        body: processedHistories[i].answer_table,
        startY: yOffset,
        margin: { left: 20 },
        styles: { fontSize: 10 },
      });
      yOffset = (pdf as any).lastAutoTable.finalY + 20;
    }
  }

  // PDF 다운로드
  pdf.save(`GOCHAT_대화내역_${new Date().toLocaleDateString()}.pdf`);
};
