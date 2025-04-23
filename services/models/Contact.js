const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone: String,
  jobTitle: String,
  company: String,
  address: String,
  category: {
    type: String,
    required: true
  },
  tags: [{
    type: String
  }],
  image: String,
  notes: String,
  socialProfiles: [{
    type: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    }
  }],
  customFields: [{
    key: {
      type: String,
      required: true
    },
    value: {
      type: String,
      required: true
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp before saving
contactSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Contact', contactSchema); 