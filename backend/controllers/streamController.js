import Stream from '../models/Stream.js';

export const getStreams = async (req, res) => {
  try {
    const { live } = req.query;
    const query = {};
    if (live === 'true') query.isLive = true;

    const streams = await Stream.find(query)
      .populate('match', 'team1 team2 format status scores date')
      .populate({
        path: 'match',
        populate: { path: 'team1 team2', select: 'name shortName' }
      })
      .sort({ isLive: -1, startsAt: 1 });

    res.status(200).json({ success: true, count: streams.length, streams });
  } catch (error) {
    console.error('Get streams error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching streams' });
  }
};

export const getStream = async (req, res) => {
  try {
    const stream = await Stream.findById(req.params.id)
      .populate({
        path: 'match',
        populate: { path: 'team1 team2', select: 'name shortName' }
      });
    if (!stream) {
      return res.status(404).json({ success: false, message: 'Stream not found' });
    }
    res.status(200).json({ success: true, stream });
  } catch (error) {
    console.error('Get stream error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching stream' });
  }
};

export const createStream = async (req, res) => {
  try {
    const stream = await Stream.create(req.body);
    res.status(201).json({ success: true, message: 'Stream created', stream });
  } catch (error) {
    console.error('Create stream error:', error);
    res.status(500).json({ success: false, message: 'Server error creating stream' });
  }
};

export const updateStream = async (req, res) => {
  try {
    const stream = await Stream.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!stream) {
      return res.status(404).json({ success: false, message: 'Stream not found' });
    }
    res.status(200).json({ success: true, message: 'Stream updated', stream });
  } catch (error) {
    console.error('Update stream error:', error);
    res.status(500).json({ success: false, message: 'Server error updating stream' });
  }
};

export const deleteStream = async (req, res) => {
  try {
    const stream = await Stream.findByIdAndDelete(req.params.id);
    if (!stream) {
      return res.status(404).json({ success: false, message: 'Stream not found' });
    }
    res.status(200).json({ success: true, message: 'Stream deleted' });
  } catch (error) {
    console.error('Delete stream error:', error);
    res.status(500).json({ success: false, message: 'Server error deleting stream' });
  }
};
