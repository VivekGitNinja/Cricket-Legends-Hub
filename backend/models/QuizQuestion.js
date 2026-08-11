import mongoose from 'mongoose';

const quizQuestionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: [true, 'Please provide the question'],
    trim: true
  },
  options: {
    type: [String],
    required: true,
    validate: {
      validator: (opts) => opts.length >= 2 && opts.length <= 6,
      message: 'Quiz questions need 2-6 options'
    }
  },
  answer: {
    type: Number,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'easy'
  },
  category: {
    type: String,
    enum: ['batting', 'bowling', 'all-round', 'world-cups', 'records', 'women'],
    default: 'batting'
  }
}, {
  timestamps: true
});

export default mongoose.model('QuizQuestion', quizQuestionSchema);
