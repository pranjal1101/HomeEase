import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: apiKey.trim() });

async function testDirectCall() {
  try {
    console.log('Testing gemini-2.5-flash...');
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: 'Say hello in one word.'
    });
    console.log('SUCCESS!');
    console.log('Response text:', response.text);
  } catch (err) {
    console.error('FAILED:', err.message);
  }
}

testDirectCall();
