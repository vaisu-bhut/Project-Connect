import mongoose, { Document, Schema } from 'mongoose';

export interface IContact extends Document {
  name: string;
  email: string;
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
}

const ContactSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  photoUrl: { type: String },
  category: { type: String, required: true },
  tags: [{ type: String }],
  connectionStrength: { type: Number, default: 50 },
  notes: { type: String },
  lastInteraction: { type: String, default: "No Logs" },
  customFields: { type: Map, of: String },
  meetThroughContactId: { type: String }
}, {
  timestamps: true
});

export default mongoose.model<IContact>('Contact', ContactSchema); 