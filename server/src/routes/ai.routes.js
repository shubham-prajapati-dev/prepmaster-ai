import { Router } from "express";
import { generateVocabularyQuestions } from "../services/aiService.js";

const router = Router();

router.post("/generate-vocabulary", async (req, res) => {
  const difficulty = req.body?.difficulty ?? "easy";

  if (!["easy", "medium", "hard"].includes(difficulty)) {
    return res.status(400).json({
      success: false,
      message: "Difficulty must be easy, medium, or hard.",
    });
  }

  try {
    const questions = await generateVocabularyQuestions(difficulty);

    return res.json({
      success: true,
      total: questions.length,
      difficulty,
      questions,
    });
  } catch (error) {
    // Keep provider details in the server logs, never in the public response.
    console.error("Gemini question generation failed:", {
      message: error?.message,
      status: error?.status,
      code: error?.code,
    });

    const isConfigurationError = error?.code === "GEMINI_KEY_MISSING";
    return res.status(isConfigurationError ? 503 : 502).json({
      success: false,
      message: isConfigurationError
        ? "AI question generation is not configured."
        : "Question generation is temporarily unavailable. Check the server logs.",
    });
  }
});

export default router;
