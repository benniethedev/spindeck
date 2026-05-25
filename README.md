# SpinDeck - Where Music Meets the Industry

SpinDeck is a premier multi-genre record pool and music promotion platform connecting artists with DJs, labels, and media worldwide. Built with Next.js, Supabase, and Stripe for a complete music industry solution.

## 🎵 Features

- **Multi-Genre Support**: Hip-hop, R&B, pop, electronic, and more
- **Artist Promotion**: Upload tracks and reach thousands of industry professionals
- **DJ Pool Access**: Exclusive tracks, mixtapes, and remixes
- **Email Campaigns**: Targeted promotional blasts
- **Analytics Dashboard**: Track performance and engagement
- **Subscription Plans**: Flexible pricing for all artist levels
- **Admin Panel**: Track approval and user management

## 🚀 Tech Stack

- **Frontend**: Next.js 14 with React
- **Styling**: Tailwind CSS with DaisyUI components
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Payments**: Stripe
- **Email**: Resend
- **Hosting**: Vercel
- **File Storage**: Supabase Storage (or AWS S3)

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/spindeck.git
cd spindeck
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Copy `.env.local` and fill in your credentials:
```bash
cp .env.local.example .env.local
```

4. Set up the database:
Run the Supabase migration:
```sql
-- Execute the contents of supabase/migrations/001_spindeck_schema.sql
-- in your Supabase SQL editor
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🔑 Environment Variables

Required environment variables (see `.env.local` for complete list):

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret

# Email
RESEND_API_KEY=your_resend_api_key
```

## 📋 Database Schema

SpinDeck uses a comprehensive database schema with:

- **Users & Profiles**: Extended user management with roles (artist, dj, admin)
- **Plans**: Subscription plans with features and pricing
- **Tracks**: Music uploads with metadata and approval workflow
- **Analytics**: Event tracking for plays, downloads, and engagement
- **Email Blasts**: Campaign management and tracking
- **Downloads**: DJ download history and access control

See `supabase/SCHEMA_README.md` for detailed documentation.

## 🎨 Design System

- **Colors**: 
  - Primary: #FF3C3C (SpinDeck Red)
  - Background: #000000 (Black)
  - Cards: #1A1A1A (Dark Gray)
  - Text: #FFFFFF (White) / #CCCCCC (Gray)
- **Typography**: Inter font family
- **Theme**: Custom "spindeck" DaisyUI theme

## 📱 Pages & Features

### Public Pages
- **Homepage**: Hero, features, stats, and call-to-action
- **Pricing**: 6-tier subscription plans with FAQ
- **Authentication**: Sign up/login with role selection

### Artist Dashboard
- Track upload with metadata
- Analytics and performance tracking
- Subscription management
- Email blast history

### DJ Dashboard
- Browse and download approved tracks
- Filter by genre, BPM, key
- Download history
- Access controls

### Admin Panel
- User management
- Track approval workflow
- Email blast management
- Platform analytics

## 🚀 Deployment

### Vercel Deployment

1. Push your code to GitHub
2. Connect your GitHub repo to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically on push to main branch

### Environment Setup for Production

1. **Supabase**: Set up production database
2. **Stripe**: Configure production webhooks
3. **Domain**: Configure custom domain in Vercel
4. **Email**: Set up production email sending

## 🔧 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Database Migrations

When making database changes:

1. Update the schema in `supabase/migrations/`
2. Test locally first
3. Apply to production via Supabase dashboard

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email support@spindeck.com or create an issue in this repository.

---

Built with ❤️ for the music industry