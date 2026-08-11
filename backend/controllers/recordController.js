import Record from '../models/Record.js';

export const getRecords = async (req, res) => {
  try {
    const { category } = req.query;
    const query = {};
    if (category) query.category = category;

    const records = await Record.find(query).sort({ category: 1, label: 1 });
    res.status(200).json({ success: true, count: records.length, records });
  } catch (error) {
    console.error('Get records error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching records' });
  }
};

export const getRecord = async (req, res) => {
  try {
    const record = await Record.findById(req.params.id);
    if (!record) {
      return res.status(404).json({ success: false, message: 'Record not found' });
    }
    res.status(200).json({ success: true, record });
  } catch (error) {
    console.error('Get record error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching record' });
  }
};

export const createRecord = async (req, res) => {
  try {
    const record = await Record.create(req.body);
    res.status(201).json({ success: true, message: 'Record created', record });
  } catch (error) {
    console.error('Create record error:', error);
    res.status(500).json({ success: false, message: 'Server error creating record' });
  }
};

export const updateRecord = async (req, res) => {
  try {
    const record = await Record.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!record) {
      return res.status(404).json({ success: false, message: 'Record not found' });
    }
    res.status(200).json({ success: true, message: 'Record updated', record });
  } catch (error) {
    console.error('Update record error:', error);
    res.status(500).json({ success: false, message: 'Server error updating record' });
  }
};

export const deleteRecord = async (req, res) => {
  try {
    const record = await Record.findByIdAndDelete(req.params.id);
    if (!record) {
      return res.status(404).json({ success: false, message: 'Record not found' });
    }
    res.status(200).json({ success: true, message: 'Record deleted' });
  } catch (error) {
    console.error('Delete record error:', error);
    res.status(500).json({ success: false, message: 'Server error deleting record' });
  }
};
