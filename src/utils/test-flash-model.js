import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: apiKey.trim() });

async function testModel() {
  try {
    console.log('Testing gemini-2.5-flash-lite...');
    const res = await ai.models.generateContent({
      model: 'gemini-2.5-flash-lite',
      contents: 'Hello Gemini!'
    });
    console.log('SUCCESS! Output:', res.text);
  } catch (e) {
    console.error('FAILED:', e.message);
  }
}

testModel();
