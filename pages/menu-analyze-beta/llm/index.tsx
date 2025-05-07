import { useEffect, useState, useRef, useCallback } from 'react';
import dayjs from 'dayjs';
import { observer } from 'mobx-react';
import { useRouter } from 'next/router';
import { BeatLoader } from 'react-spinners';
import { useQuery } from 'react-query';
import styled from '@emotion/styled';
import {
  createChatRoom,
  fetchChatHistoryList,
  fetchChatHistoryDetail,
} from '@ApiFarm/llm';
import Modal from '@ComponentFarm/modules/Modal/Modal';
import { Button } from '@ComponentFarm/atom/Button/Button';
import Spinner from '@ComponentFarm/atom/Spinner/Spinner';
import { initDB, saveData } from '@ComponentFarm/llm/db';
import { PDFDownloadModal } from '@ComponentFarm/llm/PDFDownloadModal';
import QueryInput from '@ComponentFarm/llm/QueryInput';
import RechartsWrapper from '@ComponentFarm/llm/RechartsWrapper';
import useIsomorphicLayoutEffect from '@HookFarm/useIsomorphicLayoutEffect';
import useQueryParams from '@HookFarm/useQueryParams';
import { menuAnalyzeStore } from '@MobxFarm/MenuAnalyzeStore';
import { queryStore } from '@MobxFarm/QueryStore';
import { voiceStore } from '@MobxFarm/VoiceStore';

const LLMContent = styled.div`
  padding: 0;
`;

const Header = styled.div`
  .wrap {
    display: flex;
    align-items: center;
    h1 {
      width: 32.3rem;
      height: 3.2rem;
      background: url('/images/llm/llm_logo.webp') no-repeat center center /
        contain;
    }

    button {
      margin-left: auto;
    }
  }
  .txt_info {
    margin-top: 1.6rem;
    font-size: 1.8rem;
    font-weight: normal;
    color: #797979;
  }
`;

const QuestionArea = styled.div`
  margin-top: 2.8rem;
`;

const InfoArea = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;

  .box {
    width: 50%;
    //height: 20.2rem;
    padding: 2.4rem;
    border-radius: 0.8rem;
    background: #fff;
    box-shadow: 0 0.4rem 0.4rem rgba(0, 0, 0, 0.1);

    .tit {
      display: flex;
      align-items: center;
      height: 3.2rem;
      margin-bottom: 1.6rem;
      padding-left: 4.8rem;
      font-size: 2rem;
      font-weight: bold;
      color: #2a2a2a;
      background: url('/images/llm/ico_info.webp') no-repeat left center;
      background-size: 3.2rem;
      justify-content: space-between;

      .download-button {
        display: flex;
        align-items: center;
        gap: 0.4rem;
        padding: 0.4rem 0.8rem;
        font-size: 1.4rem;
        color: #666;
        background: none;
        border: 1px solid #e0e0e0;
        border-radius: 0.4rem;
        cursor: pointer;

        &:hover {
          background: #f5f5f5;
        }
      }
    }

    .info_list {
      height: 14rem;
      margin-bottom: 1.6rem;
    }

    .txt_notice {
      margin-top: auto;
      font-size: 1.6rem;
      color: #909090;
    }

    &:first-of-type {
      dl {
        display: flex;
        align-items: center;
        height: 3.2rem;

        dt {
          width: 12.9rem;
          color: #909090;
          font-size: 1.4rem;
        }

        dd {
          font-size: 1.6rem;
          font-weight: bold;
          color: #2a2a2a;
        }
      }
    }

    &:last-of-type {
      .tit {
        background: url('/images/llm/ico_history.webp') no-repeat left center;
        background-size: 3.2rem;
      }
      .list_history {
        overflow: auto;
        max-height: 16rem;
        padding-right: 1.6rem;

        .history-item {
          display: flex;
          align-items: center;
          width: 100%;
          height: 3.2rem;
          padding: 0.8rem;
          background: none;
          border: none;
          text-align: left;
          cursor: pointer;
          transition: all 0.2s ease;
          border-radius: 0.4rem;

          &:hover {
            background-color: rgba(0, 0, 0, 0.02);
          }

          &.selected {
            background-color: #fff0b8;
          }

          .txt {
            font-size: 1.6rem;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            max-width: calc(100% - 8rem);
          }

          .txt_date {
            margin-left: auto;
            padding-right: 0.8rem;
            font-size: 1.4rem;
            color: #909090;
            flex-shrink: 0;
          }
        }

        &::-webkit-scrollbar {
          width: 0.6rem;
        }

        &::-webkit-scrollbar-track {
          background: transparent;
        }

        &::-webkit-scrollbar-thumb {
          background: #d9d9d9;
          border-radius: 0.3rem;

          &:hover {
            background: #555;
          }
        }
      }
    }
  }
