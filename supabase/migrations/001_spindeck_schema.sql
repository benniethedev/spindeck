-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE user_role AS ENUM ('artist', 'dj', 'admin');
CREATE TYPE track_type AS ENUM ('single', 'mixtape', 'video');
CREATE TYPE track_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE analytics_event AS ENUM ('play', 'download', 'email_open');

-- Create plans table
CREATE TABLE plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) NOT NULL UNIQUE,
    price DECIMAL(10, 2) NOT NULL,
    features JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Note: We don't modify auth.users directly in Supabase
-- All custom fields are handled in the profiles table

-- Create profiles table to store additional user data
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username VARCHAR(50) UNIQUE,
    full_name VARCHAR(255),
    avatar_url TEXT,
    bio TEXT,
    role user_role DEFAULT 'artist',
    plan_id UUID REFERENCES plans(id),
    stripe_customer_id VARCHAR(255),
    stripe_subscription_id VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create tracks table
CREATE TABLE tracks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    artist_name VARCHAR(255),
    audio_url TEXT NOT NULL,
    artwork_url TEXT,
    type track_type NOT NULL DEFAULT 'single',
    status track_status DEFAULT 'pending',
    genre VARCHAR(100),
    bpm INTEGER,
    key VARCHAR(10),
    duration INTEGER, -- in seconds
    file_size BIGINT, -- in bytes
    download_count INTEGER DEFAULT 0,
    play_count INTEGER DEFAULT 0,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create analytics table
CREATE TABLE analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    track_id UUID REFERENCES tracks(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    event analytics_event NOT NULL,
    metadata JSONB DEFAULT '{}',
    ip_address INET,
    user_agent TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create email_blasts table
CREATE TABLE email_blasts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    track_id UUID REFERENCES tracks(id) ON DELETE CASCADE,
    sent_by UUID REFERENCES auth.users(id),
    subject VARCHAR(255) NOT NULL,
    body TEXT,
    recipient_count INTEGER DEFAULT 0,
    sent_to INTEGER DEFAULT 0,
    opened_count INTEGER DEFAULT 0,
    clicked_count INTEGER DEFAULT 0,
    date_sent TIMESTAMP WITH TIME ZONE,
    scheduled_for TIMESTAMP WITH TIME ZONE,
    status VARCHAR(50) DEFAULT 'draft',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create downloads table to track DJ downloads
CREATE TABLE downloads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    track_id UUID REFERENCES tracks(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    downloaded_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    ip_address INET,
    user_agent TEXT
);

-- Insert default plans
INSERT INTO plans (name, price, features) VALUES
    ('Basic', 29.99, '{"tracks_per_month": 2, "email_blasts": 1, "analytics": false, "priority_support": false}'),
    ('Silver', 200.00, '{"tracks_per_month": 10, "email_blasts": 5, "analytics": true, "priority_support": false}'),
    ('Gold', 800.00, '{"tracks_per_month": 50, "email_blasts": 20, "analytics": true, "priority_support": true, "featured_placement": true}'),
    ('Platinum', 2000.00, '{"tracks_per_month": "unlimited", "email_blasts": "unlimited", "analytics": true, "priority_support": true, "featured_placement": true, "dedicated_manager": true}'),
    ('Mixtape', 200.00, '{"mixtape_upload": true, "email_blasts": 5, "analytics": true, "duration": "one_time"}'),
    ('Newsletter', 200.00, '{"newsletter_blast": true, "recipient_count": 10000, "duration": "one_time"}');

-- Create indexes for performance
CREATE INDEX idx_tracks_user_id ON tracks(user_id);
CREATE INDEX idx_tracks_status ON tracks(status);
CREATE INDEX idx_tracks_created_at ON tracks(created_at DESC);
CREATE INDEX idx_analytics_track_id ON analytics(track_id);
CREATE INDEX idx_analytics_timestamp ON analytics(timestamp DESC);
CREATE INDEX idx_downloads_track_id ON downloads(track_id);
CREATE INDEX idx_downloads_user_id ON downloads(user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc', NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_plans_updated_at BEFORE UPDATE ON plans
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tracks_updated_at BEFORE UPDATE ON tracks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_email_blasts_updated_at BEFORE UPDATE ON email_blasts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create RLS policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_blasts ENABLE ROW LEVEL SECURITY;
ALTER TABLE downloads ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    );

-- Tracks policies
CREATE POLICY "Artists can view their own tracks" ON tracks
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Artists can insert their own tracks" ON tracks
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Artists can update their own tracks" ON tracks
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Approved tracks are public" ON tracks
    FOR SELECT USING (status = 'approved');

CREATE POLICY "Admins can manage all tracks" ON tracks
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    );

-- Analytics policies
CREATE POLICY "Users can view analytics for their tracks" ON analytics
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM tracks
            WHERE tracks.id = analytics.track_id AND tracks.user_id = auth.uid()
        )
    );

CREATE POLICY "System can insert analytics" ON analytics
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view all analytics" ON analytics
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    );

-- Email blasts policies
CREATE POLICY "Admins can manage email blasts" ON email_blasts
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    );

CREATE POLICY "Artists can view email blasts for their tracks" ON email_blasts
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM tracks
            WHERE tracks.id = email_blasts.track_id AND tracks.user_id = auth.uid()
        )
    );

-- Downloads policies
CREATE POLICY "DJs can download approved tracks" ON downloads
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid() AND profiles.role = 'dj'
        ) AND EXISTS (
            SELECT 1 FROM tracks
            WHERE tracks.id = downloads.track_id AND tracks.status = 'approved'
        )
    );

CREATE POLICY "Users can view their download history" ON downloads
    FOR SELECT USING (auth.uid() = user_id);

-- Create function to handle new user creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, role)
    VALUES (NEW.id, 'artist');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();