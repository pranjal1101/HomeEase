import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: apiKey.trim() });

async function checkModel() {
  try {
    console.log('Trying gemini-2.5-flash-lite...');
    const res = await ai.models.generateContent({
      model: 'gemini-2.5-flash-lite',
      contents: 'Hello'
    });
    console.log('SUCCESS! Output:', res.text);
  } catch (e) {
    console.log('FAILED:', e.message);
  }
}

checkModel().catch(console.error);
