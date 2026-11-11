import mongoose from 'mongoose';

const userProfileSchema = new mongoose.Schema({
  userId: { type: String, default: 'local-user', unique: true },
  displayName: { type: String, default: 'Learner' },
  timezone: { type: String, default: 'Asia/Kolkata' },
  preferredLanguage: { type: String, default: 'cpp' },
  currentDifficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'easy' },
  topicStats: [{
    topic: String,
    attempted: { type: Number, default: 0 },
    correct: { type: Number, default: 0 },
    accuracy: { type: Number, default: 0 }
  }],
  currentStreak: { type: Number, default: 0 },
  longestStreak: { type: Number, default: 0 },
  lastPracticeDate: String
}, { timestamps: true });

export default mongoose.model('UserProfile', userProfileSchema);
