import Player from '../models/Player.js';
import Team from '../models/Team.js';

export const getPlayers = async (req, res) => {
  try {
    const { role, team, country, format, minRating, maxRating } = req.query;
    const query = {};

    if (role) query.role = role;
    if (team) query.currentTeam = team;
    if (country) query.country = country;
    if (format) query.format = format;
    if (minRating || maxRating) {
      query.rating = {};
      if (minRating) query.rating.$gte = Number(minRating);
      if (maxRating) query.rating.$lte = Number(maxRating);
    }

    const players = await Player.find(query).populate('currentTeam', 'name country');
    res.status(200).json({
      success: true,
      count: players.length,
      players
    });
  } catch (error) {
    console.error('Get players error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching players'
    });
  }
};

export const getPlayer = async (req, res) => {
  try {
    const player = await Player.findById(req.params.id).populate('currentTeam', 'name country');
    if (!player) {
      return res.status(404).json({
        success: false,
        message: 'Player not found'
      });
    }
    res.status(200).json({
      success: true,
      player
    });
  } catch (error) {
    console.error('Get player error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching player'
    });
  }
};

export const createPlayer = async (req, res) => {
  try {
    const player = await Player.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Player created successfully',
      player
    });
  } catch (error) {
    console.error('Create player error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating player'
    });
  }
};

export const updatePlayer = async (req, res) => {
  try {
    const player = await Player.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!player) {
      return res.status(404).json({
        success: false,
        message: 'Player not found'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Player updated successfully',
      player
    });
  } catch (error) {
    console.error('Update player error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating player'
    });
  }
};

export const deletePlayer = async (req, res) => {
  try {
    const player = await Player.findByIdAndDelete(req.params.id);
    if (!player) {
      return res.status(404).json({
        success: false,
        message: 'Player not found'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Player deleted successfully'
    });
  } catch (error) {
    console.error('Delete player error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting player'
    });
  }
};

export const searchPlayers = async (req, res) => {
  try {
    const { query } = req.query;
    const searchRegex = new RegExp(query, 'i');
    const players = await Player.find({
      $or: [
        { name: searchRegex },
        { fullName: searchRegex },
        { country: searchRegex },
        { nickName: searchRegex }
      ]
    }).limit(10);

    res.status(200).json({
      success: true,
      count: players.length,
      players
    });
  } catch (error) {
    console.error('Search players error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error searching players'
    });
  }
};
