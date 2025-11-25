import mongoose, { Document, Model, Schema } from 'mongoose';

/**
 * Event document shape stored in MongoDB.
 */
export interface EventDocument extends Document {
  title: string;
  slug: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string; // ISO-8601 date string
  time: string; // 24h time string in HH:MM format
  mode: string;
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Helper to slugify a title into a URL-safe identifier.
 */
const slugify = (value: string): string =>
  value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // remove invalid chars
    .replace(/\s+/g, '-') // collapse whitespace to single dashes
    .replace(/-+/g, '-'); // collapse multiple dashes

/**
 * Normalize a date input into an ISO-8601 string (YYYY-MM-DD).
 * Throws if the input cannot be parsed into a valid date.
 */
const normalizeDate = (value: string): string => {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    throw new Error('Invalid event date');
  }

  // Only keep the date portion (UTC) for consistency.
  const year = parsed.getUTCFullYear();
  const month = String(parsed.getUTCMonth() + 1).padStart(2, '0');
  const day = String(parsed.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Normalize time to 24-hour HH:MM format.
 * Accepts simple "H:MM" or "HH:MM" inputs.
 */
const normalizeTime = (value: string): string => {
  const trimmed = value.trim();
  const match = /^([01]?\d|2[0-3]):([0-5]\d)$/.exec(trimmed);
  if (!match) {
    throw new Error('Invalid event time; expected HH:MM in 24-hour format');
  }
  const hours = match[1].padStart(2, '0');
  const minutes = match[2];
  return `${hours}:${minutes}`;
};

const EventSchema = new Schema<EventDocument>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    description: { type: String, required: true, trim: true },
    overview: { type: String, required: true, trim: true },
    image: { type: String, required: true, trim: true },
    venue: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    mode: { type: String, required: true, trim: true },
    audience: { type: String, required: true, trim: true },
    agenda: { type: [String], required: true, validate: (v: string[]) => v.length > 0 },
    organizer: { type: String, required: true, trim: true },
    tags: { type: [String], required: true, validate: (v: string[]) => v.length > 0 },
  },
  {
    timestamps: true,
    strict: true,
  }
);

// Ensure slug has a unique index at the database level.
EventSchema.index({ slug: 1 }, { unique: true });

/**
 * Pre-save hook to:
 * - generate/refresh the slug when the title changes
 * - normalize date and time
 * - perform extra non-empty validations.
 */
EventSchema.pre<EventDocument>('save', function preSave(next) {
  try {
    // Validate required string fields are non-empty after trimming.
    const requiredStrings: Array<keyof EventDocument> = [
      'title',
      'description',
      'overview',
      'image',
      'venue',
      'location',
      'mode',
      'audience',
      'organizer',
    ];

    for (const field of requiredStrings) {
      const value = this[field];
      if (typeof value !== 'string' || value.trim().length === 0) {
        throw new Error(`Field "${String(field)}" is required and cannot be empty.`);
      }
    }

    if (!Array.isArray(this.agenda) || this.agenda.length === 0) {
      throw new Error('Field "agenda" must be a non-empty array of strings.');
    }

    if (!Array.isArray(this.tags) || this.tags.length === 0) {
      throw new Error('Field "tags" must be a non-empty array of strings.');
    }

    // Regenerate slug only if title was modified.
    if (this.isModified('title') || !this.slug) {
      this.slug = slugify(this.title);
    }

    // Normalize date and time representation.
    if (this.isModified('date')) {
      this.date = normalizeDate(this.date);
    }

    if (this.isModified('time')) {
      this.time = normalizeTime(this.time);
    }

    next();
  } catch (err) {
    next(err as Error);
  }
});

export const Event: Model<EventDocument> =
  (mongoose.models.Event as Model<EventDocument>) || mongoose.model<EventDocument>('Event', EventSchema);
