const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export async function generateAssessment(difficulty = 'medium') {
  let response;
  try {
    response = await fetch(API_BASE_URL + '/api/ai/generate-assessment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ difficulty }),
    });
  } catch {
    throw new Error('Cannot reach PrepMaster API. Check that the backend is running.');
  }
  const data = await response.json().catch(() => ({}));
  if (!response.ok || !data.success || !data.assessment) {
    throw new Error(data.message || 'Gemini assessment generation failed.');
  }
  return data.assessment;
}
