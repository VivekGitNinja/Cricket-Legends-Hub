import Team from '../models/Team.js';
import Player from '../models/Player.js';

export const getTeams = async (req, res) => {
  try {
    const { type, country, page = 1, limit = 10 } = req.query;
    const query = {};
    
    if (type) query.type = type;
    if (country) query.country = country;
    
    const teams = await Team.find(query)
      .populate('players captain coach', 'name role country')
      .sort({ name: 1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    
    const total = await Team.countDocuments(query);
    
    res.status(200).json({
      success: true,
      count: teams.length,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
      teams
    });
  } catch (error) {
    console.error('Get teams error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching teams'
    });
  }
};

export const getTeam = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id)
      .populate('players captain coach', 'name role country stats');
    
    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found'
      });
    }
    
    res.status(200).json({
      success: true,
      team
    });
  } catch (error) {
    console.error('Get team error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching team'
    });
  }
};

export const createTeam = async (req, res) => {
  try {
    const team = await Team.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Team created successfully',
      team
    });
  } catch (error) {
    console.error('Create team error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating team'
    });
  }
};

export const updateTeam = async (req, res) => {
  try {
    const team = await Team.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('players captain coach');
    
    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Team updated successfully',
      team
    });
  } catch (error) {
    console.error('Update team error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating team'
    });
  }
};

export const deleteTeam = async (req, res) => {
  try {
    const team = await Team.findByIdAndDelete(req.params.id);
    
    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Team deleted successfully'
    });
  } catch (error) {
    console.error('Delete team error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting team'
    });
  }
};
