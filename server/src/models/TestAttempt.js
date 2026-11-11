import mongoose from 'mongoose';

const answerSchema = new mongoose.Schema({
  questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
  selectedOption: String,
  code: String,
  isCorrect: Boolean,
  marksAwarded: { type: Number, default: 0 },
  testCasesPassed: Number,
  totalTestCases: Number,
  timeSpentSeconds: Number,
  status: { type: String, enum: ['answered', 'skipped', 'timed_out'], default: 'skipped' }
}, { _id: false });

const sectionResultSchema = new mongoose.Schema({
  section: { type: String, required: true },
  startedAt: Date,
  submittedAt: Date,
  score: { type: Number, default: 0 },
  maxMarks: Number,
  correct: { type: Number, default: 0 },
  incorrect: { type: Number, default: 0 },
  unanswered: { type: Number, default: 0 },
  answers: [answerSchema]
}, { _id: false });

const attemptSchema = new mongoose.Schema({
  testId: { type: mongoose.Schema.Types.ObjectId, ref: 'DailyTest', required: true, index: true },
  userId: { type: String, default: 'local-user', index: true },
  status: { type: String, enum: ['in_progress', 'submitted', 'evaluated', 'expired'], default: 'in_progress', index: true },
  startedAt: { type: Date, default: Date.now },
  submittedAt: Date,
  sections: [sectionResultSchema],
  totalScore: { type: Number, default: 0 },
  maxMarks: { type: Number, default: 50 },
  accuracy: { type: Number, default: 0 },
  difficultySnapshot: { type: String, enum: ['easy', 'medium', 'hard'], default: 'easy' }
}, { timestamps: true });

export default mongoose.model('TestAttempt', attemptSchema);
