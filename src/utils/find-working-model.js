import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: apiKey.trim() });

const modelsToTry = [
  'gemini-2.5-flash',
  'gemini-2.5-flash-lite',
  'gemini-2.5-flash',
  'gemini-2.5-pro'
];

async function findModel() {
  for (const m of modelsToTry) {
    try {
      console.log(`Trying model: "${m}"...`);
      const res = await ai.models.generateContent({
        model: m,
        contents: 'Hi'
      });
      console.log(`\n🎉 WORKING MODEL FOUND: "${m}"! Output: ${res.text.trim()}\n`);
      return m;
    } catch (err) {
      console.log(`  x ${m} failed: ${err.message}`);
    }
  }
}

findModel().then(() => process.exit(0)).catch(() => process.exit(1));
