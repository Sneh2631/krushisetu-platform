/**
 * KrushiSetu Gemini AI Service
 * Connects Google Gemini API (gemini-1.5-flash / gemini-2.0-flash) for smart agricultural Q&A
 */

import type { Language } from '../types';

export interface GeminiResponse {
  text: string;
  isAiGenerated: boolean;
  error?: string;
}

const STORAGE_KEY = 'krishisetu_gemini_api_key';

export function getGeminiApiKey(): string {
  // Check localStorage first (user-entered in UI), then environment variable
  const savedKey = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
  if (savedKey && savedKey.trim()) {
    return savedKey.trim();
  }
  return import.meta.env.VITE_GEMINI_API_KEY || '';
}

export function saveGeminiApiKey(key: string): void {
  if (typeof window !== 'undefined') {
    if (key.trim()) {
      localStorage.setItem(STORAGE_KEY, key.trim());
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }
}

export function hasGeminiApiKey(): boolean {
  return !!getGeminiApiKey();
}

/**
 * System prompt to give Gemini agricultural knowledge and Maharashtra context
 */
function getSystemInstruction(language: Language): string {
  const langLabel =
    language === 'mr'
      ? 'Marathi (मराठी)'
      : language === 'hi'
      ? 'Hindi (हिन्दी)'
      : language === 'gu'
      ? 'Gujarati (ગુજરાતી)'
      : 'English';

  return `You are "कृषीसेतू मित्र" (KrushiSetu AI Assistant), an expert agricultural and APMC mandi marketplace advisor for Maharashtra farmers, agro-processors, and buyers.
Current Language: ${langLabel}.
Always reply concisely, respectfully, and clearly in the requested language (${language}).

Key Capabilities:
1. Provide accurate crop agronomy advice (planting, irrigation, fertilizers, IPM pest/disease management for Soybean, Cotton, Sugarcane, Onion, Grapes, Pomegranate, Tur, Turmeric, Jowar, Wheat).
2. Explain market prices & APMC trends (Lasalgaon, Pune, Nashik, Nagpur, Kolhapur, Latur, Solapur mandis, and MSP).
3. Guide users on KrushiSetu platform features (Direct farmer-to-buyer agreements, lot creation, verified buyer requirements, escrow security, logistics).
4. Provide advice on government schemes (Namo Shetkari Mahasanman Nidhi, MahaDBT Shetkari Portal, MSAMB warehouse & cold-chain subsidies, PM-Kisan).

Formatting:
- Keep answers practical, actionable, short (2-4 concise paragraphs or bullet points).
- Friendly and respectful tone tailored for Indian farmers.`;
}

/**
 * Ask Google Gemini AI a question
 */
export async function askGeminiAi(
  userQuery: string,
  language: Language = 'mr',
  history: Array<{ sender: 'user' | 'bot'; text: string }> = []
): Promise<GeminiResponse> {
  const apiKey = getGeminiApiKey();

  if (!apiKey) {
    return {
      text: '',
      isAiGenerated: false,
      error: 'NO_API_KEY',
    };
  }

  try {
    // Format conversation history for Gemini API
    const contents: Array<{ role: string; parts: Array<{ text: string }> }> = [];

    // Include recent 4 messages context
    const recentHistory = history.slice(-4);
    for (const msg of recentHistory) {
      contents.push({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }],
      });
    }

    // Add current query
    contents.push({
      role: 'user',
      parts: [{ text: userQuery }],
    });

    // We can use gemini-1.5-flash or gemini-2.0-flash
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents,
        systemInstruction: {
          parts: [{ text: getSystemInstruction(language) }],
        },
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 600,
          topP: 0.9,
        },
      }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      console.warn('Gemini API Error:', errData);
      return {
        text: '',
        isAiGenerated: false,
        error: errData?.error?.message || `API Error: ${response.status}`,
      };
    }

    const data = await response.json();
    const candidateText =
      data?.candidates?.[0]?.content?.parts?.[0]?.text || '';

    if (!candidateText) {
      return {
        text: '',
        isAiGenerated: false,
        error: 'Empty response from Gemini',
      };
    }

    return {
      text: candidateText.trim(),
      isAiGenerated: true,
    };
  } catch (err: unknown) {
    console.error('Gemini AI Fetch error:', err);
    return {
      text: '',
      isAiGenerated: false,
      error: (err as Error).message || 'Network error',
    };
  }
}
