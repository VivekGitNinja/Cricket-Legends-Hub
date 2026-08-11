import mongoose from 'mongoose';

const newsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    trim: true
  },
  slug: {
    type: String,
    unique: true,
    trim: true,
    lowercase: true
  },
  excerpt: {
    type: String,
    maxlength: 300
  },
  content: {
    type: String,
    maxlength: 5000
  },
  category: {
    type: String,
    enum: ['Match', 'Series', 'Transfer', 'ICC', 'Women', 'IPL', 'Records', 'Analysis'],
    default: 'Match'
  },
  imageUrl: String,
  source: {
    type: String,
    default: 'Cricket Legends Hub'
  },
  author: {
    type: String,
    default: 'Editorial Desk'
  },
  tags: [String],
  featured: {
    type: Boolean,
    default: false
  },
  publishedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

newsSchema.index({ publishedAt: -1 });
newsSchema.index({ category: 1 });
newsSchema.index({ featured: 1 });

export default mongoose.model('News', newsSchema);
