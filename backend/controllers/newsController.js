import News from '../models/News.js';

export const getNews = async (req, res) => {
  try {
    const { category, limit = 20, featured } = req.query;
    const query = {};
    if (category) query.category = category;
    if (featured === 'true') query.featured = true;

    const news = await News.find(query)
      .sort({ featured: -1, publishedAt: -1 })
      .limit(Number(limit));

    res.status(200).json({ success: true, count: news.length, news });
  } catch (error) {
    console.error('Get news error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching news' });
  }
};

export const getNewsBySlug = async (req, res) => {
  try {
    const item = await News.findOne({ slug: req.params.slug });
    if (!item) {
      return res.status(404).json({ success: false, message: 'News item not found' });
    }
    res.status(200).json({ success: true, news: item });
  } catch (error) {
    console.error('Get news item error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching news item' });
  }
};

export const createNews = async (req, res) => {
  try {
    const { title, ...rest } = req.body;
    if (!title) {
      return res.status(400).json({ success: false, message: 'Title is required' });
    }
    const slug = (rest.slug || title)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    const news = await News.create({ ...rest, title, slug });
    res.status(201).json({ success: true, message: 'News published', news });
  } catch (error) {
    console.error('Create news error:', error);
    res.status(500).json({ success: false, message: 'Server error publishing news' });
  }
};

export const updateNews = async (req, res) => {
  try {
    const news = await News.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!news) {
      return res.status(404).json({ success: false, message: 'News item not found' });
    }
    res.status(200).json({ success: true, message: 'News updated', news });
  } catch (error) {
    console.error('Update news error:', error);
    res.status(500).json({ success: false, message: 'Server error updating news' });
  }
};

export const deleteNews = async (req, res) => {
  try {
    const news = await News.findByIdAndDelete(req.params.id);
    if (!news) {
      return res.status(404).json({ success: false, message: 'News item not found' });
    }
    res.status(200).json({ success: true, message: 'News deleted' });
  } catch (error) {
    console.error('Delete news error:', error);
    res.status(500).json({ success: false, message: 'Server error deleting news' });
  }
};
