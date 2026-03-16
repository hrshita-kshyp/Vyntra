# Vyntra 2026 | Predictive Health & Fitness 🚀

Vyntra is a premium, next-generation fitness intelligence platform designed for the 2026 digital ecosystem. It moves beyond simple logging to provide **Predictive AI Insights**, real-time biometric synchronization, and proactive longevity coaching.

## ✨ Core Features

- **🧠 Neural Coaching Engine**: Powered by **Groq (Llama 3.3 70B)**. Vyntra analyzes your metabolic trends in real-time to generate personalized recovery windows and workout strategies.
- **📊 Live Bio-Analytics**: High-fidelity charts tracking HRV, strain, and recovery using **Recharts**.
- **☁️ Cloud Sync (SaaS)**: Secure multi-device authentication and real-time data persistence powered by **Supabase**.
- **⚡ 2026 Aesthetics**: A state-of-the-art interface featuring glassmorphism, dynamic gradients, and micro-animations for a premium user experience.
- **🔄 Real-time Biometric Pulse**: Simulated real-world wearable data (Steps, HR, Calories) that updates dynamically and syncs to your cloud profile.

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS 4.x](https://tailwindcss.com/)
- **Intelligence**: [Groq SDK](https://groq.com/) (Llama 3.3)
- **Database/Auth**: [Supabase](https://supabase.com/)
- **Navigation**: [React Router 7](https://reactrouter.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

## 🏁 Getting Started

### 1. Requirements
Ensure you have [Node.js](https://nodejs.org/) installed.

### 2. Installation
```bash
git clone https://github.com/hrshita-kshyp/Vyntra.git
cd fitness-tracker
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory and add your credentials:
```env
VITE_GROQ_API_KEY=your_groq_api_key
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Development Launch
```bash
npm run dev
```

## 🗄️ Database Setup (Supabase)

To enable data persistence, run the following SQL in your **Supabase SQL Editor**:

```sql
-- Track live biometric snapshots
create table fitness_sessions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  steps integer,
  heart_rate integer,
  calories integer,
  recovery_hours integer,
  timestamp timestamp with time zone default now()
);

-- Log AI insights and recommendations
create table ai_logs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  content jsonb,
  model_used text,
  timestamp timestamp with time zone default now()
);
```

---
*Built for the future of human performance. Vyntra v2026.3.16*
