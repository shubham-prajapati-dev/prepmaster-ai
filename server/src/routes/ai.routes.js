
import { Router } from "express";
import {
  generateVocabularyQuestions
} from "../services/aiService.js";

const router = Router();

router.post("/generate-vocabulary", async (req, res) => {
  try {
    const difficulty = req.body.difficulty || "easy";

    if (!["easy", "medium", "hard"].includes(difficulty)) {
      return res.status(400).json({
        success: false,
        message: "Invalid difficulty level"
      });
    }

    const questions =
      await generateVocabularyQuestions(difficulty);

    res.json({
      success: true,
      total: questions.length,
      difficulty,
      questions
    });

  } catch (error) {
  console.error("========== OPENAI ERROR ==========");
  console.error(error);
  console.error("==================================");

  res.status(500).json({
    success: false,
    message: error.message || "Question generation failed"
  });
}
});

export default router;
