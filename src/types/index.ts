/**
 * SpinRec Data Models
 * Core types for the platform — Tasks 2, 6
 */

// --- Enums ---
export type SubmissionStatus = 'pending' | 'approved' | 'rejected' | 'in_campaign';

export type ContentRating = 'clean' | 'explicit';

export type ArtistPlan = 'free' | 'starter' | 'professional' | 'enterprise';

export type SubmissionGenre =
  | 'house'
  | 'tech_house'
  | 'techno'
  | 'drum_and_bass'
  | 'ambient'
  | 'lo_fi'
  | 'hip_hop'
  | 'rnb'
  | 'pop'
  | 'afrobeats'
  | 'afro_house'
  | 'progressive_house'
  | 'trance'
  | 'dubstep'
  | 'industrial'
  | 'other';

// --- Interfaces ---
export interface Artist {
  id: string;
  email: string;
  name: string;
  plan: ArtistPlan;
  stripeCustomerId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Submission {
  id: string;
  key: string;
  artistId: string;
  artistName: string;
  trackName: string;
  genre: SubmissionGenre;
  bpm: number;
  rating: ContentRating;
  isClean: boolean;
  status: SubmissionStatus;
  audioFileUrl?: string;
  artworkUrl?: string;
  links: SubmissionLink[];
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface SubmissionLink {
  label: string;
  url: string;
}

export interface SubmissionListItem extends Submission {
  duration?: number;
}

// --- UI States ---
export type AuthState = {
  user: Artist | null;
  loading: boolean;
};

// --- Submission form schema ---
export interface SubmissionFormData {
  trackName: string;
  genre: SubmissionGenre | '';
  bpm: string;
  key: string;
  rating: ContentRating;
  links: { label: string; url: string }[];
  notes: string;
}

// --- Validation errors ---
export interface FormErrors {
  [key: string]: string;
}
