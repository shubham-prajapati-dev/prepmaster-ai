import mongoose from 'mongoose';

const optionSchema = new mongoose.Schema({
  key: { type: String, enum: ['A', 'B', 'C', 'D'], required: true },
  text: { type: String, required: true }
}, { _id: false });

const questionSchema = new mongoose.Schema({
  section: { type: String, enum: ['vocabulary', 'reasoning', 'arithmetic_logical', 'coding'], required: true, index: true },
  type: { type: String, enum: ['mcq', 'coding'], required: true },
  prompt: { type: String, required: true },
  options: { type: [optionSchema], default: [] },
  answerKey: { type: String, select: false },
  explanation: { type: String, select: false },
  topic: { type: String, required: true, index: true },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], required: true, index: true },
  marks: { type: Number, default: 1, min: 0 },
  coding: {
    constraints: [String],
    sampleInput: String,
    sampleOutput: String,
    starterCode: String,
    language: { type: String, default: 'cpp' },
    evaluatorProblemId: String
  },
  source: { type: String, enum: ['ai', 'admin'], default: 'ai' },
  fingerprint: { type: String, unique: true, sparse: true },
  status: { type: String, enum: ['draft', 'verified', 'retired'], default: 'draft', index: true }
}, { timestamps: true });

export default mongoose.model('Question', questionSchema);
