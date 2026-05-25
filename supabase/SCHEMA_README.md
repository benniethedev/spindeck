# SpinDeck Database Schema

## Overview
This document describes the database schema for SpinDeck, a hip-hop record pool and music promotion platform.

## Tables

### `plans`
Stores subscription plans available on the platform.
- `id`: UUID primary key
- `name`: Plan name (Basic, Silver, Gold, Platinum, Mixtape, Newsletter)
- `price`: Plan price in USD
- `features`: JSONB object containing plan features
- `is_active`: Whether the plan is currently available

### `profiles`
Extended user information linked to Supabase auth.users.
- `id`: UUID (references auth.users)
- `username`: Unique username
- `full_name`: User's full name
- `avatar_url`: Profile picture URL
- `bio`: User biography
- `role`: Enum (artist, dj, admin)
- `plan_id`: Current subscription plan
- `stripe_customer_id`: Stripe customer identifier
- `stripe_subscription_id`: Stripe subscription identifier

### `tracks`
Music uploads by artists.
- `id`: UUID primary key
- `user_id`: Artist who uploaded (references auth.users)
- `title`: Track title
- `artist_name`: Artist display name
- `audio_url`: URL to audio file (S3 or Supabase storage)
- `artwork_url`: URL to cover art
- `type`: Enum (single, mixtape, video)
- `status`: Enum (pending, approved, rejected)
- `genre`: Music genre
- `bpm`: Beats per minute
- `key`: Musical key
- `duration`: Length in seconds
- `file_size`: File size in bytes
- `download_count`: Number of downloads
- `play_count`: Number of plays
- `metadata`: JSONB for additional data

### `analytics`
Event tracking for user interactions.
- `id`: UUID primary key
- `track_id`: Track being interacted with
- `user_id`: User performing the action
- `event`: Enum (play, download, email_open)
- `metadata`: JSONB for event-specific data
- `ip_address`: User's IP
- `user_agent`: Browser/client info
- `timestamp`: When event occurred

### `email_blasts`
Email campaign management.
- `id`: UUID primary key
- `track_id`: Track being promoted
- `sent_by`: Admin who sent the blast
- `subject`: Email subject line
- `body`: Email content
- `recipient_count`: Total recipients
- `sent_to`: Actual sends
- `opened_count`: Email opens
- `clicked_count`: Link clicks
- `date_sent`: When sent
- `scheduled_for`: Future send time
- `status`: Campaign status

### `downloads`
Track download history.
- `id`: UUID primary key
- `track_id`: Downloaded track
- `user_id`: User who downloaded
- `downloaded_at`: Download timestamp
- `ip_address`: User's IP
- `user_agent`: Browser/client info

## Row Level Security (RLS) Policies

### Artists
- Can view, create, and update their own tracks
- Can view analytics for their tracks
- Can view email blasts for their tracks

### DJs
- Can view all approved tracks
- Can download approved tracks
- Can view their download history

### Admins
- Full access to all tables
- Can approve/reject tracks
- Can send email blasts
- Can view all analytics

### Public Access
- Approved tracks are visible to all authenticated users

## Triggers

### `update_updated_at_column`
Automatically updates the `updated_at` timestamp when a row is modified.

### `handle_new_user`
Creates a profile entry when a new user signs up through Supabase Auth.

## Indexes
- Track lookups by user_id, status, and created_at
- Analytics queries by track_id and timestamp
- Download history by track_id and user_id

## Usage Notes

1. **Authentication**: All user authentication is handled by Supabase Auth. The `profiles` table extends the auth.users table with app-specific fields.

2. **File Storage**: Audio files and artwork should be stored in Supabase Storage or AWS S3, with URLs stored in the database.

3. **Permissions**: RLS policies ensure users can only access data they're authorized to see.

4. **Analytics**: The analytics table can track various events. Use the metadata field to store event-specific data like referrer URLs, player position for plays, etc.

5. **Email Blasts**: The email_blasts table tracks campaigns but doesn't store individual recipient data. Use a service like SendGrid or Mailchimp for actual sending.