export interface User {
  id: string;
  email: string;
  name: string;
  created_at: string;
}

export interface DailyLog {
  id: string;
  user_id: string;
  date: string;
  water_intake: number;
  sleep_hours: number;
  exercise_minutes: number;
  meditation_minutes: number;
  mood: 'excellent' | 'good' | 'okay' | 'stressed' | 'sad';
  notes: string;
  created_at: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
}