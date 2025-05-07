import { makeAutoObservable } from 'mobx';

export class VoiceStore {
  isVoiceMode: boolean = false;

  isListening: boolean = false;

  isVoiceOutput: boolean = false;

  voiceOutputEnabledTimestamp: number = 0;

  constructor() {
    makeAutoObservable(this);
  }

  setVoiceMode(mode: boolean) {
    this.isVoiceMode = mode;
    if (mode) {
      this.isVoiceOutput = true; // 음성 모드를 켤 때 음성 출력도 자동으로 켜기
      this.voiceOutputEnabledTimestamp = Date.now();
    }
  }

  setIsListening(isListening: boolean) {
    this.isListening = isListening;
  }

  setVoiceOutput(enabled: boolean) {
    this.isVoiceOutput = enabled;
    if (enabled) {
      this.voiceOutputEnabledTimestamp = Date.now();
    }
  }

  cleanup = () => {
    this.isVoiceMode = false;
    this.isListening = false;
    this.isVoiceOutput = false;
    this.voiceOutputEnabledTimestamp = 0;
  };
}

export const voiceStore = new VoiceStore();
