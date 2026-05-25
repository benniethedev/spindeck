/**
 * Artist model definitions
 * Maps to StoreAI records with key convention "artist:<id>"
 */

export type ArtistStatus = 'pending' | 'active' | 'suspended' | 'deleted';
export type ArtistPlan = 'starter' | 'professional' | 'enterprise';

export interface Artist {
  id: string;
  key: string;
  name: string;
  email: string;
  plan: ArtistPlan;
  status: ArtistStatus;
  stripeCustomerId: string;
  stripeSubscriptionId: string;
  createdAt: string;
  updatedAt: string;
  submissionCount: number;
  isActive: boolean;
}

export function createArtistRecord(
  name: string,
  email: string,
  plan: ArtistPlan = 'starter'
): Omit<Artist, 'id' | 'key' | 'createdAt' | 'updatedAt'> {
  const now = new Date().toISOString();
  return {
    name,
    email,
    plan,
    status: 'active',
    stripeCustomerId: '',
    stripeSubscriptionId: '',
    submissionCount: 0,
    isActive: true,
  };
}
