/**
 * Enhanced Voice Agent Service for KrishiSetu
 * Provides conversational AI with voice input/output
 */

import type { Language } from '../types';
import { askGeminiAi } from './geminiService';
import { voiceService } from './voiceService';

export interface VoiceAgentConfig {
  autoListen: boolean;
  autoSpeak: boolean;
  silenceTimeout: number; // ms
  language: Language;
}

export interface ConversationTurn {
  id: string;
  speaker: 'user' | 'agent';
  text: string;
  timestamp: number;
  isFinal?: boolean;
}

export class VoiceAgentService {
  private config: VoiceAgentConfig;
  private conversationHistory: ConversationTurn[] = [];
  private isProcessing = false;
  private silenceTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(config: Partial<VoiceAgentConfig> = {}) {
    this.config = {
      autoListen: true,
      autoSpeak: true,
      silenceTimeout: 2500,
      language: 'en',
      ...config,
    };
  }

  updateConfig(config: Partial<VoiceAgentConfig>) {
    this.config = { ...this.config, ...config };
  }

  getConfig(): VoiceAgentConfig {
    return { ...this.config };
  }

  getHistory(): ConversationTurn[] {
    return [...this.conversationHistory];
  }

  addTurn(turn: ConversationTurn) {
    this.conversationHistory.push(turn);
  }

  clearHistory() {
    this.conversationHistory = [];
  }

  setProcessing(processing: boolean) {
    this.isProcessing = processing;
  }

  isCurrentlyProcessing(): boolean {
    return this.isProcessing;
  }

  /**
   * Process user input and get AI response
   */
  async processUserInput(
    text: string,
    onAgentResponse: (response: string) => void,
    onError?: (error: string) => void
  ): Promise<void> {
    if (!text.trim() || this.isProcessing) return;

    try {
      this.setProcessing(true);

      // Add user message to history
      const userTurn: ConversationTurn = {
        id: `user-${Date.now()}`,
        speaker: 'user',
        text: text.trim(),
        timestamp: Date.now(),
        isFinal: true,
      };
      this.addTurn(userTurn);

      // Get AI response using Gemini
      const historyForAi = this.conversationHistory
        .slice(-6) // Last 6 messages for context
        .map((turn) => ({
          sender: turn.speaker === 'user' ? 'user' as const : 'bot' as const,
          text: turn.text,
        }));

      const aiResponse = await askGeminiAi(text.trim(), this.config.language, historyForAi);

      if (aiResponse.isAiGenerated && aiResponse.text) {
        const agentTurn: ConversationTurn = {
          id: `agent-${Date.now()}`,
          speaker: 'agent',
          text: aiResponse.text,
          timestamp: Date.now(),
          isFinal: true,
        };
        this.addTurn(agentTurn);
        onAgentResponse(aiResponse.text);

        // Auto-speak if enabled
        if (this.config.autoSpeak) {
          this.speak(aiResponse.text);
        }
      } else {
        // Fallback response
        const fallbackText = this.getFallbackResponse();
        const agentTurn: ConversationTurn = {
          id: `agent-${Date.now()}`,
          speaker: 'agent',
          text: fallbackText,
          timestamp: Date.now(),
          isFinal: true,
        };
        this.addTurn(agentTurn);
        onAgentResponse(fallbackText);

        if (this.config.autoSpeak) {
          this.speak(fallbackText);
        }
      }
    } catch (error) {
      console.error('Voice Agent processing error:', error);
      const errorText = this.getErrorResponse();
      onError?.(errorText);

      if (this.config.autoSpeak) {
        this.speak(errorText);
      }
    } finally {
      this.setProcessing(false);
    }
  }

  /**
   * Start listening for user input
   */
  startListening(
    onInterimTranscript: (text: string) => void,
    onFinalTranscript: (text: string) => void,
    onError?: (error: string) => void
  ): boolean {
    voiceService.playTone('start');

    const started = voiceService.startListening(
      this.config.language,
      (transcript, isFinal) => {
        // Reset silence timer
        if (this.silenceTimer) {
          clearTimeout(this.silenceTimer);
          this.silenceTimer = null;
        }

        if (isFinal && transcript.trim()) {
          onFinalTranscript(transcript.trim());
        } else if (transcript.trim()) {
          onInterimTranscript(transcript);

          // Set silence timeout
          this.silenceTimer = setTimeout(() => {
            if (transcript.trim()) {
              voiceService.stopListening();
              onFinalTranscript(transcript.trim());
            }
          }, this.config.silenceTimeout);
        }
      },
      (errCode) => {
        if (this.silenceTimer) {
          clearTimeout(this.silenceTimer);
          this.silenceTimer = null;
        }
        onError?.(this.getListeningError(errCode));
      },
      () => {
        if (this.silenceTimer) {
          clearTimeout(this.silenceTimer);
          this.silenceTimer = null;
        }
      }
    );

    return started;
  }

