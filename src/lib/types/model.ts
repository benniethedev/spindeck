/**
 * SpinRec Data Models
 *
 * Record key convention: "<type>:<uuid>"
 * Examples: artist:a1b2c3d4, track:e5f6g7h8, purchase:i9j0k1l2
 *
 * StoreAI is schemaless — these types define the expected data shape
 * for application-level consistency. Each record's `data` field stores
 * the typed object; the `key` field uses the convention above.
 */

// ---------------------------------------------------------------------------
// Shared / Base
// ---------------------------------------------------------------------------

export interface BaseEntity {
  createdAt: string; // ISO-8601
  updatedAt: string; // ISO-8601
}

export type Status =
  | "pending"
  | "approved"
  | "rejected"
  | "active"
  | "archived"
  | "completed"
  | "cancelled"
  | "draft"
  | "scheduled"
  | "sending"
  | "sent"
  | "failed"
  | "refunded";

export type Genre =
  | "hip-hop"
  | "rnb"
  | "afrobeats"
  | "dancehall"
  | "grime"
  | "drill"
  | "house"
  | "techno"
  | "pop"
  | "latin"
  | "karaoke"
  | "boom-bap"
  | "trap"
  | "lo-fi"
  | "alt-rnb"
  | "other";

// ---------------------------------------------------------------------------
// Artist
// ---------------------------------------------------------------------------

export interface Artist extends BaseEntity {
  name: string;
  slug: string; // URL-friendly, e.g. "drake"
  genre: Genre[];
  bio: string;
  avatarUrl: string | null;
  verified: boolean; // Madu-verifed artist badge
  socialLinks: {
    instagram?: string;
    twitter?: string;
    youtube?: string;
    tiktok?: string;
    spotify?: string;
    website?: string;
  };
  contactEmail: string;
  contactPhone: string | null;
  status: Status; // active, archived
  totalEarnings: number; // in cents
  tracksApproved: number;
  tracksSubmitted: number;
  lastSubmissionDate: string | null;
}

export const ARTIST_KEY = (id: string) => `artist:${id}`;

// ---------------------------------------------------------------------------
// DJ
// ---------------------------------------------------------------------------

export interface DJ extends BaseEntity {
  name: string;
  slug: string;
  genre: Genre[];
  bio: string;
  avatarUrl: string | null;
  station: string | null; // radio station or platform
  city: string | null;
  country: string | null;
  socialLinks: {
    instagram?: string;
    twitter?: string;
    youtube?: string;
    tiktok?: string;
    soundcloud?: string;
    mixcloud?: string;
  };
  email: string;
  status: Status; // active, archived
  downloadCount: number;
  lastDownloadedAt: string | null;
  optedIn: boolean; // consent to receive tracks
  subscribedGenres: Genre[];
}

export const DJ_KEY = (id: string) => `dj:${id}`;

// ---------------------------------------------------------------------------
// Track / Submission
// ---------------------------------------------------------------------------

export interface Track extends BaseEntity {
  title: string;
  slug: string;
  artistId: string; // artist:<uuid>
  artistName: string; // denormalized for DJ list view
  genre: Genre[];
  bpm: number | null;
  key: string | null; // musical key, e.g. "Am", "Cm"
  mood: string[]; // tags: "chill", "energetic", "dark", etc.
  description: string | null;

  // File references (StoreAI storage)
  audioFileUrl: string | null;   // preview / full audio
  artworkFileUrl: string | null;  // cover art
  stemFilesUrl: string[] | null;  // optional stems/multitracks

  // Approval workflow
  status: Status; // pending, approved, rejected, archived

  // Admin metadata
  reviewedBy: string | null;    // admin ID who reviewed
  reviewedAt: string | null;    // ISO-8601
  rejectionReason: string | null;

  // DJ pool exposure
  availableToDJs: boolean;
  publishedAt: string | null;   // when approved & published to DJ pool
}

export const TRACK_KEY = (id: string) => `track:${id}`;

// ---------------------------------------------------------------------------
// Purchase
// ---------------------------------------------------------------------------

export interface Purchase extends BaseEntity {
  stripePaymentId: string; // payment_intent or checkout session ID
  stripeCustomerId: string;
  amount: number; // in cents
  currency: string; // "usd", "gbp", etc.
  type: "subscription" | "one-time" | "bundle";
  status: Status; // completed, cancelled, refunded, pending
  recipientId: string; // dj:<uuid> or artist:<uuid> depending on type
  recipientType: "dj" | "artist";
  items: PurchaseItem[];
  metadata: Record<string, unknown>;
}

export interface PurchaseItem {
  description: string;
  amount: number; // in cents
  quantity: number;
  metadata?: Record<string, unknown>;
}

export const PURCHASE_KEY = (id: string) => `purchase:${id}`;

// ---------------------------------------------------------------------------
// Campaign (Email Blast)
// ---------------------------------------------------------------------------

export interface Campaign extends BaseEntity {
  name: string;
  subject: string;
  previewText: string | null;
  bodyHtml: string; // rich text / template-based
  status: Status; // draft, scheduled, sending, sent, failed
  scheduledAt: string | null; // ISO-8601
  sentAt: string | null; // ISO-8601

  // Targeting
  targetGenres: Genre[];
  targetCity: string | null;
  targetCountry: string | null;
  targetAllDJs: boolean; // if true, ignore filters

  // Track promotion
  trackIds: string[]; // track:<uuid>
  featuredTrackId: string | null;

  // Results
  totalRecipients: number;
  deliveredCount: number;
  openedCount: number;
  clickedCount: number;
  bounceCount: number;

  // Metadata
  createdById: string; // admin ID
}

export const CAMPAIGN_KEY = (id: string) => `campaign:${id}`;

// ---------------------------------------------------------------------------
// Search / List Helpers
// ---------------------------------------------------------------------------

/**
 * Record key type union — used by the StoreAI layer to know what
 * type of record is being created / queried.
 */
export type RecordType =
  | "artist"
  | "dj"
  | "track"
  | "purchase"
  | "campaign";

/**
 * All possible StoreAI record data shapes.
 */
export type RecordData = Artist | DJ | Track | Purchase | Campaign;

// ---------------------------------------------------------------------------
// Helper: cast StoreAI unknown data to typed entity
// ---------------------------------------------------------------------------

/**
 * Cast a StoreAI record's data field to a typed entity.
 * StoreAI stores schemaless JSON, so we use `as unknown as` to bypass
 * TypeScript's structural type checking at compile time.
 * The data shape is enforced at runtime by the schema definition above.
 */
export function asEntity<T extends BaseEntity>(
  data: Record<string, unknown>,
  id: string,
): T {
  return { ...data, id } as unknown as T;
}
