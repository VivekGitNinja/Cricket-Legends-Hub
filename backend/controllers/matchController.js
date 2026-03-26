import Match from '../models/Match.js';
import Team from '../models/Team.js';
import Player from '../models/Player.js';

export const getMatches = async (req, res) => {
  try {
    const { format, status, team, page = 1, limit = 10 } = req.query;
    const query = {};

    if (format) query.format = format;
    if (status) query.status = status;
    if (team) {
      query.$or = [
        { team1: team },
        { team2: team }
      ];
    }

    const matches = await Match.find(query)
      .populate('team1 team2 result.winner manOfTheMatch tossWinner', 'name shortName')
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Match.countDocuments(query);

    res.status(200).json({
      success: true,
      count: matches.length,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
      matches
    });
  } catch (error) {
    console.error('Get matches error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching matches'
    });
  }
};

export const getMatch = async (req, res) => {
  try {
    const match = await Match.findById(req.params.id)
      .populate('team1 team2 result.winner manOfTheMatch tossWinner', 'name shortName logo');

    if (!match) {
      return res.status(404).json({
        success: false,
        message: 'Match not found'
      });
    }

    res.status(200).json({
      success: true,
      match
    });
  } catch (error) {
    console.error('Get match error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching match'
    });
  }
};

export const createMatch = async (req, res) => {
  try {
    const match = await Match.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Match created successfully',
      match
    });
  } catch (error) {
    console.error('Create match error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating match'
    });
  }
};

export const updateMatch = async (req, res) => {
  try {
    const match = await Match.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate('team1 team2 result.winner manOfTheMatch tossWinner', 'name shortName');

    if (!match) {
      return res.status(404).json({
        success: false,
        message: 'Match not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Match updated successfully',
      match
    });
  } catch (error) {
    console.error('Update match error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating match'
    });
  }
};

export const deleteMatch = async (req, res) => {
  try {
    const match = await Match.findByIdAndDelete(req.params.id);
    if (!match) {
      return res.status(404).json({
        success: false,
        message: 'Match not found'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Match deleted successfully'
    });
  } catch (error) {
    console.error('Delete match error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting match'
    });
  }
};
