import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the API instance
const gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function getDreamInterpretation(dreamText) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('Server misconfigured: GEMINI_API_KEY is missing');
  }

  const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

  try {
    const generativeModel = gemini.getGenerativeModel({
      model: model,
      systemInstruction: 'You are a thoughtful dream interpreter. Be insightful but gentle, and consider common dream symbolism. Keep your interpretation to 2-3 paragraphs.'
    });

    // Enforce a strict 5-second timeout signal to stop automatic retries on invalid keys
    const result = await generativeModel.generateContent(
      `Dream: ${dreamText}`,
      { requestOptions: { signal: AbortSignal.timeout(5000) } }
    );

    const response = result.response;
    return response.text().trim();
  } catch (error) {
    console.error('Gemini API error:', error);
    // Preserves the error context for Express router catch block
    throw error;
  }
}