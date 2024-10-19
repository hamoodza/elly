import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
  console.error('Gemini API key is missing. Please check your .env file.');
}

const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-pro",
});

const generationConfig = {
  temperature: 0.9,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 2048,
};

export interface ChatMessage {
  role: 'user' | 'ai';
  content: string;
}

let chatSession: any;

export async function chatWithGemini(input: string): Promise<string> {
  if (!apiKey) {
    throw new Error('Gemini API anahtarı eksik. Lütfen .env dosyanızı kontrol edin.');
  }

  try {
    if (!chatSession) {
      chatSession = model.startChat({
        generationConfig,
        history: [],
      });
    }

    const result = await chatSession.sendMessage(input);
    const response = result.response;
    return response.text();
  } catch (error: any) {
    console.error('Error in chatWithGemini:', error);
    if (error.message.includes('API key not valid')) {
      throw new Error('Geçersiz API anahtarı. Lütfen API anahtarınızı kontrol edin.');
    } else if (error.message.includes('PERMISSION_DENIED')) {
      throw new Error('API erişim izni reddedildi. Lütfen API anahtarınızın doğru ve etkin olduğundan emin olun.');
    } else {
      throw new Error('Elly ile iletişim kurarken bir hata oluştu: ' + error.message);
    }
  }
}