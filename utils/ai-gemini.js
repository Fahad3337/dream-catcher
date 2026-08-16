import { GoogleGenerativeAI } from '@google/generative-ai';

export async function getDreamInterpretation(dreamText) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error('Server misconfigured: GEMINI_API_KEY is missing');
  }

  // Initialize client dynamically when the function runs
  const gemini = new GoogleGenerativeAI(apiKey);
  const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

  try {
    const generativeModel = gemini.getGenerativeModel({
      model: model,
      systemInstruction: 'You are a thoughtful dream interpreter. Be insightful but gentle, and consider common dream symbolism. Keep your interpretation to 2-3 paragraphs.'
    });

    const result = await generativeModel.generateContent(
      `Dream: ${dreamText}`,
      { requestOptions: { signal: AbortSignal.timeout(5000) } }
    );

    const response = result.response;
    return response.text().trim();
  } catch (error) {
    console.error('Gemini API error:', error);
    throw error;
  }
}