import { useState, KeyboardEvent, useRef } from 'react';
import { observer } from 'mobx-react';
import styled from '@emotion/styled';
import { queryStore } from '@MobxFarm/QueryStore';
import { voiceStore } from '@MobxFarm/VoiceStore';
import { processQuery } from './llm';
import VoiceInterface from './VoiceInterface';

const FAQs = styled.div`
  width: 80%;
  margin: 4rem auto 0;
  h2 {
    font-size: 2rem;
    font-weight: bold;
  }
  .list_faq {
    display: flex;
    gap: 1.7rem;

    button {
      display: flex;
      align-items: center;
      justify-content: center;
      flex: 1;
      height: 9rem;
      margin-top: 1.6rem;
      padding: 1.6rem;
      color: #2a2a2a;
      font-size: 1.6rem;
      text-align: center;
      line-height: 1.5;
      border: 1px #f3f3f3 solid;
      border-radius: 8px;
      box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.1);
      background: white;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        background-color: #fff8e1;
        transform: translateY(-2px);
        box-shadow: 0px 6px 8px rgba(0, 0, 0, 0.1);
      }

      &:active {
        transform: translateY(0);
        background-color: #fff3cd;
      }
    }
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
`;

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  width: 80%;
  margin: 0 auto;
  gap: 0.8rem;
  margin-top: 5rem;
  padding: 0 2.5rem 0 0;
  border: 1px solid #fbd02c;
  border-radius: 0.5rem;
  background-color: #fff;

  .fake_placeholder {
    position: absolute;
    top: 50%;
    left: 3.2rem;
    transform: translateY(-50%);
    font-size: 1.8rem;
    color: #909090;
    pointer-events: none;
    user-select: none;

    &.hidden {
      display: none;
    }
  }
`;

const StyledTextarea = styled.textarea`
  width: 100%;
  height: 6rem;
  max-height: 12rem;
  padding: 1.6rem 3.2rem;
  border: none;
  border-radius: 4px;
  background-color: white;
  font-family: inherit;
  resize: none;
  font-size: 1.8rem;
  outline: none;
  &:disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
    color: #909090;
  }
  &:focus {
    outline: none;

    border: none;
  }
  &::placeholder {
    color: transparent;
  }
  &:focus::placeholder {
    color: transparent;
  }
`;

const SubmitButton = styled.button<{ disabled?: boolean }>`
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  background-color: ${props => (props.disabled ? '#e0e0e0' : '#FBD02C')};
  cursor: ${props => (props.disabled ? 'not-allowed' : 'pointer')};
  transition: background-color 0.2s;
  background-image: url('/images/llm/arrow.webp');
  background-size: 2rem;
  background-repeat: no-repeat;
  background-position: center;
  opacity: ${props => (props.disabled ? 0.7 : 1)};

  &.not_ready {
    background-color: #fbd02c;
  }
  &:hover {
    background-color: ${props => (props.disabled ? '#e0e0e0' : '#F8C500')};
  }
`;

interface QueryInputProps {
  onSubmit: (question: string) => void;
  chatRoomIdx?: number;
}

const QueryInput = observer(({ onSubmit, chatRoomIdx }: QueryInputProps) => {
  const [localQuestion, setLocalQuestion] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleQuestionSubmit = async () => {
    if (!localQuestion.trim()) return;

    const question = localQuestion;
    setLocalQuestion('');

    onSubmit(question);

    await processQuery(question, chatRoomIdx);
  };

  const handleKeyPress = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleQuestionSubmit();
    }
  };

  const handleContainerClick = (e: React.MouseEvent) => {
    if (textareaRef.current && !queryStore.isAnswerStreaming) {
      textareaRef.current.focus();
    }
  };

  const handleFaqClick = (question: string) => {
    if (!queryStore.isAnswerStreaming) {
      setLocalQuestion(question);
      onSubmit(question);
      processQuery(question, chatRoomIdx);
    }
  };

  return (
    <>
      <FAQs>
        <h2>자주 찾는 질문</h2>
        <div className="list_faq">
          <button
            type="button"
            onClick={() =>
              handleFaqClick(
                '가장 많이 판매된 메뉴는 무엇인가요? 판매량 순으로 보여주세요.'
              )
            }
          >
            가장 많이 판매된 메뉴는 무엇인가요?
            <br />
            판매량 순으로 보여주세요.
          </button>
          <button
            type="button"
            onClick={() =>
              handleFaqClick('현재 서울대점 메뉴 판매 추이가 어떻게 되나요?')
            }
          >
            현재 서울대점 메뉴 판매 추이가
            <br />
            어떻게 되나요?
          </button>
          <button
            type="button"
            onClick={() =>
              handleFaqClick('매장별로 잘 팔리는 메뉴 TOP 5를 알려주세요.')
            }
          >
            매장별로 잘 팔리는
            <br />
            메뉴 TOP 5를 알려주세요.
          </button>
        </div>
      </FAQs>

      <Container>
        <InputContainer onClick={handleContainerClick}>
          <span className={`fake_placeholder ${localQuestion ? 'hidden' : ''}`}>
            + GOCHAT에게 새로운 메세지 보내기
          </span>
          <StyledTextarea
            ref={textareaRef}
            value={localQuestion}
            onChange={e => setLocalQuestion(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={queryStore.isAnswerStreaming}
          />
          <SubmitButton
            onClick={handleQuestionSubmit}
            disabled={!localQuestion.trim() || queryStore.isAnswerStreaming}
          >
            <span className="hiddenZoneV">질문하기</span>
          </SubmitButton>
        </InputContainer>
        {voiceStore.isVoiceMode && <VoiceInterface />}
      </Container>
    </>
  );
});

export default QueryInput;
