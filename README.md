# Self-Care Tracker 🌱

A beautiful, modern self-care tracking application built with React, TypeScript, and Supabase. Track your daily wellness habits including water intake, sleep, exercise, meditation, and mood.

## ✨ Features

- 🔐 **Secure Authentication** - Sign up and login with email/password
- 📊 **Interactive Dashboard** - View today's progress and weekly averages
- 📝 **Daily Logging** - Track water, sleep, exercise, meditation, and mood
- 📈 **Progress History** - View and edit all your past entries
- 📱 **Responsive Design** - Works perfectly on mobile and desktop
- 🎨 **Beautiful UI** - Clean, wellness-focused design with smooth animations

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ installed
- Supabase account (free at [supabase.com](https://supabase.com))

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/self-care-tracker.git
   cd self-care-tracker
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your Supabase credentials:

   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up the database**

   - Go to your Supabase project dashboard
   - Navigate to the SQL Editor
   - Run the migration script from `supabase/migrations/initial_schema.sql`

5. **Start the development server**
   ```bash
   npm run dev
   ```

Visit `http://localhost:5173` to see your app! 🎉

## 🏗️ Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Deployment**: Vercel/Netlify ready

## 🛠️ Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run typecheck    # Run TypeScript checks
npm run lint         # Run ESLint
```

## 🗄️ Database Schema

### Users Table

Managed automatically by Supabase Auth.

### Daily Logs Table

```sql
daily_logs (
  id: uuid (primary key)
  user_id: uuid (foreign key)
  date: date
  water_intake: integer
  sleep_hours: numeric
  exercise_minutes: integer
  meditation_minutes: integer
  mood: text
  notes: text
  created_at: timestamp
)
```

## 🔒 Security Features

- Row Level Security (RLS) enabled
- Users can only access their own data
- Secure authentication with Supabase Auth
- Environment variables for sensitive data

## 🎯 Future Enhancements

- 📊 Data visualization with charts
- 🔔 Reminder notifications
- 🎯 Goal setting and tracking
- 📤 Data export functionality
- 🌙 Dark mode support
- 📱 Progressive Web App (PWA)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Icons by [Lucide](https://lucide.dev)
- Images from [Unsplash](https://unsplash.com)
- Built with [Supabase](https://supabase.com)

---

Made with ❤️ for wellness and self-care
