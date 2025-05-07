import { protos, TextToSpeechClient } from '@google-cloud/text-to-speech';
import { NextApiRequest, NextApiResponse } from 'next';

let client: TextToSpeechClient;

try {
  // Google Cloud 클라이언트 초기화
  if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    throw new Error('GOOGLE_APPLICATION_CREDENTIALS is not set');
  }

  client = new TextToSpeechClient({
    credentials: process.env.GOOGLE_CLOUD_CREDENTIALS
      ? JSON.parse(process.env.GOOGLE_CLOUD_CREDENTIALS)
      : undefined,
  });
} catch (error) {
  console.error('Failed to initialize Google Cloud client:', error);
}

function preprocessText(text: string): string {
  return (
    text
      // 특수문자 제거
      // eslint-disable-next-line no-useless-escape
      .replace(/[~_<>\[\]{}()&'":-]/g, '')
      // 특수문자 변환
      .replace(/\//g, '또는')
      .replace(/@/g, '골뱅이')
      .replace(/#/g, '번호')
      .replace(/%/g, '퍼센트')
      .replace(/\$/g, '달러')
      // 이모티콘 제거 (유니코드 이모지 범위)
      .replace(/[\u{1F300}-\u{1F9FF}]/gu, '')
      // ㅎㅎ -> 흐흐
      .replace(/ㅎㅎ/g, '하하')
      // ㅋㅋ -> 크크
      .replace(/ㅋㅋ/g, '크크')
      // ㄷㄷ -> 덜덜
      .replace(/ㄷㄷ/g, '덜덜')
      // ... -> 쉼표로 변환
      .replace(/\.\.\./g, ',')
      // 연속된 마침표 제거
      .replace(/\.{2,}/g, '.')
  );
}

// eslint-disable-next-line consistent-return
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    if (!client) {
      throw new Error('Google Cloud client is not initialized');
    }

    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ message: 'Text is required' });
    }

    console.log('Sending request to Google Cloud TTS with text:', text);

    const request = {
      input: { text: preprocessText(text) },
      voice: {
        languageCode: 'ko-KR',
        // name: 'ko-KR-Neural2-B',
        name: 'ko-KR-Wavenet-B',
        // name: 'ko-KR-Standard-B',
      },
      audioConfig: {
        audioEncoding: protos.google.cloud.texttospeech.v1.AudioEncoding.MP3,
        speakingRate: 1.2, // 속도를 1.2배로 증가
        pitch: 0,
        // 시작과 끝에 약간의 무음 구간 추가
        enableTimePointLabels: true,
        // MP3 품질 향상
        effectsProfileId: ['headphone-class-device'],
        // 볼륨 살짝 낮춰서 찌그러짐 방지
        volumeGainDb: -1.0,
      },
    };

    // gRPC 스트리밍 요청
    const [response] = await client.synthesizeSpeech(request);

    if (!response.audioContent) {
      throw new Error('Failed to generate audio');
    }

    // 응답 헤더 설정
    res.setHeader('Content-Type', 'audio/mpeg');
    res.send(Buffer.from(response.audioContent));
  } catch (error: any) {
    console.error('TTS Error:', {
      message: error.message,
      stack: error.stack,
      credentials: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    });
    res.status(500).json({
      message: 'Error generating speech',
      error: error.message,
      credentialsPath: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    });
  }
}