  stopListening() {
    if (this.silenceTimer) {
      clearTimeout(this.silenceTimer);
      this.silenceTimer = null;
    }
    voiceService.stopListening();
  }

  speak(text: string, onEnd?: () => void, onError?: (error: string) => void) {
    voiceService.speak(text, this.config.language, onEnd, onError);
  }

  stopSpeaking() {
    voiceService.stopSpeaking();
  }

  /**
   * Get welcome message in current language
   */
  getWelcomeMessage(): string {
    const lang = this.config.language;
    switch (lang) {
      case 'hi':
        return 'नमस्ते! मैं कृषि सेतु वॉयस असिस्टेंट हूं। मैं फसल की कीमतों, बाजार की जानकारी, खेती की सलाह और प्लेटफॉर्म सुविधाओं में आपकी मदद कर सकता हूं। माइक बटन दबाकर बोलें।';
      case 'gu':
        return 'નમસ્તે! હું કૃષિ સેતુ વૉઇસ આસિસ્ટન્ટ છું. હું પાકના ભાવ, બજારની માહિતી, ખેતીની સલાહ અને પ્લેટફોર્મની સુવિધાઓમાં તમને મદદ કરી શકું છું. માઇક બટન દબાવીને બોલો.';
      case 'mr':
        return 'नमस्कार! मी कृषी सेतू व्हॉईस असिस्टंट आहे. मी पिकाच्या किमती, बाजार माहिती, शेती सल्ला आणि प्लॅटफॉर्म सुविधांमध्ये तुमची मदत करू शकतो. माइक बटण दाबून बोला.';
      default:
        return 'Hello! I am KrishiSetu Voice Assistant. I can help you with crop prices, market information, farming advice, and platform features. Press the microphone button to speak.';
    }
  }

  private getFallbackResponse(): string {
    const lang = this.config.language;
    switch (lang) {
      case 'hi':
        return 'मुझे खेद है, मैं अभी आपकी मदद नहीं कर सका। कृपया फिर से प्रयास करें या अधिक विस्तार से पूछें।';
      case 'gu':
        return 'માફ કરશો, હું હમણાં તમારી મદદ કરી શક્યો નહીં. કૃપા કરીને ફરીથી પ્રયાસ કરો અથવા વધુ વિગતથી પૂછો.';
      case 'mr':
        return 'माफ करा, मी आत्ता तुमची मदत करू शकलो नाही. कृपया पुन्हा प्रयत्न करा किंवा अधिक तपशीलवार विचारा.';
      default:
        return 'I apologize, I could not help you right now. Please try again or ask with more details.';
    }
  }

  private getErrorResponse(): string {
    const lang = this.config.language;
    switch (lang) {
      case 'hi':
        return 'कुछ गलत हो गया। कृपया बाद में पुनः प्रयास करें।';
      case 'gu':
        return 'કંઈક ખોટું થયું. કૃપા કરીને પછીથી ફરી પ્રયાસ કરો.';
      case 'mr':
        return 'काहीतरी चूक झाली. कृपया नंतर पुन्हा प्रयत्न करा.';
      default:
        return 'Something went wrong. Please try again later.';
    }
  }

  private getListeningError(errCode: string): string {
    const lang = this.config.language;

    if (errCode === 'permission_denied' || errCode === 'not-allowed') {
      switch (lang) {
        case 'hi': return 'माइक्रोफ़ोन की अनुमति आवश्यक है';
        case 'gu': return 'માઇક્રોફોનની પરવાનગી જરૂરી છે';
        case 'mr': return 'मायक्रोफोनची परवानगी आवश्यक आहे';
        default: return 'Microphone permission is required';
      }
    }

    if (errCode === 'no-speech') {
      switch (lang) {
        case 'hi': return 'कोई आवाज़ नहीं सुनाई दी';
        case 'gu': return 'કોઈ અવાજ સંભળાયો નહીં';
        case 'mr': return 'कोणताही आवाज ऐकू आला नाही';
        default: return 'No speech detected';
      }
    }

    return errCode;
  }
}

// Singleton instance
export const voiceAgentService = new VoiceAgentService();
