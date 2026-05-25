# PressBase API Reference for SpinRec

**Project:** spinrec
**API Base URL:** https://backend.benbond.dev/wp-json/app/v1
**Service Key:** pb_sk_spinrec_b2b503fc2ccaa5c12d9bcbc17df9920b6d5b003fb0ddacd7

## Authentication

All authenticated requests require: `Authorization: Bearer {token}`

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /auth/register | Register new user |
| POST | /auth/login | Login, returns tokens |
| POST | /auth/refresh | Refresh tokens |
| POST | /auth/logout | Invalidate token |
| GET | /auth/me | Get current user |
| PATCH | /auth/me | Update profile |

## Database (Collections)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /db/{collection} | Query records |
| POST | /db/{collection} | Insert record |
| GET | /db/{collection}/{id} | Get single record |
| PATCH | /db/{collection}/{id} | Update record |
| DELETE | /db/{collection}/{id} | Delete record |

**Query params:** `where`, `order`, `limit`, `offset`, `select`

## Schema Management (Service Key Required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /schema | List collections |
| POST | /schema | Create collection |
| POST | /schema/{name}/migrate | Add fields |

## File Storage

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /files/upload | Upload file (multipart) |
| GET | /files/{id}/signed-url | Get signed URL |
| DELETE | /files/{id} | Delete file |

## Collections Needed

```json
// profiles
{
  "username": "VARCHAR(50)",
  "full_name": "VARCHAR(255)",
  "avatar_url": "TEXT",
  "bio": "TEXT",
  "role": "VARCHAR(20)",
  "plan_id": "VARCHAR(50)",
  "stripe_customer_id": "VARCHAR(255)",
  "stripe_subscription_id": "VARCHAR(255)"
}

// plans
{
  "name": "VARCHAR(50)",
  "price": "DECIMAL(10,2)",
  "features": "JSON",
  "is_active": "BOOLEAN"
}

// tracks
{
  "title": "VARCHAR(255)",
  "artist_name": "VARCHAR(255)",
  "audio_url": "TEXT",
  "artwork_url": "TEXT",
  "type": "VARCHAR(20)",
  "status": "VARCHAR(20)",
  "genre": "VARCHAR(100)",
  "bpm": "INT",
  "key": "VARCHAR(10)",
  "duration": "INT",
  "file_size": "BIGINT",
  "download_count": "INT",
  "play_count": "INT",
  "metadata": "JSON"
}

// analytics
{
  "track_id": "VARCHAR(50)",
  "event": "VARCHAR(50)",
  "metadata": "JSON",
  "ip_address": "VARCHAR(50)",
  "user_agent": "TEXT"
}

// email_blasts
{
  "track_id": "VARCHAR(50)",
  "subject": "VARCHAR(255)",
  "body": "TEXT",
  "recipient_count": "INT",
  "status": "VARCHAR(50)",
  "scheduled_for": "DATETIME"
}

// downloads
{
  "track_id": "VARCHAR(50)",
  "ip_address": "VARCHAR(50)",
  "user_agent": "TEXT"
}
```
