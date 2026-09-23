import { voiceService } from '../services/voiceService';
import type { Language } from '../types';

export const chatbotVoice = {
  speak: (text: string, language: Language, onEnd?: () => void, onError?: (err: string) => void) => {
    return voiceService.speak(text, language, onEnd, onError);
  },
  stopSpeaking: () => {
    voiceService.stopSpeaking();
  },
  startListening: (
    language: Language,
    onResult: (transcript: string, isFinal: boolean) => void,
    onError?: (err: string) => void,
    onEnd?: () => void
  ) => {
    return voiceService.startListening(language, onResult, onError, onEnd);
  },
  stopListening: () => {
    voiceService.stopListening();
  },
  isSpeechSupported: () => voiceService.isSpeechSupported(),
  isRecognitionSupported: () => voiceService.isRecognitionSupported(),
  getBestVoice: (language: Language) => voiceService.getBestVoice(language),
};
