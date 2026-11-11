import { GoogleGenAI } from "@google/genai";

const assessmentSchema = {
  type: "OBJECT",
  properties: {
    vocabulary: { type: "ARRAY", items: { $ref: "#/$defs/mcq" } },
    reasoning: { type: "ARRAY", items: { $ref: "#/$defs/mcq" } },
    arithmetic: { type: "ARRAY", items: { $ref: "#/$defs/mcq" } },
    coding: {
      type: "OBJECT",
      properties: {
        title: { type: "STRING" },
        difficulty: { type: "STRING" },
        statement: { type: "STRING" },
        input: { type: "STRING" },
        output: { type: "STRING" },
        constraints: { type: "STRING" },
        starter: { type: "STRING" },
        explanation: { type: "STRING" }
      },
      required: ["title", "difficulty", "statement", "input", "output", "constraints", "starter", "explanation"]
    }
  },
  required: ["vocabulary", "reasoning", "arithmetic", "coding"],
  $defs: {
    mcq: {
      type: "OBJECT",
      properties: {
        prompt: { type: "STRING" },
        options: { type: "ARRAY", items: { type: "STRING" } },
        correctAnswerIndex: { type: "INTEGER" },
        explanation: { type: "STRING" },
        topic: { type: "STRING" }
      },
      required: ["prompt", "options", "correctAnswerIndex", "explanation", "topic"]
    }
  }
};

function validateMcqs(questions, section) {
  if (!Array.isArray(questions) || questions.length !== 10) {
    throw new Error("Gemini returned an invalid " + section + " question count");
  }
  for (const [index, q] of questions.entries()) {
    const optionsValid = Array.isArray(q.options) && q.options.length === 4 &&
      q.options.every(v => typeof v === "string" && v.trim()) &&
      new Set(q.options.map(v => v.trim().toLowerCase())).size === 4;
    if (typeof q.prompt !== "string" || !q.prompt.trim() || !optionsValid ||
        !Number.isInteger(q.correctAnswerIndex) || q.correctAnswerIndex < 0 ||
        q.correctAnswerIndex > 3 || typeof q.explanation !== "string" ||
        !q.explanation.trim() || typeof q.topic !== "string" || !q.topic.trim()) {
      throw new Error("Gemini returned an invalid " + section + " question at position " + (index + 1));
    }
  }
  return questions;
}

export async function generateAssessment(difficulty = "medium") {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    const error = new Error("GEMINI_API_KEY is not configured on the server");
    error.code = "GEMINI_KEY_MISSING";
    throw error;
  }
  const ai = new GoogleGenAI({ apiKey });
  const response = await ai.models.generateContent({
    model: process.env.GEMINI_MODEL || "gemini-3.8-flash",
    contents: `
You are an expert placement-test setter for Indian service-based IT companies such as TCS, Infosys, Accenture and IBM.
Create one fresh assessment at ${difficulty} difficulty.
Return exactly 10 original MCQs in EACH category:
1. vocabulary: synonyms, antonyms, idioms, grammar, sentence correction and contextual word usage.
2. reasoning: number/letter series, coding-decoding, directions, blood relations, syllogisms, arrangements and analytical logic.
3. arithmetic: percentages, profit/loss, averages, ratio, time/work, speed/distance, interest, probability and basic algebra.
Every MCQ must have four distinct options, exactly one defensible correct answer, a zero-based correctAnswerIndex, a short explanation and a topic label.
Also create exactly one original C++-friendly coding problem with a clear statement, input/output example, constraints, and compilable C++ starter code. Do not provide a trivial duplicate of Two Sum.
Avoid duplicate prompts, ambiguous wording, incorrect arithmetic, answer-option clues, and repeated examples. Check every answer before returning JSON.
`,
    config: {
      responseMimeType: "application/json",
      responseSchema: assessmentSchema,
      temperature: 0.9
    }
  });
  if (!response.text) throw new Error("Gemini returned an empty response");
  let result;
  try { result = JSON.parse(response.text); }
  catch { throw new Error("Gemini returned invalid JSON"); }
  validateMcqs(result?.vocabulary, "vocabulary");
  validateMcqs(result?.reasoning, "reasoning");
  validateMcqs(result?.arithmetic, "arithmetic");
  const c = result?.coding;
  if (!c || ["title","difficulty","statement","input","output","constraints","starter","explanation"].some(k => typeof c[k] !== "string" || !c[k].trim())) {
    throw new Error("Gemini returned an invalid coding problem");
  }
  return result;
}
