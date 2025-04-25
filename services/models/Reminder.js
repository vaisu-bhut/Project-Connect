const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  status: { type: String, required: true , default: 'incomplete'},
  interactionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Interaction' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Reminder', reminderSchema); 