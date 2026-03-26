import mongoose from 'mongoose';

const matchSchema = new mongoose.Schema({
  team1: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    required: true
  },
  team2: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    required: true
  },
  format: {
    type: String,
    enum: ['Test', 'ODI', 'T20', 'T10', 'IPL'],
    required: true
  },
  venue: {
    name: String,
    city: String,
    country: String,
    capacity: Number
  },
  date: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['Scheduled', 'Live', 'Completed', 'Cancelled', 'Tied', 'No Result'],
    default: 'Scheduled'
  },
  result: {
    winner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team'
    },
    margin: String,
    marginType: {
      type: String,
      enum: ['runs', 'wickets', 'innings', 'draw']
    }
  },
  scores: [{
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team'
    },
    runs: Number,
    wickets: Number,
    overs: Number
  }],
  manOfTheMatch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player'
  },
  tossWinner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team'
  },
  tossDecision: {
    type: String,
    enum: ['bat', 'bowl']
  },
  series: String,
  notes: String
}, {
  timestamps: true
});

matchSchema.index({ date: -1 });
matchSchema.index({ format: 1 });
matchSchema.index({ status: 1 });

export default mongoose.model('Match', matchSchema);
