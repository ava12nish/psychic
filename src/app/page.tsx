import Link from 'next/link';
import { FadeIn } from '@/components/ui/FadeIn';
import { Stagger, StaggerItem } from '@/components/ui/Stagger';

const steps = [
  {
    number: '01',
    title: 'Enter Your Birth Details',
    description: 'Provide your name, date, time, and place of birth for an accurate Vedic chart.',
  },
  {
    number: '02',
    title: 'We Calculate Your Chart',
    description: 'Our engine computes sidereal planetary positions, Mahadasha timeline, and nakshatras.',
  },
  {
    number: '03',
    title: 'Explore Your Insights',
    description: 'View your personalized dashboard with chart analysis, dasha periods, and life themes.',
  },
  {
    number: '04',
    title: 'Ask Your Questions',
    description: 'Dive deeper with our Q&A interface — ask about career, relationships, timing, and more.',
  },
];

const benefits = [
  {
    icon: '◎',
    title: 'Sidereal Precision',
    description: 'Calculations based on the Vedic sidereal zodiac with Lahiri ayanamsa — not Western tropical astrology.',
  },
  {
    icon: '◈',
    title: 'Dasha Timing',
    description: 'Full Vimshottari Mahadasha and Antardasha timeline so you understand the rhythms of your life.',
  },
  {
    icon: '◇',
    title: 'Personalized Insights',
    description: 'Interpretations grounded in your actual chart placements, not generic sun-sign horoscopes.',
  },
  {
    icon: '○',
    title: 'Interactive Q&A',
    description: 'Ask follow-up questions about your chart and receive answers tied to your personal data.',
  },
];

const testimonials = [
  {
    name: 'Priya K.',
    role: 'Product Designer',
    quote: 'This is the first astrology tool that actually felt sophisticated enough for me to take seriously. The dasha timeline was especially eye-opening.',
  },
  {
    name: 'Arjun M.',
    role: 'Software Engineer',
    quote: 'I was skeptical, but the chart analysis was remarkably specific. The career themes matched my experience almost exactly.',
  },
  {
    name: 'Sarah L.',
    role: 'Entrepreneur',
    quote: 'Clean, modern, and genuinely insightful. The Q&A feature is brilliant — it feels like talking to a knowledgeable astrologer.',
  },
];

const faqs = [
  {
    q: 'What is Vedic astrology?',
    a: 'Vedic astrology (Jyotish) is the traditional Hindu system of astrology. It uses the sidereal zodiac and includes unique concepts like nakshatras, dashas, and divisional charts.',
  },
  {
    q: 'Why do you need my exact birth time?',
    a: 'Birth time determines your ascendant (rising sign) and house placements, which are essential for accurate predictions and personality analysis.',
  },
  {
    q: 'Is this the same as Western astrology?',
    a: 'No. Vedic astrology uses the sidereal zodiac (accounting for Earth\'s axial precession), different house systems, and unique predictive tools like the Vimshottari Dasha system.',
  },
];

