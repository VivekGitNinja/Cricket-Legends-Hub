import mongoose from 'mongoose';

const playerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide player name'],
    trim: true
  },
  fullName: {
    type: String,
    trim: true
  },
  nickName: {
    type: String,
    trim: true
  },
  country: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['Batsman', 'Bowler', 'All-rounder', 'All-Rounder', 'Wicket-keeper', 'Wicket-Keeper'],
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
  playingFrom: {
    type: Number
  },
  currentTeam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team'
  },
  teams: [{
    type: String
  }],
  format: {
    type: String,
    enum: ['Test', 'ODI', 'T20', 'All'],
    default: 'All'
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
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
