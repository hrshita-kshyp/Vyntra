<div align="center">

<br/>

```
 ██╗   ██╗██╗   ██╗███╗   ██╗████████╗██████╗  █████╗
 ██║   ██║╚██╗ ██╔╝████╗  ██║╚══██╔══╝██╔══██╗██╔══██╗
 ██║   ██║ ╚████╔╝ ██╔██╗ ██║   ██║   ██████╔╝███████║
 ╚██╗ ██╔╝  ╚██╔╝  ██║╚██╗██║   ██║   ██╔══██╗██╔══██║
  ╚████╔╝    ██║   ██║ ╚████║   ██║   ██║  ██║██║  ██║
   ╚═══╝     ╚═╝   ╚═╝  ╚═══╝   ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝
```

**Know your body. Not just your steps.**

[![Live Demo](https://img.shields.io/badge/live_demo-vyntra--delta.vercel.app-black?style=flat-square&logo=vercel)](https://vyntra-delta.vercel.app)
![Status](https://img.shields.io/badge/status-active_development-6C63FF?style=flat-square)
![React](https://img.shields.io/badge/React_19-20232A?style=flat-square&logo=react&logoColor=61DAFB)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat-square&logo=supabase&logoColor=white)
![Groq](https://img.shields.io/badge/Groq_Llama_3.3-FF6B35?style=flat-square)

</div>

---

## What is Vyntra?

Most fitness apps count your steps. Vyntra tells you **what they mean**.

Vyntra is a predictive health intelligence platform that ingests your real biometric data — from Google Fit, wearables, and manual input — and transforms it into a single, actionable number: your **BioAge Score**. Not your calendar age. Your biological age, based on HRV, sleep, recovery, strain, and activity trends.

Built for people who want to optimize, not just track.

---

## ✨ Current Features

- 🧠 **Neural Coaching Engine** — AI-generated recovery windows and workout strategies via Groq (Llama 3.3 70B)
- 📊 **Live Bio-Analytics** — HRV, strain, and recovery charts powered by Recharts
- ☁️ **Cloud Sync** — Multi-device auth and real-time data persistence via Supabase
- ⚡ **Premium UI** — Glassmorphism, dynamic gradients, and micro-animations
- 🔄 **Real-time Biometric Pulse** — Simulated wearable data: Steps, HR, Calories

---

## 🗺️ Roadmap

Vyntra is being built in public, in phases.

### Phase 1 — Core Product *(in progress)*
> Making it real.

- [ ] **Google Fit OAuth2** — pull actual biometric data from your account
- [ ] **BioAge Score Algorithm** — proprietary scoring based on HRV, sleep, recovery, and strain trends
- [ ] **Premium UI Overhaul** — dark-first, animated data reveals, interactive charts
- [ ] **Stripe Integration** — paid tiers, subscription management

### Phase 2 — Sticky Features
> Making it indispensable.

- [ ] **AI Why Engine** — explains correlations ("Your BioAge rose 2 points because your sleep efficiency dropped")
- [ ] **PDF Monthly Report** — downloadable health summary with trends and recommendations
- [ ] **Readiness Score** — daily readiness based on overnight recovery data

### Phase 3 — Growth Features
> Making it spreadable.

- [ ] **Shareable BioAge Card** — your score as a visual card, built for social sharing (the viral hook)
- [ ] **Coach Dashboard** — let trainers view and manage multiple client profiles
- [ ] **Device Integrations** — Garmin, Fitbit, Oura Ring

---

## 🛠 Tech Stack

| Layer | Tech |
|---|---|
| Framework | React 19 + Vite |
| Styling | Tailwind CSS 4.x |
| AI / Intelligence | Groq SDK (Llama 3.3 70B) |
| Auth + Database | Supabase |
| Charts | Recharts |
| Navigation | React Router 7 |
| Payments *(upcoming)* | Stripe |
| Fitness Data *(upcoming)* | Google Fit API |
| Mobile *(future)* | Capacitor → React Native + Expo |

---

## 🚀 Getting Started

### Requirements
- Node.js 18+

### Installation

```bash
git clone https://github.com/hrshita-kshyp/Vyntra.git
cd Vyntra
npm install
```

### Environment Setup

Create a `.env` file in the root:

```env
VITE_GROQ_API_KEY=your_groq_api_key
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Run Locally

```bash
npm run dev
```

---

## 🗄️ Database Setup (Supabase)

Run in your **Supabase SQL Editor**:

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

## 💡 Design Philosophy

> **Reference level of polish: Linear, Vercel dashboard, Raycast.**

- Dark mode as default — premium health apps are dark
- Numbers count up on load. Charts animate in. Nothing is static.
- Glassmorphism cards for stats
- Loading skeletons — no blank states, ever
- Framer Motion for page transitions and micro-interactions

---

## 📍 Project Status

Building in public. Follow the progress → [vyntra-delta.vercel.app](https://vyntra-delta.vercel.app)

Phase 1 is the priority: **Google Fit integration + BioAge algorithm + UI upgrade** as one push — that's when this becomes worth showing people.

---

<div align="center">

*Vyntra — built by [@hrshita-kshyp](https://github.com/hrshita-kshyp)*

</div>
