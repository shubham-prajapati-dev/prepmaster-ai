import mongoose from 'mongoose';

const sectionSchema = new mongoose.Schema({
  key: { type: String, enum: ['vocabulary', 'reasoning', 'arithmetic_logical', 'coding'], required: true },
  questionIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
  durationSeconds: { type: Number, required: true },
  maxMarks: { type: Number, required: true }
}, { _id: false });

const dailyTestSchema = new mongoose.Schema({
  testDate: { type: String, required: true, unique: true, index: true }, // YYYY-MM-DD in configured user timezone
  title: { type: String, default: 'Daily placement assessment' },
  sections: { type: [sectionSchema], required: true },
  totalQuestions: { type: Number, default: 31 },
  maxMarks: { type: Number, default: 50 },
  generationStatus: { type: String, enum: ['generating', 'review', 'published', 'failed'], default: 'generating' },
  generatedAt: Date,
  publishedAt: Date
}, { timestamps: true });

dailyTestSchema.index({ testDate: 1, generationStatus: 1 });
export default mongoose.model('DailyTest', dailyTestSchema);
