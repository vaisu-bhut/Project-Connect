const Interaction = require('../models/Interaction');

// Get interactions for a specific contact and user
exports.getInteractionsByContact = async (req, res) => {
  try {
    const { contactId } = req.params;
    const userId = req.user._id; // Assuming user ID is in the request from auth middleware

    const interactions = await Interaction.find({
      contacts: contactId,
      userId: userId
    }).populate('contacts', 'firstName lastName email');

    res.json(interactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new interaction
exports.createInteraction = async (req, res) => {
  try {
    const userId = req.user._id;
    const interaction = new Interaction({
      ...req.body,
      userId
    });
    const savedInteraction = await interaction.save();
    res.status(201).json(savedInteraction);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update an interaction
exports.updateInteraction = async (req, res) => {
  try {
    const userId = req.user._id;
    const interaction = await Interaction.findOneAndUpdate(
      { _id: req.params.id, userId },
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!interaction) {
      return res.status(404).json({ message: 'Interaction not found' });
    }
    
    res.json(interaction);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete an interaction
exports.deleteInteraction = async (req, res) => {
  try {
    const userId = req.user._id;
    const interaction = await Interaction.findOneAndDelete({
      _id: req.params.id,
      userId
    });
    
    if (!interaction) {
      return res.status(404).json({ message: 'Interaction not found' });
    }
    
    res.json({ message: 'Interaction deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 