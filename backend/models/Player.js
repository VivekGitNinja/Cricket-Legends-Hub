import mongoose from 'mongoose';

const playerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide player name'],
    trim: true
  },
  country: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['Batsman', 'Bowler', 'All-rounder', 'Wicket-keeper'],
    required: true
  },
  battingStyle: {
    type: String,
    default: 'Right-hand bat'
  },
  bowlingStyle: {
    type: String,
    default: 'Right-arm'
  },
  dateOfBirth: {
    type: Date
  },
  teams: [{
    type: String
  }],
  stats: {
    test: {
      matches: { type: Number, default: 0 },
      runs: { type: Number, default: 0 },
      wickets: { type: Number, default: 0 },
      average: { type: Number, default: 0 },
      strikeRate: { type: Number, default: 0 }
    },
    odi: {
      matches: { type: Number, default: 0 },
      runs: { type: Number, default: 0 },
      wickets: { type: Number, default: 0 },
      average: { type: Number, default: 0 },
      strikeRate: { type: Number, default: 0 }
    },
    t20: {
      matches: { type: Number, default: 0 },
      runs: { type: Number, default: 0 },
      wickets: { type: Number, default: 0 },
      average: { type: Number, default: 0 },
      strikeRate: { type: Number, default: 0 }
    }
  },
  bio: {
    type: String,
    maxlength: 1000
  },
  imageUrl: {
    type: String
  },
  isLegend: {
    type: Boolean,
    default: false
  },
  achievements: [{
    type: String
  }]
}, {
  timestamps: true
});

export default mongoose.model('Player', playerSchema);
