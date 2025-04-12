import express from 'express';
import { authMiddleware } from '../middleware/auth';
import Contact from '../models/Contact';
import bcrypt from 'bcryptjs';

const router = express.Router();

// Get user settings
router.get('/', authMiddleware, async (req, res) => {
    try {
        const user = await Contact.findById(req.user?.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching settings' });
    }
});

// Update profile
router.put('/profile', authMiddleware, async (req, res) => {
    try {
        const { firstName, lastName, email, phone, bio } = req.body;
        const user = await Contact.findById(req.user?.id);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.firstName = firstName;
        user.lastName = lastName;
        user.name = `${firstName} ${lastName}`;
        user.email = email;
        user.phone = phone;
        user.bio = bio;

        await user.save();
        res.json({ message: 'Profile updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating profile' });
    }
});

// Update password
router.put('/password', authMiddleware, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await Contact.findById(req.user?.id);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Verify current password
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Current password is incorrect' });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        res.json({ message: 'Password updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating password' });
    }
});

// Update notifications
router.put('/notifications', authMiddleware, async (req, res) => {
    try {
        const { notifications } = req.body;
        const user = await Contact.findById(req.user?.id);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.settings.notifications = notifications;
        await user.save();
        res.json({ message: 'Notification settings updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating notification settings' });
    }
});

// Update privacy settings
router.put('/privacy', authMiddleware, async (req, res) => {
    try {
        const { privacy } = req.body;
        const user = await Contact.findById(req.user?.id);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.settings.privacy = privacy;
        await user.save();
        res.json({ message: 'Privacy settings updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating privacy settings' });
    }
});

// Update appearance settings
router.put('/appearance', authMiddleware, async (req, res) => {
    try {
        const { appearance } = req.body;
        const user = await Contact.findById(req.user?.id);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.settings.appearance = appearance;
        await user.save();
        res.json({ message: 'Appearance settings updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating appearance settings' });
    }
});

// Delete account
router.delete('/', authMiddleware, async (req, res) => {
    try {
        await Contact.findByIdAndDelete(req.user?.id);
        res.clearCookie('token');
        res.json({ message: 'Account deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting account' });
    }
});

export default router; 