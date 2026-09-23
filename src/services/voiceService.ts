import type { Language } from '../types';

export interface VoiceStatus {
  isSpeaking: boolean;
  isListening: boolean;
  statusText?: string;
  errorMessage?: string;
  voiceAvailable: boolean;
}

export type SpeechListenerCallback = (status: VoiceStatus) => void;
export type RecognitionResultCallback = (transcript: string, isFinal: boolean) => void;

class VoiceService {
  private listeners: Set<SpeechListenerCallback> = new Set();
  private isSpeakingState = false;
  private isListeningState = false;
  private currentLanguage: Language = 'en';
  private recognitionInstance: any = null;
  private cachedVoices: SpeechSynthesisVoice[] = [];
  private voicesLoaded = false;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.loadVoices();
      window.speechSynthesis.onvoiceschanged = () => {
        this.loadVoices();
      };
    }
  }

  private loadVoices() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.cachedVoices = window.speechSynthesis.getVoices();
      if (this.cachedVoices.length > 0) {
        this.voicesLoaded = true;
      }
    }
  }

  public subscribe(callback: SpeechListenerCallback): () => void {
    this.listeners.add(callback);
    callback(this.getStatus());
    return () => this.listeners.delete(callback);
  }

  private notify(errorMessage?: string, statusText?: string) {
    const status = this.getStatus(errorMessage, statusText);
    this.listeners.forEach((cb) => cb(status));
  }

  public getStatus(errorMessage?: string, statusText?: string): VoiceStatus {
    const voice = this.getBestVoice(this.currentLanguage);
    return {
      isSpeaking: this.isSpeakingState,
      isListening: this.isListeningState,
      voiceAvailable: !!voice,
      statusText,
      errorMessage,
    };
  }

  public areVoicesLoaded(): boolean {
    return this.voicesLoaded;
  }

  public isSpeechSupported(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  }

  public isRecognitionSupported(): boolean {
    if (typeof window === 'undefined') return false;
    return !!((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);
  }

  /**
   * Find matching voice by priority:
   * English: 1. en-IN, 2. any en
   * Hindi: 1. hi-IN, 2. any hi
   * Gujarati: 1. gu-IN, 2. any gu
   */
  public getBestVoice(language: Language): SpeechSynthesisVoice | null {
    if (!this.isSpeechSupported()) return null;
    if (this.cachedVoices.length === 0) {
      this.loadVoices();
    }

    const voices = this.cachedVoices;
    if (voices.length === 0) return null;

    if (language === 'gu') {
      // 1. Exact gu-IN
      const guIN = voices.find((v) => v.lang.toLowerCase() === 'gu-in' || v.lang.toLowerCase() === 'gu_in');
      if (guIN) return guIN;
      // 2. Any gu
      const anyGu = voices.find((v) => v.lang.toLowerCase().startsWith('gu') || v.name.toLowerCase().includes('gujarati'));
      if (anyGu) return anyGu;
      // 3. Fallback to Hindi voice for Devanagari/Indian phonetics if no Gujarati voice
      const hiIN = voices.find((v) => v.lang.toLowerCase() === 'hi-in' || v.lang.toLowerCase() === 'hi_in');
      return hiIN || null;
    }

    if (language === 'mr') {
      // 1. Exact mr-IN
      const mrIN = voices.find((v) => v.lang.toLowerCase() === 'mr-in' || v.lang.toLowerCase() === 'mr_in');
      if (mrIN) return mrIN;
      // 2. Any mr
      const anyMr = voices.find((v) => v.lang.toLowerCase().startsWith('mr') || v.name.toLowerCase().includes('marathi'));
      if (anyMr) return anyMr;
      // 3. Marathi uses Devanagari script; fall back to Hindi voice if Marathi voice missing
      const hiIN = voices.find((v) => v.lang.toLowerCase() === 'hi-in' || v.lang.toLowerCase() === 'hi_in');
      return hiIN || null;
    }

    if (language === 'hi') {
      // 1. Exact hi-IN
      const hiIN = voices.find((v) => v.lang.toLowerCase() === 'hi-in' || v.lang.toLowerCase() === 'hi_in');
      if (hiIN) return hiIN;
      // 2. Any hi
      const anyHi = voices.find((v) => v.lang.toLowerCase().startsWith('hi') || v.name.toLowerCase().includes('hindi'));
      if (anyHi) return anyHi;
      return null;
    }

    // Default: English
    const enIN = voices.find((v) => v.lang.toLowerCase() === 'en-in' || v.lang.toLowerCase() === 'en_in');
    if (enIN) return enIN;
    const anyEn = voices.find((v) => v.lang.toLowerCase().startsWith('en'));
    return anyEn || voices[0] || null;
  }

  /**
   * Play a clean, subtle audio chime for tactile non-visual feedback
   */
  public playTone(type: 'start' | 'success' | 'alert' = 'start') {
    if (typeof window === 'undefined') return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;
      if (type === 'start') {
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.12);
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.15);
      } else if (type === 'success') {
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.setValueAtTime(659.25, now + 0.08);
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
      } else {
        osc.frequency.setValueAtTime(280, now);
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
        osc.start(now);
        osc.stop(now + 0.18);
      }
    } catch (_) {}
  }

  /**
   * Speak sanitized text in the selected language
   */
  public speak(
    text: string,
    language: Language = 'en',
    onEnd?: () => void,
    onError?: (error: string) => void
  ): boolean {
    if (!this.isSpeechSupported()) {
      onError?.('speech_not_supported');
      return false;
    }

    this.stopSpeaking();
    this.currentLanguage = language;

    // Strip markdown formatting, symbols, and links before speaking
    const cleanText = text
      .replace(/[*#_`~[\]]/g, ' ')
      .replace(/\(.*?\)/g, ' ')
      .replace(/₹/g, 'Rupees ')
      .replace(/https?:\/\/\S+/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    if (!cleanText) return false;

    const voice = this.getBestVoice(language);
    const langTag =
      language === 'gu' ? 'gu-IN' : language === 'hi' ? 'hi-IN' : language === 'mr' ? 'mr-IN' : 'en-IN';

    const utterance = new SpeechSynthesisUtterance(cleanText);
    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang;
    } else {
      utterance.lang = langTag;
    }

    // Crisp, natural, fluent speech rate for fast and responsive conversational interaction
    utterance.rate = 1.24;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    utterance.onstart = () => {
      this.isSpeakingState = true;
      this.notify(undefined, 'speaking');
    };

    utterance.onend = () => {
      this.isSpeakingState = false;
      this.notify();
      onEnd?.();
    };

    utterance.onerror = (e) => {
      this.isSpeakingState = false;
      this.notify('speech_error');
      onError?.(e.error);
    };

    try {
      window.speechSynthesis.speak(utterance);
      return true;
    } catch (err: any) {
      this.isSpeakingState = false;
      onError?.(err?.message || 'speech_failed');
      return false;
    }
  }

  public stopSpeaking() {
    if (this.isSpeechSupported()) {
      window.speechSynthesis.cancel();
      this.isSpeakingState = false;
      this.notify();
    }
  }

  /**
   * Start speech-to-text recognition
   */
  public startListening(
    language: Language = 'en',
    onResult: RecognitionResultCallback,
    onError?: (errCode: string) => void,
    onEnd?: () => void
  ): boolean {
    if (!this.isRecognitionSupported()) {
      onError?.('recognition_not_supported');
      this.notify('recognition_not_supported');
      return false;
    }

    this.stopListening();
    this.stopSpeaking(); // don't listen while speaking

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    this.recognitionInstance = new SpeechRecognition();

    this.recognitionInstance.lang =
      language === 'gu'
        ? 'gu-IN'
        : language === 'hi'
        ? 'hi-IN'
        : language === 'mr'
        ? 'mr-IN'
        : 'en-IN';
    this.recognitionInstance.continuous = false;
    this.recognitionInstance.interimResults = true;
    this.recognitionInstance.maxAlternatives = 1;

    this.recognitionInstance.onstart = () => {
      this.isListeningState = true;
      this.playTone('start');
      this.notify(undefined, 'listening');
    };

    this.recognitionInstance.onresult = (event: any) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }

      const text = finalTranscript || interimTranscript;
      const isFinal = !!finalTranscript;
      if (text) {
        onResult(text, isFinal);
      }
    };

    this.recognitionInstance.onerror = (event: any) => {
      this.isListeningState = false;
      const err = event.error;
      if (err === 'not-allowed' || err === 'permission-denied') {
        this.notify('permission_denied');
        onError?.('permission_denied');
      } else if (err === 'no-speech') {
        this.notify('no_speech');
        onError?.('no_speech');
      } else {
        this.notify(err);
        onError?.(err);
      }
    };

    this.recognitionInstance.onend = () => {
      this.isListeningState = false;
      this.notify();
      onEnd?.();
    };

    try {
      this.recognitionInstance.start();
      return true;
    } catch (e) {
      this.isListeningState = false;
      onError?.('start_failed');
      return false;
    }
  }

  public stopListening() {
    if (this.recognitionInstance) {
      try {
        this.recognitionInstance.stop();
      } catch (_) {}
      this.recognitionInstance = null;
    }
    this.isListeningState = false;
    this.notify();
  }
}

export const voiceService = new VoiceService();
