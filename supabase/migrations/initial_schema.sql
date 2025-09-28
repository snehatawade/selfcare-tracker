/*
  # Self-Care Tracker Initial Schema

  1. New Tables
    - `daily_logs`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `date` (date, unique per user)
      - `water_intake` (integer, glasses of water)
      - `sleep_hours` (decimal, hours of sleep)
      - `exercise_minutes` (integer, minutes of exercise)
      - `meditation_minutes` (integer, minutes of meditation)
      - `mood` (text, mood rating)
      - `notes` (text, optional daily notes)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `daily_logs` table
    - Add policies for authenticated users to CRUD their own logs only

  3. Indexes
    - Add index on user_id and date for efficient querying


CREATE TABLE IF NOT EXISTS daily_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date date NOT NULL,
  water_intake integer DEFAULT 0,
  sleep_hours decimal(3,1) DEFAULT 0,
  exercise_minutes integer DEFAULT 0,
  meditation_minutes integer DEFAULT 0,
  mood text DEFAULT 'okay' CHECK (mood IN ('excellent', 'good', 'okay', 'stressed', 'sad')),
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, date)
);

-- Enable RLS
ALTER TABLE daily_logs ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own logs"
  ON daily_logs
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own logs"
  ON daily_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own logs"
  ON daily_logs
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own logs"
  ON daily_logs
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS daily_logs_user_id_date_idx ON daily_logs(user_id, date DESC);
CREATE INDEX IF NOT EXISTS daily_logs_created_at_idx ON daily_logs(created_at DESC);

*/