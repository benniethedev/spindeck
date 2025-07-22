-- Temporarily disable RLS for debugging (re-enable after testing)
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE tracks DISABLE ROW LEVEL SECURITY;
ALTER TABLE analytics DISABLE ROW LEVEL SECURITY;
ALTER TABLE email_blasts DISABLE ROW LEVEL SECURITY;
ALTER TABLE downloads DISABLE ROW LEVEL SECURITY;

-- Make plans table readable by everyone
CREATE POLICY "Plans are public" ON plans FOR SELECT USING (true);

-- Add some test data for debugging
INSERT INTO tracks (user_id, title, artist_name, audio_url, status, genre) VALUES
('11d020cc-be18-45b1-bc6f-9b7ed1e9fa2c', 'Test Track 1', 'Test Artist', '/test-audio.mp3', 'approved', 'Hip-Hop'),
('11d020cc-be18-45b1-bc6f-9b7ed1e9fa2c', 'Test Track 2', 'Test Artist', '/test-audio2.mp3', 'pending', 'R&B')
ON CONFLICT DO NOTHING;