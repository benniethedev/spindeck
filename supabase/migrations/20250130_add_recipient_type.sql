-- Add recipient_type column to email_blasts table
-- This allows selecting the target audience for email blasts

-- Add recipient_type column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'email_blasts' AND column_name = 'recipient_type'
    ) THEN
        ALTER TABLE email_blasts 
        ADD COLUMN recipient_type VARCHAR(50) DEFAULT 'all';
    END IF;
END $$;

-- Add comment for documentation
COMMENT ON COLUMN email_blasts.recipient_type IS 'Target audience: all, djs, artists, labels';
