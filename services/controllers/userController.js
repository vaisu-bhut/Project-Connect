const User = require('../models/User');

const userController = {
  // Get user profile
  async getProfile(req, res) {
    try {
      const user = await User.findById(req.userId).select('-password');
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching profile', error: error.message });
    }
  },

  // Update profile details
  async updateProfile(req, res) {
    try {
      const { firstName, lastName, phoneNumber, profilePic, address } = req.body;
      
      const user = await User.findByIdAndUpdate(
        req.userId,
        {
          $set: {
            'profile.firstName': firstName,
            'profile.lastName': lastName,
            'profile.phoneNumber': phoneNumber,
            'profile.profilePic': profilePic,
            'profile.address': address
          }
        },
        { new: true }
      ).select('-password');

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json({ message: 'Profile updated successfully', user });
    } catch (error) {
      res.status(500).json({ message: 'Error updating profile', error: error.message });
    }
  },

  // Update notification preferences
  async updateNotificationPreferences(req, res) {
    try {
      const { emailNotifications, inAppNotifications } = req.body;
      
      const user = await User.findByIdAndUpdate(
        req.userId,
        {
          $set: {
            'notificationPreferences.emailNotifications': emailNotifications,
            'notificationPreferences.inAppNotifications': inAppNotifications
          }
        },
        { new: true }
      ).select('-password');

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json({ message: 'Notification preferences updated successfully', user });
    } catch (error) {
      res.status(500).json({ message: 'Error updating notification preferences', error: error.message });
    }
  },

  // Update data privacy settings
  async updateDataPrivacy(req, res) {
    try {
      const { dataBackup, analytics } = req.body;
      
      const user = await User.findByIdAndUpdate(
        req.userId,
        {
          $set: {
            'dataPrivacy.dataBackup': dataBackup,
            'dataPrivacy.analytics': analytics
          }
        },
        { new: true }
      ).select('-password');

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json({ message: 'Data privacy settings updated successfully', user });
    } catch (error) {
      res.status(500).json({ message: 'Error updating data privacy settings', error: error.message });
    }
  }
};

module.exports = userController; 