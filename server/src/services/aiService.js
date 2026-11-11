import { GoogleGenAI } from "@google/genai";

const questionSchema = {
  type: "OBJECT",
  properties: {
    questions: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          prompt: { type: "STRING" },
          options: {
            type: "ARRAY",
            items: { type: "STRING" },
          },
          correctAnswerIndex: { type: "INTEGER" },
          explanation: { type: "STRING" },
          topic: { type: "STRING" },
        },
        required: [
          "prompt",
          "options",
          "correctAnswerIndex",
          "explanation",
          "topic",
        ],
      },
    },
  },
  required: ["questions"],
};

function validateQuestions(questions) {
  if (!Array.isArray(questions) || questions.length !== 10) {
    throw new Error("Gemini returned an unexpected question count");
  }

  for (const [index, question] of questions.entries()) {
    const validOptions =
      Array.isArray(question.options) &&
      question.options.length === 4 &&
      question.options.every(
        (option) => typeof option === "string" && option.trim().length > 0
      ) &&
      new Set(question.options.map((option) => option.trim().toLowerCase())).size === 4;

    if (
      typeof question.prompt !== "string" ||
      !question.prompt.trim() ||
      !validOptions ||
      !Number.isInteger(question.correctAnswerIndex) ||
      question.correctAnswerIndex < 0 ||
      question.correctAnswerIndex > 3 ||
      typeof question.explanation !== "string" ||
      !question.explanation.trim() ||
      typeof question.topic !== "string" ||
      !question.topic.trim()
    ) {
      throw new Error(`Gemini returned an invalid question at position ${index + 1}`);
    }
  }

  return questions;
}

export async function generateVocabularyQuestions(difficulty = "easy") {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    const error = new Error("GEMINI_API_KEY is not configured on the server");
    error.code = "GEMINI_KEY_MISSING";
    throw error;
  }

  // Create the client lazily so environment configuration is checked first.
  const ai = new GoogleGenAI({ apiKey });

  const response = await ai.models.generateContent({
    model: process.env.GEMINI_MODEL || "gemini-3.8-flash",
    contents: `
      You are an expert placement examination question setter.

      Generate exactly 10 original English vocabulary multiple-choice questions.
      Difficulty: ${difficulty}

      Include a balanced mixture of synonyms, antonyms, idioms, fill-in-the-blanks,
      correct word usage, and grammar/error identification.

      Every question must have exactly four distinct options and one best answer.
      correctAnswerIndex is zero-based and must be an integer from 0 to 3.
      Provide a concise, factually correct explanation and a specific topic label.
      Avoid ambiguous questions, trick wording, duplicate questions, and duplicate options.
    `,
    config: {
      responseMimeType: "application/json",
      responseSchema: questionSchema,
      temperature: 0.7,
    },
  });

  if (!response.text) {
    throw new Error("Gemini returned an empty response");
  }

  let result;
  try {
    result = JSON.parse(response.text);
  } catch {
    throw new Error("Gemini returned invalid JSON");
  }

  return validateQuestions(result?.questions);
}
