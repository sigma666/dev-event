import mongoose, { Document, Model, Schema, Types } from 'mongoose';
import { Event } from './event.model';

/**
 * Booking document shape stored in MongoDB.
 */
export interface BookingDocument extends Document {
  eventId: Types.ObjectId;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Simple, strict email validation for user bookings.
 */
const emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const BookingSchema = new Schema<BookingDocument>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
      index: true, // index for faster lookups by event
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: (value: string): boolean => emailRegex.test(value),
        message: 'Invalid email address',
      },
    },
  },
  {
    timestamps: true,
    strict: true,
  }
);

// Explicit index on eventId to support common query patterns.
BookingSchema.index({ eventId: 1 });

/**
 * Pre-save hook to ensure referential integrity and validate email.
 */
BookingSchema.pre<BookingDocument>('save', async function preSave(next) {
  try {
    if (!this.eventId) {
      throw new Error('A valid eventId is required for a booking.');
    }

    // Ensure referenced event exists before creating the booking.
    const eventExists = await Event.exists({ _id: this.eventId }).lean();
    if (!eventExists) {
      throw new Error('Cannot create booking: referenced event does not exist.');
    }

    if (!emailRegex.test(this.email)) {
      throw new Error('Invalid email address.');
    }

    next();
  } catch (err) {
    next(err as Error);
  }
});

export const Booking: Model<BookingDocument> =
  (mongoose.models.Booking as Model<BookingDocument>) ||
  mongoose.model<BookingDocument>('Booking', BookingSchema);
