import mongoose, { Document, Schema } from 'mongoose';

export interface IContact extends Document {
  name: string;
  email: string;
  password: string;
  phone: string;
  photoUrl: string;
  category: string;
  tags: string[];
  connectionStrength: number;
  notes: string;
  lastInteraction: string;
  customFields: {
    [key: string]: string;
  };
  meetThroughContactId?: string;
  role: string;
  // Settings fields
  firstName: string;
  lastName: string;
  bio: string;
  settings: {
    notifications: {
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
    };
    privacy: {
      dataEncryption: boolean;
      profileVisibility: string;
      contactSharing: boolean;
    };
    appearance: {
      theme: string;
      language: string;
    };
  };
}

const ContactSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  photoUrl: { type: String },
  category: { type: String },
  tags: [{ type: String }],
  connectionStrength: { type: Number, default: 50 },
  notes: { type: String },
  lastInteraction: { type: String, default: "No Logs" },
  customFields: { type: Map, of: String },
  meetThroughContactId: { type: String },
  role: { type: String, default: 'user' },
  // Settings fields
  firstName: { type: String },
  lastName: { type: String },
  bio: { type: String },
  settings: {
    notifications: {
      email: {
        reminders: { type: Boolean, default: true },
        birthdays: { type: Boolean, default: true },
        weeklySummary: { type: Boolean, default: true }
      },
      push: {
        enabled: { type: Boolean, default: true },
        reminders: { type: Boolean, default: true },
        birthdays: { type: Boolean, default: true }
      }
    },
    privacy: {
      dataEncryption: { type: Boolean, default: true },
      profileVisibility: { type: String, default: 'private' },
      contactSharing: { type: Boolean, default: false }
    },
    appearance: {
      theme: { type: String, default: 'system' },
      language: { type: String, default: 'en' }
    }
  }
}, {
  timestamps: true
});

export default mongoose.model<IContact>('Contact', ContactSchema); 