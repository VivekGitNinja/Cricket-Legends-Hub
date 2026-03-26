import mongoose from 'mongoose';

const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  shortName: {
    type: String,
    trim: true
  },
  country: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['National', 'Franchise', 'Club'],
    required: true
  },
  logo: String,
  founded: Number,
  homeGround: {
    name: String,
    city: String,
    capacity: Number
  },
  coach: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player'
  },
  captain: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player'
  },
  players: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player'
  }],
  stats: {
    matchesPlayed: { type: Number, default: 0 },
    matchesWon: { type: Number, default: 0 },
    matchesLost: { type: Number, default: 0 },
    matchesDrawn: { type: Number, default: 0 },
    winPercentage: { type: Number, default: 0 }
  },
  description: String,
  website: String,
  socialLinks: {
    twitter: String,
    instagram: String,
    facebook: String
  }
}, {
  timestamps: true
});

export default mongoose.model('Team', teamSchema);
