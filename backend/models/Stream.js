import mongoose from 'mongoose';

const streamSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a stream title'],
    trim: true
  },
  match: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Match'
  },
  provider: {
    type: String,
    enum: ['YouTube', 'JioCinema', 'Hotstar', 'Willow TV', 'Sky Sports', 'FanCode', 'SonyLIV'],
    default: 'YouTube'
  },
  embedUrl: String,
  externalUrl: String,
  isLive: {
    type: Boolean,
    default: false
  },
  startsAt: Date,
  viewers: {
    type: Number,
    default: 0
  },
  language: {
    type: String,
    default: 'en'
  },
  thumbnail: String,
  description: String
}, {
  timestamps: true
});

streamSchema.index({ isLive: -1 });
streamSchema.index({ startsAt: 1 });

export default mongoose.model('Stream', streamSchema);
