import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { observer } from 'mobx-react';
import styled from '@emotion/styled';
import { queryStore } from '@MobxFarm/QueryStore';
import { voiceStore } from '@MobxFarm/VoiceStore';
import { processQuery } from './llm';

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

const WELCOME_MESSAGES = [
  '데이터를 분석하고 있어요. 잠시만 기다려주세요.',
  '고피자의 데이터를 확인하고 있습니다. 곧 답변해드릴게요!',
  '분석 중입니다. 금방 답변드리겠습니다.',
  '데이터를 살펴보는 중이에요. 잠시만요!',
];

const Container = styled.div`
  display: flex;
  gap: 16px;
`;

const VoiceButton = styled.button<{ active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border: 1px solid ${props => (props.active ? '#1976d2' : '#e0e0e0')};
  border-radius: 4px;
  background-color: transparent;
  color: ${props => (props.active ? '#1976d2' : '#757575')};

  cursor: pointer;
  transition: all 0.2s;
  min-width: fit-content;

  &:hover {
    background-color: ${props =>
      props.active ? 'rgba(25, 118, 210, 0.04)' : 'rgba(0, 0, 0, 0.04)'};
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px
      ${props =>
        props.active ? 'rgba(25, 118, 210, 0.2)' : 'rgba(0, 0, 0, 0.1)'};
  }
`;

const VoiceInterface = observer(() => {
  const [isListening, setIsListening] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const [isPlayingWelcome, setIsPlayingWelcome] = useState(false);
  const welcomeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const questionStartTimeRef = useRef<number>(0);

  const playWelcomeMessage = async () => {
    if (!voiceStore.isVoiceOutput || isPlayingWelcome) return;

    setIsPlayingWelcome(true);
    const randomIndex = Math.floor(Math.random() * WELCOME_MESSAGES.length);

    try {
      const response = await axios.post('/api/llm/tts', {
        text: WELCOME_MESSAGES[randomIndex],
      });

      const audioBlob = new Blob([response.data], { type: 'audio/wav' });
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);

      audio.onended = () => {
        setIsPlayingWelcome(false);
        URL.revokeObjectURL(audioUrl);
      };

      await audio.play();
    } catch (error) {
      console.error('Failed to play welcome message:', error);
      setIsPlayingWelcome(false);
    }
  };

  const playTTS = async (text: string) => {
    if (!voiceStore.isVoiceOutput || !text || isPlaying) return;

    try {
      setIsPlaying(true);
      const response = await axios.post('/api/llm/tts', {
        text,
      });

      const audioBlob = new Blob([response.data], { type: 'audio/wav' });
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);

      audio.onended = () => {
        setIsPlaying(false);
        URL.revokeObjectURL(audioUrl);
      };

      await audio.play();
    } catch (error) {
      console.error('Error playing TTS:', error);
      setIsPlaying(false);
    }
  };

  const toggleListening = () => {
    if (!recognition) return;

    if (isListening) {
      recognition.stop();
    } else {
      recognition.start();
    }
  };

  const toggleVoiceOutput = () => {
    voiceStore.setVoiceOutput(!voiceStore.isVoiceOutput);
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.lang = 'ko-KR';
        recognition.interimResults = true;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
          setIsListening(true);
        };

        recognition.onresult = (event: any) => {
          let interimTranscript = '';

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const { transcript } = event.results[i][0];

            if (event.results[i].isFinal) {
              if (transcript.trim()) {
                questionStartTimeRef.current = Date.now();
                queryStore.setQuestion(transcript);
                processQuery(transcript);
              }
              break;
            } else {
              interimTranscript += transcript;
              if (interimTranscript.trim()) {
                queryStore.setQuestion(interimTranscript);
              }
            }
          }
        };

        recognition.onerror = (event: any) => {
          console.error('Speech recognition error', event.error);
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        setRecognition(recognition);
      }
    }
  }, []);

  useEffect(() => {
    if (queryStore.isAnswerStreaming) {
      setIsPlayingWelcome(false);
      if (welcomeTimeoutRef.current) {
        clearTimeout(welcomeTimeoutRef.current);
      }

      if (voiceStore.isVoiceOutput && !queryStore.isFunMode) {
        welcomeTimeoutRef.current = setTimeout(() => {
          playWelcomeMessage();
        }, 1500);
      }
    } else if (
      !queryStore.isAnswerStreaming &&
      queryStore.answer &&
      voiceStore.isVoiceOutput
    ) {
      if (queryStore.isFunMode || !isPlayingWelcome) {
        playTTS(queryStore.answer);
      }
    }

    return () => {
      if (welcomeTimeoutRef.current) {
        clearTimeout(welcomeTimeoutRef.current);
      }
    };
  }, [queryStore.isAnswerStreaming, queryStore.answer, queryStore.isFunMode]);

  return (
    <Container>
      <VoiceButton
        onClick={toggleVoiceOutput}
        active={voiceStore.isVoiceOutput}
      >
        {voiceStore.isVoiceOutput ? '음성 답변 켜짐' : '음성 답변 꺼짐'}
      </VoiceButton>

      {!voiceStore.isVoiceMode && (
        <VoiceButton onClick={toggleListening} active={isListening}>
          {isListening ? '음성 인식 중...' : '음성으로 질문하기'}
        </VoiceButton>
      )}
    </Container>
  );
});

export default VoiceInterface;
