import { Router } from "express";
import { generateAssessment } from "../services/aiService.js";

const router = Router();

router.post("/generate-assessment", async (req, res) => {
  const difficulty = req.body?.difficulty ?? "medium";
  if (!["easy", "medium", "hard"].includes(difficulty)) {
    return res.status(400).json({ success: false, message: "Difficulty must be easy, medium, or hard." });
  }
  try {
    const assessment = await generateAssessment(difficulty);
    return res.json({ success: true, difficulty, assessment });
  } catch (error) {
    console.error("Gemini assessment generation failed:", {
      message: error?.message, status: error?.status, code: error?.code
    });
    const missingKey = error?.code === "GEMINI_KEY_MISSING";
    return res.status(missingKey ? 503 : 502).json({
      success: false,
      message: missingKey ? "AI question generation is not configured on the server." : "Gemini could not prepare this assessment. Please try again."
    });
  }
});

export default router;
