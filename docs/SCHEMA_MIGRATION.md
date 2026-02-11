# SpinRec Schema Migration

This document outlines the database schema changes needed for the auth overhaul and artist features.

## Required Schema Updates

### 1. Update `profiles` Collection

Add the following fields to the existing `profiles` collection:

```bash
# Using PressBase API (with service key)
curl -X POST "https://backend.benbond.dev/wp-json/app/v1/schema/profiles/migrate" \
  -H "Authorization: Bearer pb_sk_spinrec_..." \
  -H "Content-Type: application/json" \
  -d '{
    "fields": {
      "profile_slug": "VARCHAR(100) UNIQUE",
      "bio": "TEXT",
      "social_links": "JSON",
      "email_verified": "BOOLEAN DEFAULT false",
      "verification_token": "VARCHAR(64)",
      "verification_token_expires": "DATETIME",
      "reset_token": "VARCHAR(64)",
      "reset_token_expires": "DATETIME"
    }
  }'
```

### 2. Create `track_feedback` Collection

```bash
curl -X POST "https://backend.benbond.dev/wp-json/app/v1/schema" \
  -H "Authorization: Bearer pb_sk_spinrec_..." \
  -H "Content-Type: application/json" \
  -d '{
    "name": "track_feedback",
    "fields": {
      "track_id": "VARCHAR(50) NOT NULL",
      "user_id": "VARCHAR(50) NOT NULL",
      "rating": "INT NOT NULL",
      "comment": "TEXT",
      "created_at": "DATETIME DEFAULT CURRENT_TIMESTAMP",
      "updated_at": "DATETIME"
    },
    "indexes": [
      {
        "columns": ["track_id", "user_id"],
        "unique": true
      },
      {
        "columns": ["track_id"]
      }
    ]
  }'
```

## Updated Schema Reference

### profiles
```json
{
  "owner_user_id": "VARCHAR(50) NOT NULL",      // PressBase built-in
  "username": "VARCHAR(50)",
  "full_name": "VARCHAR(255)",
  "avatar_url": "TEXT",
  "bio": "TEXT",                                 // NEW
  "role": "VARCHAR(20)",                         // artist | dj | admin
  "profile_slug": "VARCHAR(100) UNIQUE",         // NEW - for /artist/[slug]
  "social_links": "JSON",                        // NEW - {instagram, twitter, etc}
  "plan_id": "VARCHAR(50)",
  "customer_id": "VARCHAR(255)",
  "stripe_subscription_id": "VARCHAR(255)",
  "email_verified": "BOOLEAN DEFAULT false",     // NEW
  "verification_token": "VARCHAR(64)",           // NEW
  "verification_token_expires": "DATETIME",      // NEW
  "reset_token": "VARCHAR(64)",                  // NEW
  "reset_token_expires": "DATETIME"              // NEW
}
```

### track_feedback (NEW)
```json
{
  "track_id": "VARCHAR(50) NOT NULL",
  "user_id": "VARCHAR(50) NOT NULL",
  "rating": "INT NOT NULL",                      // 1-5
  "comment": "TEXT",
  "created_at": "DATETIME DEFAULT CURRENT_TIMESTAMP",
  "updated_at": "DATETIME"
}
```

## Environment Variables

Make sure these are set in `.env.local`:

```env
# Required for email verification
NEXT_PUBLIC_SITE_URL=https://spinrec.com

# Admin emails (comma-separated)
ADMIN_EMAILS=admin@spinrec.com,ben@example.com

# Resend API Key (for verification emails)
RESEND_API_KEY=re_xxx...

# PressBase
NEXT_PUBLIC_PRESSBASE_URL=https://backend.benbond.dev/wp-json/app/v1
PRESSBASE_SERVICE_KEY=pb_sk_spinrec_...
```

## Upload Limits by Plan

Defined in `config.js`:

| Plan | Tracks/Month |
|------|-------------|
| Free | 0 |
| Basic | 2 |
| Silver | 10 |
| Gold | 50 |
| Platinum | Unlimited |

## New Pages & Routes

### Pages Created
- `/signup` - Registration with role selection
- `/signin` - Simplified email/password login
- `/forgot-password` - Password reset request
- `/reset-password/[token]` - Password reset form
- `/verify-email/[token]` - Email verification
- `/artist/[slug]` - Public artist profile

### API Routes Created
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/verify-email` - Verify email token
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token
- `GET/POST /api/feedback` - Track feedback system
- `GET /api/upload` - Get upload limits

## Components Created
- `RoleSelector.js` - Artist/DJ role picker for signup
- `ArtistTrackList.js` - Track list with feedback for artist profiles
