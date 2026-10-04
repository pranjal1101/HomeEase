import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: apiKey.trim() });

async function testGemini25() {
  try {
    console.log('Testing model: gemini-2.5-flash...');
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: 'Say hello in one word.'
    });
    console.log(`SUCCESS with gemini-2.5-flash: ${response.text.trim()}\n`);
  } catch (err) {
    console.error('FAILED:', err.message);
  }
}

testGemini25();
