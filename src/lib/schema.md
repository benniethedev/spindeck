# SpinRec — StoreAI Data Model Schema

> **Storage backend:** StoreAI (schemaless JSON records)
> **Base URL:** `https://db.netswagger.com`
> **Project ID:** `9291cb92-5d6b-4e65-b812-fb6f90f60c45`

---

## Record Key Convention

All records use a `<type>:<id>` key format for easy filtering and identification.

| Entity    | Key Format       | Example                      |
|-----------|------------------|------------------------------|
| Artist    | `artist:<uuid>`  | `artist:550e8400-e29b-41d4` |
| DJ        | `dj:<uuid>`      | `dj:660e8400-e29b-41d4`     |
| Track     | `track:<uuid>`   | `track:770e8400-e29b-41d4`  |
| Purchase  | `purchase:<uuid>`| `purchase:880e8400-e29b-41d4`|
| Campaign  | `campaign:<uuid>`| `campaign:990e8400-e29b-41d4`|

---

## Entity Definitions

### 1. Artist

Artist records represent musicians on the platform. Madu (admin) creates these, or artists self-onboard.

```typescript
interface Artist {
  // Identity
  name: string;
  slug: string;           // URL-friendly: "drake", "burna-boy"
  avatarUrl: string | null;
  bio: string;

  // Classification
  genre: Genre[];         // see Genre type below

  // Contact
  contactEmail: string;
  contactPhone: string | null;

  // Social
  socialLinks: {
    instagram?: string;
    twitter?: string;
    youtube?: string;
    tiktok?: string;
    spotify?: string;
    website?: string;
  };

  // Status
  verified: boolean;
  status: "pending" | "approved" | "rejected" | "active" | "archived" | "completed" | "cancelled";

  // Analytics
  totalEarnings: number;       // in cents
  tracksApproved: number;
  tracksSubmitted: number;
  lastSubmissionDate: string | null;

  // System
  createdAt: string;
  updatedAt: string;
}
```

### 2. DJ

DJ records represent curated DJ pool members who receive and download tracks.

```typescript
interface DJ {
  // Identity
  name: string;
  slug: string;
  avatarUrl: string | null;
  bio: string;

  // Classification
  genre: Genre[];
  subscribedGenres: Genre[];  // which genres they want to receive

  // Location
  station: string | null;
  city: string | null;
  country: string | null;

  // Contact
  email: string;
  optedIn: boolean;  // consent to receive marketing

  // Social
  socialLinks: {
    instagram?: string;
    twitter?: string;
    youtube?: string;
    tiktok?: string;
    soundcloud?: string;
    mixcloud?: string;
  };

  // Status
  status: "pending" | "approved" | "rejected" | "active" | "archived" | "completed" | "cancelled";

  // Analytics
  downloadCount: number;
  lastDownloadedAt: string | null;

  // System
  createdAt: string;
  updatedAt: string;
}
```

### 3. Track (Submission)

Track records represent music submissions from artists. They go through an approval workflow before being available to the DJ pool.

**Approval Flow:**
```
submitted → pending → (admin review) → approved → available to DJs
                              ↘ rejected
```

```typescript
interface Track {
  // Identity
  title: string;
  slug: string;
  artistId: string;      // artist:<uuid>
  artistName: string;    // denormalized for DJ list view

  // Classification
  genre: Genre[];
  bpm: number | null;
  key: string | null;    // musical key (Am, C, etc.)
  mood: string[];        // tags: "chill", "energetic", "dark"
  description: string | null;

  // File URLs (StoreAI storage)
  audioFileUrl: string | null;
  artworkFileUrl: string | null;
  stemFilesUrl: string[] | null;

  // Approval status
  status: "pending" | "approved" | "rejected" | "archived";
  reviewedBy: string | null;    // admin ID
  reviewedAt: string | null;
  rejectionReason: string | null;

  // DJ pool exposure
  availableToDJs: boolean;
  publishedAt: string | null;

  // System
  createdAt: string;
  updatedAt: string;
}
```

### 4. Purchase

Purchase records track all payments via Stripe. Supports subscriptions, one-off downloads, and bundles.

```typescript
interface Purchase {
  // Stripe integration
  stripePaymentId: string;  // payment_intent ID
  stripeCustomerId: string;

  // Amount
  amount: number;           // in cents
  currency: string;         // "usd", "gbp", etc.

  // Type
  type: "subscription" | "one-time" | "bundle";
  status: "pending" | "approved" | "rejected" | "active" | "archived" | "completed" | "cancelled";

  // Recipient
  recipientId: string;      // dj:<uuid> or artist:<uuid>
  recipientType: "dj" | "artist";

  // Line items
  items: PurchaseItem[];

  // Metadata
  metadata: Record<string, unknown>;

  // System
  createdAt: string;
  updatedAt: string;
}

interface PurchaseItem {
  description: string;
  amount: number;
  quantity: number;
  metadata?: Record<string, unknown>;
}
```

### 5. Campaign (Email Blast)

Campaign records represent email blasts sent to the DJ pool. Each campaign promotes specific tracks.

```typescript
interface Campaign {
  // Content
  name: string;
  subject: string;
  previewText: string | null;
  bodyHtml: string;  // rich HTML template

  // Status
  status: "pending" | "approved" | "rejected" | "active" | "archived" | "completed" | "cancelled";

  // Timing
  scheduledAt: string | null;
  sentAt: string | null;

  // Targeting
  targetGenres: Genre[];
  targetCity: string | null;
  targetCountry: string | null;
  targetAllDJs: boolean;

  // Promoted tracks
  trackIds: string[];
  featuredTrackId: string | null;

  // Results
  totalRecipients: number;
  deliveredCount: number;
  openedCount: number;
  clickedCount: number;
  bounceCount: number;

  // Metadata
  createdById: string;  // admin ID

  // System
  createdAt: string;
  updatedAt: string;
}
```

---

## Genre Type

```typescript
type Genre =
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
```

---

## Status Type

```typescript
type Status =
  | "pending"
  | "approved"
  | "rejected"
  | "active"
  | "archived"
  | "completed"
  | "cancelled";
```

---

## User Flow Mapping

### 1. Artist Submission Flow
```
Artist Dashboard → createTrack() [status: pending]
  → Admin reviews in Admin Dashboard
  → approveTrack() or rejectTrack()
  → approved tracks appear in DJ Pool
```

### 2. DJ Download Flow
```
DJ Portal → browseAvailableTracks() → getTrack() → download audio
  → incrementDownloadCount(djSlug)
```

### 3. Purchase Flow
```
Stripe Payment Succeeded → handleStripeEvent() [event: payment_succeeded]
  → update purchase status to "completed"
  → grant DJ access / credit to artist
```

### 4. Email Blast Flow
```
Admin Dashboard → createCampaign() [status: draft]
  → updateCampaign() to add tracks & target
  → scheduleCampaign() [status: scheduled]
  → sendCampaign() → markCampaignSent() [status: sent]
  → track metrics in real-time
```

---

## File Storage

StoreAI `/api/files` endpoint handles:
- `audioFileUrl` — track audio files (WAV/MP3)
- `artworkFileUrl` — track cover art (PNG/JPG)
- `stemFilesUrl[]` — optional stem/multitrack files
- `avatarUrl[]` — artist/DJ profile avatars

Files are stored as objects in StoreAI and accessed via their URL.
