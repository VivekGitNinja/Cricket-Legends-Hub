import mongoose from 'mongoose';

const quizAttemptSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  name: {
    type: String,
    trim: true,
    maxlength: 40
  },
  score: {
    type: Number,
    required: true,
    min: 0
  },
  total: {
    type: Number,
    required: true,
    min: 1
  },
  timeTaken: Number // seconds
}, {
  timestamps: true
});

quizAttemptSchema.index({ score: -1, createdAt: -1 });

export default mongoose.model('QuizAttempt', quizAttemptSchema);
