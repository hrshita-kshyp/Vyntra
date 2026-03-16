# Vyntra 2026: Predictive Fitness SaaS

FitAI 2026 is a premium, next-generation fitness tracking platform designed for the year 2026. It leverages **Predictive AI** to provide metabolic insights, injury prevention strategies, and real-time biometric analysis.

## 🚀 Key Features
- **AI Coaching Engine**: Powered by Groq (Llama 3.3 70B) for deep biometric analysis.
- **Predictive Analytics**: Live charting of HRV (Heart Rate Variability), recovery trends, and strain levels using Recharts.
- **SaaS Foundation**: Secure User Authentication and real-time data persistence powered by Supabase.
- **2026 Aesthetics**: A futuristic, high-fidelity dark-mode dashboard with premium gradients and glassmorphism.

## 🛠️ Technology Stack
- **Frontend**: React 19, Vite, Tailwind CSS 4.x
- **Backend/Auth**: Supabase (PostgreSQL)
- **AI Logic**: Groq SDK (Llama 3.3)
- **Visualization**: Recharts
- **Icons**: Lucide React

## 📦 Getting Started

1. **Clone the repository**
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Set up Environment Variables**:
   Create a `.env` file with your keys:
   ```env
   VITE_GROQ_API_KEY=your_key
   VITE_SUPABASE_URL=your_url
   VITE_SUPABASE_ANON_KEY=your_key
   ```
4. **Run Development Server**:
   ```bash
   npm run dev
   ```

## 📜 Database Schema
Run the following in your Supabase SQL editor:
```sql
create table fitness_sessions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  steps integer,
  heart_rate integer,
  calories integer,
  recovery_hours integer,
  timestamp timestamp with time zone default now()
);

create table ai_logs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  content jsonb,
  model_used text,
  timestamp timestamp with time zone default now()
);
```
```
