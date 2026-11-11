const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export async function generateVocabularyQuestions() {
  let response;
  try {
    response = await fetch(API_BASE_URL + '/api/ai/generate-vocabulary', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ difficulty: 'easy' }),
    });
  } catch {
    throw new Error('Cannot reach the PrepMaster API. Make sure the backend is running on port 5000.');
  }
  const data = await response.json().catch(() => ({}));
  if (!response.ok || !data.success) throw new Error(data.message || 'Question generation failed (HTTP ' + response.status + ').');
  return data;
}