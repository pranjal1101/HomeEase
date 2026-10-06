import { GoogleGenAI } from '@google/genai';
import Service from '../models/service.model.js';

export const getRecommendation = async ({ category, service, preference }) => {
  const targetCategory = category || service || '';
  
  const query = {};
  if (targetCategory && targetCategory !== 'All') {
    query.category = { $regex: new RegExp(`^${targetCategory.trim()}$`, 'i') };
  }

  let candidates = await Service.find(query).lean();

  if (candidates.length === 0 && targetCategory && targetCategory !== 'All') {
    candidates = await Service.find({
      serviceName: { $regex: targetCategory, $options: 'i' }
    }).lean();
  }

  if (!candidates || candidates.length === 0) {
    return {
      success: false,
      message: `No suitable service providers are currently available${targetCategory ? ` for '${targetCategory}'` : ''}.`
    };
  }

  const userPref = preference && preference.trim() ? preference.trim() : 'Best overall match';

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === '') {
    const topCandidate = candidates[0];
    const alternativeCandidates = candidates.slice(1, 3);
    
    return {
      success: true,
      recommendation: {
        provider: topCandidate,
        reason: `Recommended based on availability and price (₹${topCandidate.price}) for ${topCandidate.category} services.`
      },
      alternatives: alternativeCandidates.map(c => ({
        provider: c,
        reason: `Available ${c.category} provider.`
      })),
      isFallback: true,
      notice: 'GEMINI_API_KEY is not configured in .env. Showing default candidate recommendation.'
    };
  }

  const ai = new GoogleGenAI({ apiKey: apiKey.trim() });

  const formattedCandidates = candidates.map(c => ({
    providerId: c._id.toString(),
    serviceName: c.serviceName,
    category: c.category,
    description: c.description,
    price: c.price,
    availability: c.availability
  }));

  const systemPrompt = `You are the provider recommendation system for HomeEase.
Choose the provider that best matches the user's requested preference.
You are given real providers retrieved from the HomeEase MongoDB database.

STRICT CONSTRAINTS:
1. You MUST choose exactly one provider from the supplied candidates.
2. You MUST NOT invent a provider or modify any provider information.
3. The recommendedProviderId MUST match the exact string providerId of one of the candidate providers.
4. Return ONLY structured JSON in the following format:
{
  "recommendedProviderId": "<exact candidate providerId>",
  "reason": "<1-2 sentence explanation based strictly on candidate data>",
  "alternatives": [
    {
      "providerId": "<exact candidate providerId>",
      "reason": "<1 sentence explanation>"
    }
  ]
}`;

  const userPrompt = `Service: "${targetCategory || 'All Services'}"
User preference: "${userPref}"

Candidates:
${JSON.stringify(formattedCandidates, null, 2)}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
        temperature: 0.2
      }
    });

    const responseText = response.text;
    let geminiParsed;
    try {
      geminiParsed = JSON.parse(responseText);
    } catch (parseErr) {
      console.error('Failed to parse Gemini response JSON:', parseErr);
      throw new Error('Invalid JSON structure from Gemini model.');
    }

    const recommendedId = geminiParsed.recommendedProviderId || geminiParsed.providerId;
    let recommendedCandidate = candidates.find(c => c._id.toString() === recommendedId);

    if (!recommendedCandidate) {
      console.warn(`Gemini recommended ID ${recommendedId} which was not found in database candidates. Falling back.`);
      recommendedCandidate = candidates[0];
    }

    const validAlternatives = [];
    if (Array.isArray(geminiParsed.alternatives)) {
      for (const alt of geminiParsed.alternatives) {
        if (alt.providerId && alt.providerId !== recommendedCandidate._id.toString()) {
          const match = candidates.find(c => c._id.toString() === alt.providerId);
          if (match && !validAlternatives.some(va => va.provider._id.toString() === match._id.toString())) {
            validAlternatives.push({
              provider: match,
              reason: alt.reason || `Great alternative for ${match.category}`
            });
          }
        }
      }
    }

    return {
      success: true,
      recommendation: {
        provider: recommendedCandidate,
        reason: geminiParsed.reason || `Best matched provider for ${userPref}.`
      },
      alternatives: validAlternatives
    };

  } catch (error) {
    console.error('Gemini Recommendation Error:', error.message);
    
    const fallbackProvider = candidates[0];
    const fallbackAlts = candidates.slice(1, 3);

    return {
      success: true,
      recommendation: {
        provider: fallbackProvider,
        reason: `Selected top available ${fallbackProvider.category} provider based on your search.`
      },
      alternatives: fallbackAlts.map(c => ({
        provider: c,
        reason: `Available ${c.category} option.`
      })),
      isFallback: true,
      errorNotice: `AI Service note: ${error.message}`
    };
  }
};
