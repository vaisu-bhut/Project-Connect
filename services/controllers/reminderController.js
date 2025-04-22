const Reminder = require('../models/Reminder');

// Get reminders, optionally filtered by interactionId
exports.getReminders = async (req, res) => {
  try {
    const userId = req.userId;
    const { interactionId } = req.query;
    const filter = { userId };
    if (interactionId) filter.interactionId = interactionId;
    const reminders = await Reminder.find(filter).sort({ date: 1 });
    res.json(reminders);
  } catch (error) {
    console.error('Error fetching reminders:', error.message);
    res.status(500).json({ message: error.message });
  }
};

// Get a single reminder by ID
exports.getReminderById = async (req, res) => {
  try {
    const userId = req.userId;
    const reminder = await Reminder.findOne({ _id: req.params.id, userId });
    if (!reminder) {
      return res.status(404).json({ message: 'Reminder not found' });
    }
    res.json(reminder);
  } catch (error) {
    console.error('Error fetching reminder:', error.message);
    res.status(500).json({ message: error.message });
  }
};

// Create a new reminder
exports.createReminder = async (req, res) => {
  try {
    const userId = req.userId;
    const { title, description, date, time, interactionId } = req.body;
    const reminder = new Reminder({ title, description, date, time, interactionId, userId });
    const saved = await reminder.save();
    res.status(201).json(saved);
  } catch (error) {
    console.error('Error creating reminder:', error.message);
    res.status(400).json({ message: error.message });
  }
};

// Update a reminder
exports.updateReminder = async (req, res) => {
  try {
    const userId = req.userId;
    const updated = await Reminder.findOneAndUpdate(
      { _id: req.params.id, userId },
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) {
      return res.status(404).json({ message: 'Reminder not found' });
    }
    res.json(updated);
  } catch (error) {
    console.error('Error updating reminder:', error.message);
    res.status(400).json({ message: error.message });
  }
};

// Delete a reminder
exports.deleteReminder = async (req, res) => {
  try {
    const userId = req.userId;
    const removed = await Reminder.findOneAndDelete({ _id: req.params.id, userId });
    if (!removed) {
      return res.status(404).json({ message: 'Reminder not found' });
    }
    res.json({ message: 'Reminder deleted successfully' });
  } catch (error) {
    console.error('Error deleting reminder:', error.message);
    res.status(500).json({ message: error.message });
  }
}; 