`;

const MistakeInfo = styled.div`
  width: 46rem;
  margin: 3rem auto 0;
  padding: 1.6rem 0;
  text-align: center;
  font-size: 1.6rem;
  color: #909090;
  border-radius: 2.7rem;
  background: #f3f3f3;
`;

const AnswerArea = styled.div`
  padding-top: 2rem;
  margin-top: 2.8rem;
  border-top: 1px solid #e0e0e0;
`;

const UserQuestion = styled.div`
  margin-bottom: 3.2rem;

  line-height: 1.5;
  letter-spacing: -0.01em;
  color: #333;

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

  p {
    line-height: 1.5;
  }
`;

const DataAnalyzeResult = styled.div`
  margin-bottom: 3.2rem;

  .tit {
    display: flex;
    align-items: center;
    height: 3.2rem;
    margin-bottom: 2.4rem;
    font-size: 2rem;
    font-weight: bold;

    padding-left: 4.8rem;
    background: url('/images/llm/ico_data_analyze.webp') no-repeat left center;
    background-size: 3.2rem;
  }
`;

const Card = styled.div`
  font-size: 1.6rem;
  background: white;
  border-radius: 0.8rem;
  box-shadow: 0 0.2rem 0.4rem rgba(0, 0, 0, 0.1);
  padding: 2.4rem;
  margin-bottom: 2.4rem;
`;

const Title = styled.h2`
  font-weight: 500;
  margin-bottom: 1.6rem;
`;

const Text = styled.p<{ variant?: 'error' | 'secondary' }>`
  color: ${props =>
    props.variant === 'error'
      ? '#d32f2f'
      : props.variant === 'secondary'
      ? '#666'
      : 'inherit'};
  margin: 8px 0;
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  padding: 24px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #e0e0e0;
`;

const Th = styled.th<{ align?: 'left' | 'right' }>`
  padding: 12px;
  background-color: #f5f5f5;
  font-weight: 600;
  text-align: ${props => props.align || 'left'};
  border: 1px solid #e0e0e0;
`;

const Td = styled.td<{ align?: 'left' | 'right' }>`
  padding: 12px;
  text-align: ${props => props.align || 'left'};
  border: 1px solid #e0e0e0;
`;

const Tr = styled.tr<{ even?: boolean }>`
  background-color: ${props => (props.even ? 'rgba(0, 0, 0, 0.02)' : 'white')};
`;

const AnswerContainer = styled.div`
  line-height: 1.5;
  letter-spacing: -0.01em;
  color: #333;

  p {
    margin-bottom: 1rem;
    line-height: 1.5;
  }

  ul,
  ol {
    margin-left: 1.5rem;
    margin-bottom: 1rem;
  }

  li {
    margin-bottom: 0.5rem;
  }
