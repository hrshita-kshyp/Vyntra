
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Activity, Brain, TrendingDown, Zap, Shield, BarChart2,
  CheckCircle, ArrowRight, Star, ChevronDown, Heart, Footprints
} from 'lucide-react';

// ─── Animated counter ────────────────────────────────────────────────────────
const Counter = ({ target, suffix = '' }) => {
  const [val, setVal] = useState(target + 8);
  useEffect(() => {
    const dur = 1600;
    const start = performance.now();
    const from = target + 8;
    const tick = (now) => {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(from + (target - from) * eased));
      if (p < 1) requestAnimationFrame(tick);
    };
    const t = setTimeout(() => requestAnimationFrame(tick), 600);
    return () => clearTimeout(t);
  }, [target]);
  return <>{val}{suffix}</>;
};

// ─── Fake BioAge card for hero ────────────────────────────────────────────────
const HeroBioCard = () => (
  <div className="relative w-full max-w-sm mx-auto">
    {/* Glow */}
    <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full scale-110 pointer-events-none" />

    <div className="relative bg-gradient-to-br from-gray-900 via-gray-900 to-blue-950 rounded-[2rem] p-8 shadow-2xl border border-white/10">
      <div className="flex items-center justify-between mb-6">
        <p className="text-gray-400 text-xs font-black uppercase tracking-widest">BioAge Score™</p>
        <span className="text-xs bg-green-500/20 text-green-400 border border-green-500/30 px-3 py-1 rounded-full font-bold">Live</span>
      </div>

      <div className="flex items-end space-x-5 mb-6">
        <div className="text-[80px] font-black leading-none bg-gradient-to-br from-emerald-400 to-green-500 bg-clip-text text-transparent">
          <Counter target={27} />
        </div>
        <div className="pb-2">
          <p className="text-gray-400 text-sm">Biological Age</p>
          <p className="text-gray-600 text-xs">Chrono: 32 yrs</p>
          <div className="flex items-center space-x-1.5 mt-2 text-emerald-400 font-bold text-sm">
            <TrendingDown size={16} />
            <span>5 years younger</span>
          </div>
        </div>
      </div>

      {/* Score bar */}
      <div className="mb-5">
        <div className="flex justify-between text-xs text-gray-500 font-bold mb-2">
          <span>WELLNESS SCORE</span>
          <span className="text-emerald-400">83/100</span>
        </div>
        <div className="w-full bg-white/10 rounded-full h-2">
          <div className="h-2 rounded-full bg-gradient-to-r from-emerald-400 to-green-500 w-[83%] transition-all duration-1000" />
        </div>
      </div>

      {/* Breakdown */}
      <div className="space-y-3 border-t border-white/10 pt-4">
        {[
          { label: 'Resting Heart Rate', val: '58 bpm',        rating: 'Excellent', color: 'text-emerald-400 bg-emerald-500/20' },
          { label: 'Daily Activity',     val: '11,200 steps',   rating: 'Excellent', color: 'text-emerald-400 bg-emerald-500/20' },
          { label: 'Sleep Duration',     val: '7.2h / night',   rating: 'Good',      color: 'text-blue-400 bg-blue-500/20'      },
        ].map(item => (
          <div key={item.label} className="flex items-center justify-between">
            <span className="text-gray-400 text-sm">{item.label}</span>
            <div className="flex items-center space-x-2">
              <span className="text-white text-sm font-semibold">{item.val}</span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${item.color}`}>{item.rating}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ─── Main Landing ─────────────────────────────────────────────────────────────
const Landing = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const goToAuth = () => navigate('/auth');

  return (
    <div className="bg-gray-950 text-white min-h-screen overflow-x-hidden">

      {/* ── Navbar ── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-gray-950/90 backdrop-blur-xl border-b border-white/5 py-3' : 'py-5'
      }`}>
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Activity className="w-7 h-7 text-blue-500" />
            <span className="text-xl font-black tracking-tight">Vyntra</span>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={goToAuth}
              className="text-gray-400 hover:text-white font-semibold text-sm transition-colors px-4 py-2"
            >
              Sign In
            </button>
            <button
              onClick={goToAuth}
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all active:scale-95 shadow-lg shadow-blue-600/25"
            >
              Get Started Free
            </button>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="min-h-screen flex items-center pt-20 pb-10 px-6 relative overflow-hidden">
        {/* Background grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
          {/* Left */}
          <div>
            <div className="inline-flex items-center space-x-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-8">
              <Zap size={12} />
              <span>AI-Powered Biological Age Tracking</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-black leading-[1.05] tracking-tight mb-6">
              Are you aging
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent"> faster </span>
              than you should?
            </h1>

            <p className="text-gray-400 text-lg leading-relaxed mb-10 max-w-lg">
              Vyntra connects to your smartwatch, calculates your true <strong className="text-white">biological age</strong> from real health data, and tells you exactly what to do to reverse it.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <button
                onClick={goToAuth}
                className="group bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-4 rounded-2xl flex items-center justify-center space-x-2 transition-all active:scale-95 shadow-2xl shadow-blue-600/30 text-lg"
              >
                <span>Calculate My BioAge</span>
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-gray-400 hover:text-white font-semibold px-8 py-4 rounded-2xl border border-white/10 hover:border-white/20 transition-all flex items-center justify-center space-x-2"
              >
                <span>See How It Works</span>
                <ChevronDown size={18} />
              </button>
            </div>

            <div className="flex items-center space-x-6 text-sm text-gray-500">
              <div className="flex items-center space-x-1.5">
                <CheckCircle size={15} className="text-green-500" />
                <span>Free forever tier</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <CheckCircle size={15} className="text-green-500" />
                <span>No credit card</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <CheckCircle size={15} className="text-green-500" />
                <span>Setup in 2 min</span>
              </div>
            </div>
          </div>

          {/* Right — BioAge card mockup */}
          <div className="flex justify-center lg:justify-end">
            <HeroBioCard />
          </div>
        </div>
      </section>

      {/* ── Compatible devices strip ── */}
      <section className="py-10 border-y border-white/5 bg-white/[0.02]">
        <div className="max-w-4xl mx-auto px-6">
          <p className="text-center text-gray-500 text-xs font-bold uppercase tracking-widest mb-8">Works with your device</p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-14 text-gray-500">
            {[
              { emoji: '📱', name: 'Google Fit',      sub: 'Android · 500M+' },
              { emoji: '⌚', name: 'Garmin',          sub: 'Coming soon' },
              { emoji: '🏃', name: 'Fitbit',          sub: 'Coming soon' },
              { emoji: '💍', name: 'Oura Ring',       sub: 'Coming soon' },
              { emoji: '📱', name: 'Samsung Health',  sub: 'Coming soon' },
            ].map(d => (
              <div key={d.name} className="flex flex-col items-center space-y-1 opacity-60 hover:opacity-100 transition-opacity">
                <span className="text-2xl">{d.emoji}</span>
                <span className="text-xs font-bold text-gray-300">{d.name}</span>
                <span className="text-[10px] text-gray-600">{d.sub}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-28 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <p className="text-blue-400 text-xs font-black uppercase tracking-widest mb-4">Why Vyntra</p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-5">
              Your fitness app shows you <span className="text-gray-500">data.</span><br />
              We show you <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">what it means.</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">
              Everyone has step counts and heart rate numbers. Nobody explains the correlation until now.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Brain,
                color: 'bg-blue-500/10 text-blue-400',
                title: 'BioAge Score™',
                desc: 'A single number — your true biological age — calculated from HRV, resting HR, steps, and sleep. Know if you\'re aging well or fast.',
              },
              {
                icon: Zap,
                color: 'bg-purple-500/10 text-purple-400',
                title: 'AI "Why" Engine',
                desc: 'Not just "resting HR: 72". Instead: "Your HR spiked 8bpm this week because you slept under 6hrs three nights in a row."',
              },
              {
                icon: BarChart2,
                color: 'bg-cyan-500/10 text-cyan-400',
                title: '7-Day Trend Charts',
                desc: 'Visual trends for steps, heart rate, and calories from your actual device — not averages from 3 months ago.',
              },
              {
                icon: Heart,
                color: 'bg-red-500/10 text-red-400',
                title: 'Readiness Score',
                desc: 'Should you push hard today or rest? A daily answer based on your HRV and sleep recovery — like WHOOP, for free.',
              },
              {
                icon: Shield,
                color: 'bg-green-500/10 text-green-400',
                title: 'Doctor-Ready Report',
                desc: 'Monthly PDF summary of your health trends. Show your doctor real data at your next checkup instead of "I feel okay".',
                badge: 'Pro',
              },
              {
                icon: Footprints,
                color: 'bg-orange-500/10 text-orange-400',
                title: 'Cross-Device Aggregation',
                desc: 'Wear a Mi Band? Use Samsung Health? Google Fit? All data flows into one unified score. No more app-hopping.',
                badge: 'Soon',
              },
            ].map(f => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-8 hover:bg-white/[0.05] transition-all group">
                  <div className="flex items-start justify-between mb-5">
                    <div className={`p-3 rounded-xl ${f.color}`}>
                      <Icon size={22} />
                    </div>
                    {f.badge && (
                      <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${
                        f.badge === 'Pro' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                      }`}>{f.badge}</span>
                    )}
                  </div>
                  <h3 className="font-bold text-white text-lg mb-3">{f.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="how-it-works" className="py-28 px-6 bg-white/[0.02] border-y border-white/5">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-20">
            <p className="text-blue-400 text-xs font-black uppercase tracking-widest mb-4">Simple Setup</p>
            <h2 className="text-4xl font-black tracking-tight">Up and running in 3 steps</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Create your account',
                desc: 'Sign up free in 30 seconds. No credit card. No setup fee.',
                color: 'text-blue-400',
              },
              {
                step: '02',
                title: 'Connect Google Fit',
                desc: 'One click OAuth. We pull your last 7 days of real health data instantly.',
                color: 'text-cyan-400',
              },
              {
                step: '03',
                title: 'Get your BioAge',
                desc: 'See your biological age, wellness score, and exactly which habits to improve.',
                color: 'text-emerald-400',
              },
            ].map(s => (
              <div key={s.step} className="text-center">
                <div className={`text-6xl font-black ${s.color} opacity-20 mb-4`}>{s.step}</div>
                <h3 className="text-xl font-bold mb-3">{s.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section className="py-28 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-20">
            <p className="text-blue-400 text-xs font-black uppercase tracking-widest mb-4">Pricing</p>
            <h2 className="text-4xl font-black tracking-tight mb-4">Start free. Upgrade when you're hooked.</h2>
            <p className="text-gray-400 text-lg">No pushy upsells. The free tier is genuinely useful.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: 'Free',
                price: '$0',
                sub: 'forever',
                features: [
                  'Connect 1 device',
                  'BioAge Score™',
                  '7-day history',
                  'Basic step & HR tracking',
                  'AI daily insight',
                ],
                cta: 'Get Started',
                highlight: false,
              },
              {
                name: 'Pro',
                price: '$9.99',
                sub: '/ month',
                features: [
                  'Everything in Free',
                  'Full BioAge trend history',
                  'AI "Why" Engine',
                  'Monthly health PDF report',
                  'Readiness Score daily',
                  '1-year data history',
                ],
                cta: 'Start Pro Free',
                highlight: true,
                badge: 'Most Popular',
              },
              {
                name: 'Coach',
                price: '$24.99',
                sub: '/ month',
                features: [
                  'Everything in Pro',
                  'Monitor up to 10 athletes',
                  'Team dashboard',
                  'Training load analysis',
                  'Export CSV / PDF',
                  'Priority support',
                ],
                cta: 'Start Coach Free',
                highlight: false,
              },
            ].map(plan => (
              <div key={plan.name} className={`relative rounded-[2rem] p-8 border transition-all ${
                plan.highlight
                  ? 'bg-blue-600 border-blue-500 shadow-2xl shadow-blue-600/30 scale-[1.02]'
                  : 'bg-white/[0.03] border-white/[0.08] hover:bg-white/[0.05]'
              }`}>
                {plan.badge && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-white text-blue-600 text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg">
                    {plan.badge}
                  </div>
                )}
                <p className={`text-sm font-black uppercase tracking-widest mb-4 ${plan.highlight ? 'text-blue-200' : 'text-gray-400'}`}>{plan.name}</p>
                <div className="flex items-baseline space-x-1 mb-8">
                  <span className="text-5xl font-black">{plan.price}</span>
                  <span className={`text-sm ${plan.highlight ? 'text-blue-200' : 'text-gray-500'}`}>{plan.sub}</span>
                </div>
                <ul className="space-y-3 mb-10">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-start space-x-3 text-sm">
                      <CheckCircle size={16} className={`flex-shrink-0 mt-0.5 ${plan.highlight ? 'text-blue-200' : 'text-green-500'}`} />
                      <span className={plan.highlight ? 'text-blue-100' : 'text-gray-300'}>{f}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={goToAuth}
                  className={`w-full font-bold py-3.5 rounded-2xl transition-all active:scale-95 ${
                    plan.highlight
                      ? 'bg-white text-blue-600 hover:bg-gray-100 shadow-lg'
                      : 'bg-white/10 text-white hover:bg-white/20 border border-white/10'
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Social proof ── */}
      <section className="py-20 px-6 bg-white/[0.02] border-y border-white/5">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-1 mb-4">
            {[...Array(5)].map((_, i) => <Star key={i} size={18} className="fill-yellow-400 text-yellow-400" />)}
          </div>
          <blockquote className="text-2xl md:text-3xl font-bold text-white leading-relaxed mb-6 max-w-2xl mx-auto">
            "Finally an app that tells me <em className="text-blue-400 not-italic">why</em> I feel tired instead of just showing me numbers."
          </blockquote>
          <p className="text-gray-500 text-sm font-semibold">Early beta user · Google Fit · Mi Band 8</p>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-transparent pointer-events-none" />
        <div className="max-w-2xl mx-auto text-center relative z-10">
          <h2 className="text-5xl font-black tracking-tight mb-6">
            What's your biological age?
          </h2>
          <p className="text-gray-400 text-lg mb-10">
            Connect your device and find out in under 2 minutes. Free forever.
          </p>
          <button
            onClick={goToAuth}
            className="group bg-blue-600 hover:bg-blue-500 text-white font-bold px-10 py-5 rounded-2xl text-lg transition-all active:scale-95 shadow-2xl shadow-blue-600/40 flex items-center space-x-3 mx-auto"
          >
            <span>Calculate My BioAge — Free</span>
            <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/5 py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <Activity className="w-5 h-5 text-blue-500" />
            <span className="font-black text-white tracking-tight">Vyntra</span>
            <span className="text-gray-600 text-sm ml-2">© 2026</span>
          </div>
          <p className="text-gray-600 text-xs text-center">
            Not a medical device. BioAge Score™ is an estimate for wellness tracking purposes only.
          </p>
          <div className="flex items-center space-x-6 text-gray-500 text-sm">
            <button onClick={goToAuth} className="hover:text-white transition-colors">Sign In</button>
            <button onClick={goToAuth} className="hover:text-white transition-colors">Get Started</button>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default Landing;
