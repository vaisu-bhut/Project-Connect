import mongoose, { Schema, Document } from 'mongoose';

export interface IInteraction extends Document {
  userId: mongoose.Types.ObjectId;
  contactIds: mongoose.Types.ObjectId[];
  type: string;
  title: string;
  date: Date;
  time: string;
  notes: string;
  reminders?: {
    date: Date;
    time: string;
    message: string;
  }[];
  attachments?: {
    name: string;
    path: string;
    type: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const InteractionSchema: Schema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  contactIds: [{
    type: Schema.Types.ObjectId,
    ref: 'Contact',
    required: true
  }],
  type: {
    type: String,
    required: true,
    enum: ['call', 'email', 'meeting', 'coffee', 'lunch', 'event', 'other']
  },
  title: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  notes: {
    type: String,
    required: true
  },
  reminders: [{
    date: {
      type: Date,
      required: true
    },
    time: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    }
  }],
  attachments: [{
    name: {
      type: String,
      required: true
    },
    path: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true
    }
  }]
}, {
  timestamps: true
});

export default mongoose.model<IInteraction>('Interaction', InteractionSchema); 