`;

const loadingMessages = [
  '데이터를 꼼꼼히 분석하고 있어요 🔍',
  '데이터를 정리하는 중이에요 📊',
  '데이터에서 흥미로운 것을 발견했어요 📈',
  '인사이트를 도출하고 있어요 💡',
  '분석 결과를 정리하고 있어요 ✨',
  '글을 작성하고 있어요 📑',
];

const LoadingMessage = () => {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex(prev => (prev + 1) % loadingMessages.length);
    }, 3000); // 3초마다 메시지 변경

    return () => clearInterval(interval);
  }, []);

  return (
    <LoadingSpinner>
      <Spinner variant="pacman" color="#ffd34d" />
      <div style={{ width: '30rem', marginLeft: '5rem', marginBottom: '1rem' }}>
        {loadingMessages[messageIndex]}
      </div>
    </LoadingSpinner>
  );
};

const Home = observer(() => {
  const router = useRouter();
  const [isExitModalOpen, setIsExitModalOpen] = useState(false);
  const [isPDFModalOpen, setIsPDFModalOpen] = useState(false);

  useIsomorphicLayoutEffect(() => {
    document.body.classList.add('bg_gray');
    return () => {
      document.body.classList.remove('bg_gray');
    };
  }, []);

  // 고챗 종료하기 버튼 클릭 핸들러
  const handleExitClick = useCallback(() => {
    setIsExitModalOpen(true);
  }, []);

  // 모달 확인 버튼 클릭 핸들러
  const handleExitConfirm = useCallback(() => {
    router.push({
      pathname: '/menu-analyze-beta',
      query: { ...router.query },
    });
  }, []);

  // 모달 취소 버튼 클릭 핸들러
  const handleExitCancel = useCallback(() => {
    setIsExitModalOpen(false);
    // 뒤로가기 취소 시 현재 URL과 파라미터를 유지
    window.history.pushState(
      null,
      '',
      window.location.pathname + window.location.search
    );
  }, []);

  const [params, updateParams] = useQueryParams<any>({
    order_dt_start: dayjs().subtract(1, 'day').format('YYYY-MM-DD'),
    order_dt_finish: dayjs().subtract(1, 'day').format('YYYY-MM-DD'),
  });

  const [dateRange, setDateRange] = useState({
    start: '',
    end: '',
  });

  const [userQuestion, setUserQuestion] = useState<string | null>(null);
  const answerAreaRef = useRef<HTMLDivElement>(null);

  // 뒤로가기 처리
  useEffect(() => {
    // 컴포넌트 마운트 시 현재 URL과 파라미터를 유지하면서 history 엔트리 추가
    window.history.pushState(
      null,
      '',
      window.location.pathname + window.location.search
    );

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };

    const handlePopState = (e: PopStateEvent) => {
      // 현재 URL에서 chat_room_idx 저장
      const currentChatRoomIdx = params.chat_room_idx;

      if (currentChatRoomIdx) {
        // 뒤로가기 이벤트 취소
        e.preventDefault();

        // 모달 표시
        setIsExitModalOpen(true);

        // chat_room_idx를 포함한 현재 URL 유지
        const currentUrl = window.location.href;
        window.history.pushState(null, '', currentUrl);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [params.chat_room_idx]); // params.chat_room_idx를 의존성 배열에 추가

  useEffect(() => {
    if (params?.order_dt_start && params?.order_dt_finish) {
      setDateRange({
        start: params.order_dt_start,
        end: params.order_dt_finish,
      });
    }
  }, [params]);

  const {
    data: chatRoomData,
    isLoading,
    isError,
    error,
  } = useQuery(
    [
      'chatRoomData',
      params.order_dt_start,
      params.order_dt_finish,
      params.menu_master_idx,
      params.store_idx,
    ],
    async () => {
      const response = await createChatRoom({
        analysis_data_type: 'menu_sales_data',
        analysis_data_filter: {
          order_dt_start: params.order_dt_start,
          order_dt_finish: params.order_dt_finish,
          menu_master_idx: params.menu_master_idx,
          store_idx: params.store_idx,
        },
      });

      // router.push 대신 updateParams 사용
      updateParams({
        ...params,
        chat_room_idx: response.chat_room_idx,
      });

      return response;
    },
    {
      enabled:
        !!params.order_dt_start &&
        !!params.order_dt_finish &&
        !('chat_room_idx' in params),
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
    }
  );

  useEffect(() => {
    const initializeDB = async () => {
      if (chatRoomData?.analysis_data_list) {
        try {
          await initDB();
          await saveData({
            data: { result_list: chatRoomData.analysis_data_list },
          });
          console.log(
            'Data saved successfully:',
            chatRoomData.analysis_data_list.length
          );
        } catch (error) {
          console.error('Error initializing/saving data:', error);
        }
      }
    };

    initializeDB();
  }, [chatRoomData]);

  useEffect(() => {
    menuAnalyzeStore.setDates(
      params.order_dt_start,
      params.order_dt_finish as string
    );
  });

  useEffect(() => {
    if (queryStore.answerResult.length > 0 || queryStore.chartData) {
      setTimeout(() => {
        answerAreaRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }, 100);
    }
  }, [queryStore.answerResult, queryStore.chartData]);

  const { data: chatHistoryData, refetch: refetchHistory } = useQuery({
    queryKey: ['chatHistory', params.chat_room_idx],
    queryFn: () =>
      fetchChatHistoryList({ chat_room_idx: Number(params.chat_room_idx) }),
    select: data => data?.result_list || [],
    enabled: !!params.chat_room_idx,
  });

  console.log(
    'chatRoomIdx',
    params.chat_room_idx,
    'chatHistoryData',
    chatHistoryData
  );

  useEffect(() => {
    const fetchHistory = async () => {
      if (queryStore.isHistorySaved && params.chat_room_idx) {
        console.log('Fetching chat history...', params.chat_room_idx);
        try {
          await refetchHistory();
        } catch (error) {
          console.error('Failed to fetch history:', error);
        } finally {
          queryStore.setHistorySaved(false);
        }
      }
    };

    fetchHistory();
  }, [queryStore.isHistorySaved, params.chat_room_idx, refetchHistory]);

  const handleQuestionSubmit = async (question: string) => {
    setUserQuestion(question);
    setTimeout(() => {
      answerAreaRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }, 500);
  };

  const [selectedHistoryIdx, setSelectedHistoryIdx] = useState<number | null>(
    null
  );

  const handleHistoryClick = async (chatHistoryIdx: number) => {
    try {
      setSelectedHistoryIdx(chatHistoryIdx);
      const response = await fetchChatHistoryDetail(Number(chatHistoryIdx));

      if (response) {
        setUserQuestion(response.question_text);
        queryStore.setAnswer(response.answer_text);

        if (response.answer_metadata) {
          queryStore.setMetadata({
            columns: response.answer_metadata.columns,
            units: response.answer_metadata.units,
          });
        }

        if (response.answer_chart) {
          const chartType = response.answer_chart.type as 'bar' | 'donut';
          queryStore.setChartData({
            type: chartType,
            data: response.answer_chart.data,
            options: {
              height: '50rem',
              barSize: chartType === 'bar' ? 6 : undefined,
              tickCount: 11,
              angle: 30,
              margin: {
                top: 20,
                right: 30,
                bottom: 100,
                left: 60,
              },
              tooltipLabel: response.answer_chart.tooltipLabel
                ? decodeURIComponent(response.answer_chart.tooltipLabel)
                : '데이터 값',
            },
            title: response.answer_chart.title,
          });
        }

        if (response.answer_table) {
          queryStore.setAnswerResult(response.answer_table);
        }

        setTimeout(() => {
          window.scrollTo({
            top: document.documentElement.scrollHeight,
            behavior: 'smooth',
          });
        }, 100);
      }
    } catch (error) {
      console.error('대화 이력 조회 실패:', error);
    }
  };

  // 컴포넌트 언마운트 시 cleanup
  useEffect(() => {
    return () => {
      // 컴포넌트 언마운트 시 cleanup
      const cleanup = async () => {
        await queryStore.cleanup();
        voiceStore.cleanup();
      };
      cleanup();
    };
  }, []);

  useEffect(() => {
    // 앱 시작시 대화 히스토리 로드
    const initializeHistory = async () => {
      await queryStore.initializeHistory();
    };

    initializeHistory();
  }, []);

  if (isError) {
    return (
      <LLMContent>
        <Text variant="error">
          데이터를 불러오는 중 오류가 발생했습니다.
          {error instanceof Error ? `: ${error.message}` : ''}
        </Text>
      </LLMContent>
    );
  }

  return (
    <LLMContent>
      <Header>
        <div className="wrap">
          <div>
            <h1>
              <span className="hiddenZoneV">
                GOCHAT - GOPIZZA Opertion Chat-based Analytics Tool
              </span>
            </h1>

            <div className="txt_info">
              메뉴 판매 데이터를 분석할 수 있도록 도와드릴게요.
            </div>
          </div>

          <Button variant="gostSecondary" onClick={handleExitClick}>
            고챗 종료하기
          </Button>
        </div>
      </Header>
      <QuestionArea>
        <InfoArea>
          <div className="box">
            <h2 className="tit">조회 정보</h2>
            <div className="info_list">
              <dl>
                <dt>데이터 기간</dt>
                <dd>
                  {dateRange.start} ~ {dateRange.end}
                </dd>
              </dl>
              <dl>
                <dt>메뉴 구분</dt>
                <dd>{params.menu_master_text || '-'}</dd>
              </dl>
              <dl>
                <dt>매장 구분</dt>
                <dd>{params.store_text || '-'}</dd>
              </dl>
              <dl>
                <dt>총 데이터 수</dt>
                <dd>
                  {isLoading && (
                    <LoadingSpinner>
                      <BeatLoader color="#1976d2" />
                    </LoadingSpinner>
                  )}
                  {isError && (
                    <Text variant="error">
                      데이터를 불러오는데 실패했습니다
                    </Text>
                  )}
                  {chatRoomData?.analysis_data_count && (
                    <Text variant="secondary">
                      {chatRoomData.analysis_data_count.toLocaleString()}개
                    </Text>
                  )}
                </dd>
              </dl>
            </div>
            <p className="txt_notice">
              *새로운 데이터를 조회하고 싶다면, GOCHAT을 종료하고 다시 시도해
              주세요.
            </p>
          </div>
          <div className="box">
            <h2 className="tit">
              최근 질문
              {/* <button
                type="button"
                className="download-button"
                onClick={() => setIsPDFModalOpen(true)}
                disabled={!chatHistoryData?.length}
              >
                PDF 다운로드
              </button> */}
            </h2>
            <div className="info_list">
              <ul className="list_history">
                {chatHistoryData?.map(item => (
                  <button
                    key={item.chat_history_idx}
                    onClick={() => handleHistoryClick(item.chat_history_idx)}
                    className={`history-item ${
                      selectedHistoryIdx === item.chat_history_idx
                        ? 'selected'
                        : ''
                    }`}
                    type="button"
                  >
                    <span className="txt">{item.question_text}</span>
                    <span className="txt_date">
                      {new Date(item.created_at).toLocaleTimeString('ko-KR', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false,
                      })}
                    </span>
                  </button>
                ))}
                {!chatHistoryData?.length && (
                  <div style={{ padding: '1.6rem 0', color: '#909090' }}>
                    아직 질문 내역이 없습니다.
                  </div>
                )}
              </ul>
            </div>
            <p className="txt_notice">
              *현재 창을 닫으면 최근 히스토리 내역이 모두 사라지게 됩니다.
            </p>
          </div>
        </InfoArea>
      </QuestionArea>

      <QueryInput
        onSubmit={handleQuestionSubmit}
        chatRoomIdx={chatRoomData?.chat_room_idx}
      />
      <MistakeInfo>
        GOCHAT은 실수를 할 수 있습니다. 중요한 정보를 확인하세요.
      </MistakeInfo>
      <AnswerArea ref={answerAreaRef}>
        {userQuestion && (
          <UserQuestion>
            <div
              className="talk"
              style={{ lineHeight: '2', whiteSpace: 'pre-wrap' }}
            >
              {userQuestion}
            </div>
          </UserQuestion>
        )}

        {(queryStore.answer || queryStore.isAnswerStreaming) && (
          <DataAnalyzeResult>
            <div className="tit">
              {queryStore.isFunMode ? '답변' : '데이터 분석 결과'}
            </div>
            <Card>
              {queryStore.isAnswerStreaming && <LoadingMessage />}
              <div className="flex flex-col w-full gap-4">
                {queryStore.answer && (
                  <AnswerContainer>
                    <div
                      style={{
                        lineHeight: '2',
                        whiteSpace: 'pre-wrap',
                        marginBottom:
                          !queryStore.isFunMode &&
                          (queryStore.chartData ||
                            queryStore.answerResult.length > 0)
                            ? '1.5rem'
                            : '0',
                      }}
                    >
                      {queryStore.answer}
                    </div>
                  </AnswerContainer>
                )}
              </div>
            </Card>
          </DataAnalyzeResult>
        )}

        {!queryStore.isFunMode && queryStore.chartData && (
          <Card>
            <Title>차트 분석</Title>
            <div style={{ height: 'auto' }}>
              <RechartsWrapper
                type={queryStore.chartData.type}
                data={queryStore.chartData.data}
                options={queryStore.chartData.options}
                title={queryStore.chartData.title}
              />
            </div>
          </Card>
        )}

        {!queryStore.isFunMode && queryStore.answerResult.length > 0 && (
          <Card>
            <Title>데이터 테이블</Title>
            <Table>
              <thead>
                <tr>
                  {queryStore.metadata.columns?.map((_, index) => (
                    <Th
                      key={index}
                      align={
                        typeof queryStore.answerResult[0][index] === 'number'
                          ? 'right'
                          : 'left'
                      }
                    >
                      {queryStore.metadata.columns?.[index] &&
                        ` ${queryStore.metadata.columns[index]}`}
                    </Th>
                  )) ||
                    Object.keys(queryStore.answerResult[0]).map(key => (
                      <Th key={key}>{key}</Th>
                    ))}
                </tr>
              </thead>
              <tbody>
                {queryStore.answerResult.map((row, rowIndex) => (
                  <Tr key={rowIndex} even={rowIndex % 2 === 1}>
                    {Object.values(row).map((value: any, cellIndex) => (
                      <Td
                        key={cellIndex}
                        align={typeof value === 'number' ? 'right' : 'left'}
                      >
                        {typeof value === 'number'
                          ? value.toLocaleString()
                          : value}
                        {queryStore.metadata.units?.[cellIndex] &&
                          `${queryStore.metadata.units[cellIndex]}`}
                      </Td>
                    ))}
                  </Tr>
                ))}
              </tbody>
            </Table>
          </Card>
        )}
      </AnswerArea>

      <Modal
        isOpen={isExitModalOpen}
        onClose={handleExitCancel}
        onFormSubmit={handleExitConfirm}
        onCancel={handleExitCancel}
        title="고챗 종료"
      >
        <p>
          정말 나가시겠습니까?
          <br />
          지금 나가시면 현재까지의 대화 내역이 모두 사라지게 됩니다.
        </p>
      </Modal>
      <PDFDownloadModal
        isOpen={isPDFModalOpen}
        onClose={() => setIsPDFModalOpen(false)}
        historyList={chatHistoryData || []}
      />
    </LLMContent>
  );
});

export default Home;
