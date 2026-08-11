import mongoose from 'mongoose';

const recordSchema = new mongoose.Schema({
  category: {
    type: String,
    enum: ['batting', 'bowling', 'team', 'women', 'fielding', 'partnership'],
    required: true
  },
  label: {
    type: String,
    required: [true, 'Please provide the record label'],
    trim: true
  },
  holder: {
    type: String,
    required: true,
    trim: true
  },
  value: {
    type: String,
    required: true,
    trim: true
  },
  country: String,
  year: String,
  format: {
    type: String,
    enum: ['Test', 'ODI', 'T20I', 'All'],
    default: 'All'
  },
  note: String
}, {
  timestamps: true
});

recordSchema.index({ category: 1 });

export default mongoose.model('Record', recordSchema);