export default function HomePage() {
  return (
    <div className="overflow-hidden">
      {/* ================================ HERO ================================ */}
      <section className="relative pt-32 pb-24 sm:pt-40 sm:pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <FadeIn delay={0.1}>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-accent-300 text-xs font-semibold tracking-wide uppercase mb-8 backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-accent-400 animate-pulse" />
                Vedic Astrology Reimagined
              </div>
            </FadeIn>

            <FadeIn delay={0.2}>
              <h1 className="text-5xl sm:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-white via-neutral-200 to-neutral-500 leading-tight tracking-tight mb-8">
                Decode your stars.<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-400 to-indigo-400">Master your timeline.</span>
              </h1>
            </FadeIn>

            <FadeIn delay={0.3}>
              <p className="text-lg sm:text-xl text-neutral-400 leading-relaxed max-w-2xl mx-auto mb-12">
                Hyper-accurate sidereal calculations, Mahadasha timelines, and deep personalized insights—wrapped in a beautiful, modern interface.
              </p>
            </FadeIn>

            <FadeIn delay={0.4}>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/get-reading"
                  className="w-full sm:w-auto px-8 py-4 text-base font-semibold text-white bg-accent-600 hover:bg-accent-500 rounded-xl transition-all shadow-[0_0_30px_rgba(37,99,235,0.3)] hover:shadow-[0_0_40px_rgba(59,130,246,0.5)] border border-accent-400/30"
                >
                  Get Your Free Reading
                </Link>
                <Link
                  href="/how-it-works"
                  className="w-full sm:w-auto px-8 py-4 text-base font-semibold text-white bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-colors backdrop-blur-md"
                >
                  See How It Works
                </Link>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ================================ BENEFITS ================================ */}
      <section className="py-24 sm:py-32 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-16">
            <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight">
              Why Psychic is different
            </h2>
            <p className="mt-4 text-lg text-neutral-400 max-w-2xl mx-auto">
              Real computational precision, elegant design.
            </p>
          </FadeIn>

          <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit) => (
              <StaggerItem key={benefit.title}>
                <div className="h-full p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-accent-500/50 hover:bg-white/[0.08] transition-all group backdrop-blur-xl">
                  <div className="w-12 h-12 rounded-xl bg-accent-500/20 text-accent-400 flex items-center justify-center text-2xl mb-6 group-hover:bg-accent-500/30 group-hover:scale-110 transition-all shadow-[0_0_15px_rgba(59,130,246,0.15)]">
                    {benefit.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-3">{benefit.title}</h3>
                  <p className="text-sm text-neutral-400 leading-relaxed">{benefit.description}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ================================ HOW IT WORKS ================================ */}
      <section className="py-24 sm:py-32 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-16">
            <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight">
              The Path to Clarity
            </h2>
            <p className="mt-4 text-lg text-neutral-400 max-w-2xl mx-auto">
              From birth details to profound insights in seconds.
            </p>
          </FadeIn>

          <Stagger className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <StaggerItem key={step.number} className="relative">
                <div className="text-6xl font-black text-white/5 mb-4 group-hover:text-white/10 transition-colors">{step.number}</div>
                <h3 className="text-lg font-semibold text-white mb-3">{step.title}</h3>
                <p className="text-sm text-neutral-400 leading-relaxed">{step.description}</p>
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-10 right-0 w-8 text-accent-500/50 translate-x-4">→</div>
                )}
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ================================ DASHA TEASER ================================ */}
      <section className="py-24 sm:py-32 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <FadeIn direction="left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-6">
                Vimshottari Dasha
              </div>
              <h2 className="text-4xl sm:text-5xl font-bold text-white tracking-tight mb-6 leading-tight">
                Understand your <br /><span className="text-indigo-400">life timing.</span>
              </h2>
              <p className="text-lg text-neutral-400 leading-relaxed mb-8">
                The Vimshottari Dasha system maps a 120-year cycle of planetary periods,
                revealing the themes and energies that define each phase of your life.
                Know when to act, when to wait, and what to focus on.
              </p>
              <Link
                href="/get-reading"
                className="inline-flex px-8 py-3.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-colors shadow-[0_0_20px_rgba(79,70,229,0.3)] border border-indigo-500/50"
              >
                Calculate Your Dasha
              </Link>
            </FadeIn>

            <FadeIn direction="right">
              <div className="p-8 rounded-3xl bg-neutral-900/50 border border-white/10 backdrop-blur-xl shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent pointer-events-none" />
                <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-6">Sample Dasha Timeline</div>
                <div className="space-y-4">
                  {[
                    { lord: 'Jupiter', years: '2018 – 2034', active: true },
                    { lord: 'Saturn', years: '2034 – 2053', active: false },
                    { lord: 'Mercury', years: '2053 – 2070', active: false },
                  ].map((d) => (
                    <div
                      key={d.lord}
                      className={`flex items-center justify-between p-4 rounded-xl transition-all ${d.active
                          ? 'bg-indigo-500/10 border border-indigo-500/30 shadow-[0_0_15px_rgba(79,70,229,0.1)]'
                          : 'bg-white/5 border border-white/5'
                        }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-2.5 h-2.5 rounded-full ${d.active ? 'bg-indigo-400 shadow-[0_0_10px_rgba(129,140,248,0.8)]' : 'bg-neutral-600'}`} />
                        <span className={`text-base font-medium ${d.active ? 'text-indigo-200' : 'text-neutral-400'}`}>
                          {d.lord} Mahadasha
                        </span>
                      </div>
                      <span className={`text-sm ${d.active ? 'text-indigo-400 font-semibold' : 'text-neutral-500'}`}>
                        {d.years}
                        {d.active && <span className="ml-2 animate-pulse">•</span>}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ================================ TESTIMONIALS ================================ */}
      <section className="py-24 sm:py-32 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              What people are saying
            </h2>
          </FadeIn>
          <Stagger className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {testimonials.map((t) => (
              <StaggerItem key={t.name}>
                <div className="p-8 h-full rounded-3xl bg-white/5 border border-white/10 backdrop-blur-lg">
                  <div className="text-accent-400 text-4xl mb-4 font-serif">"</div>
                  <p className="text-neutral-300 leading-relaxed mb-8 italic">
                    {t.quote}
                  </p>
                  <div>
                    <p className="text-sm font-bold text-white">{t.name}</p>
                    <p className="text-xs text-neutral-500 mt-1">{t.role}</p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ================================ CTA ================================ */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-accent-950/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <FadeIn>
            <h2 className="text-4xl sm:text-6xl font-bold text-white tracking-tight leading-tight">
              Ready to decode <br />your cosmic blueprint?
            </h2>
            <p className="mt-6 text-xl text-neutral-400 max-w-2xl mx-auto">
              Get an impossibly precise, personalized Vedic astrology reading in seconds.
            </p>
            <div className="mt-12">
              <Link
                href="/get-reading"
                className="inline-flex px-10 py-5 text-lg font-bold text-white bg-accent-600 hover:bg-accent-500 rounded-2xl transition-all shadow-[0_0_40px_rgba(37,99,235,0.4)] hover:shadow-[0_0_60px_rgba(59,130,246,0.6)] border border-accent-400/50 hover:scale-105"
              >
                Get Your Free Reading Now
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
