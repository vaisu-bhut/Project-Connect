import axios from 'axios';

const API_URL = 'http://localhost:5000/api/settings';

export interface ProfileData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    bio: string;
}

export interface PasswordData {
    currentPassword: string;
    newPassword: string;
}

export interface NotificationSettings {
    email: {
        reminders: boolean;
        birthdays: boolean;
        weeklySummary: boolean;
    };
    push: {
        enabled: boolean;
        reminders: boolean;
        birthdays: boolean;
    };
}

export interface PrivacySettings {
    dataEncryption: boolean;
    profileVisibility: string;
    contactSharing: boolean;
}

export interface AppearanceSettings {
    theme: string;
    language: string;
}

// Get user settings
export const getUserSettings = async () => {
    const response = await axios.get(API_URL, { withCredentials: true });
    return response.data;
};

// Update profile
export const updateProfile = async (data: ProfileData) => {
    const response = await axios.put(`${API_URL}/profile`, data, { withCredentials: true });
    return response.data;
};

// Update password
export const updatePassword = async (data: PasswordData) => {
    const response = await axios.put(`${API_URL}/password`, data, { withCredentials: true });
    return response.data;
};

// Update notification settings
export const updateNotifications = async (notifications: NotificationSettings) => {
    const response = await axios.put(`${API_URL}/notifications`, { notifications }, { withCredentials: true });
    return response.data;
};

// Update privacy settings
export const updatePrivacy = async (privacy: PrivacySettings) => {
    const response = await axios.put(`${API_URL}/privacy`, { privacy }, { withCredentials: true });
    return response.data;
};

// Update appearance settings
export const updateAppearance = async (appearance: AppearanceSettings) => {
    const response = await axios.put(`${API_URL}/appearance`, { appearance }, { withCredentials: true });
    return response.data;
};

// Delete account
export const deleteAccount = async () => {
    const response = await axios.delete(API_URL, { withCredentials: true });
    return response.data;
}; 