import Link from 'next/link';

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
    <div>
      {/* ================================ HERO ================================ */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-accent-50/30 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 sm:pt-28 sm:pb-32">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-100 text-accent-700 text-xs font-medium mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-500" />
              Vedic Astrology · Jyotish
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-neutral-900 leading-tight tracking-tight">
              Understand your chart.{' '}
              <span className="text-accent-700">Navigate your timing.</span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-neutral-600 leading-relaxed max-w-2xl mx-auto">
              Personalized Vedic astrology readings with real sidereal calculations,
              Mahadasha timelines, and chart-based insights — designed for the modern seeker.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/get-reading"
                className="w-full sm:w-auto px-8 py-3.5 text-base font-semibold text-white bg-accent-700 hover:bg-accent-800 rounded-xl transition-all shadow-lg shadow-accent-700/20 hover:shadow-xl hover:shadow-accent-700/30"
              >
                Get Your Free Reading
              </Link>
              <Link
                href="/how-it-works"
                className="w-full sm:w-auto px-8 py-3.5 text-base font-semibold text-neutral-700 bg-white hover:bg-neutral-50 rounded-xl border border-neutral-300 transition-colors"
              >
                How It Works
              </Link>
            </div>
          </div>
        </div>
        {/* Decorative gradient */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-20 left-1/4 w-72 h-72 bg-accent-200/30 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-brand-200/20 rounded-full blur-3xl" />
        </div>
      </section>

      {/* ================================ BENEFITS ================================ */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 tracking-tight">
              Why Psychic is different
            </h2>
            <p className="mt-4 text-lg text-neutral-600 max-w-2xl mx-auto">
              Real calculations, real insights — not recycled horoscope content.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit) => (
              <div
                key={benefit.title}
                className="p-6 rounded-2xl bg-neutral-50 border border-neutral-200 hover:border-accent-300 hover:shadow-lg transition-all group"
              >
                <div className="w-10 h-10 rounded-lg bg-accent-100 text-accent-700 flex items-center justify-center text-lg font-bold mb-4 group-hover:bg-accent-200 transition-colors">
                  {benefit.icon}
                </div>
                <h3 className="text-base font-semibold text-neutral-900 mb-2">{benefit.title}</h3>
                <p className="text-sm text-neutral-600 leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================ HOW IT WORKS ================================ */}
      <section className="py-20 sm:py-28 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 tracking-tight">
              How it works
            </h2>
            <p className="mt-4 text-lg text-neutral-600 max-w-2xl mx-auto">
              From birth details to personalized insights in minutes.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <div key={step.number} className="relative">
                <div className="text-5xl font-bold text-accent-200 mb-3">{step.number}</div>
                <h3 className="text-base font-semibold text-neutral-900 mb-2">{step.title}</h3>
                <p className="text-sm text-neutral-600 leading-relaxed">{step.description}</p>
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 right-0 w-8 text-accent-300 translate-x-4">→</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================ SAMPLE PREVIEW ================================ */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 tracking-tight">
                A glimpse of your reading
              </h2>
              <p className="mt-4 text-lg text-neutral-600">
                See the kind of personalized insight you will receive.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-200">
                <div className="text-xs font-semibold text-accent-600 uppercase tracking-wider mb-3">Chart Summary</div>
                <p className="text-sm text-neutral-700 leading-relaxed">
                  Aries ascendant with Moon in Rohini nakshatra. Sun in Taurus, Mercury conjunct Venus in the 2nd house.
                  Strong 10th house activity suggests career-oriented life themes.
                </p>
              </div>
              <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-200">
                <div className="text-xs font-semibold text-accent-600 uppercase tracking-wider mb-3">Current Period</div>
                <p className="text-sm text-neutral-700 leading-relaxed">
                  Jupiter Mahadasha / Venus Antardasha. Period of expansion in relationships, creative expression,
                  and financial growth. Favorable for partnerships and artistic pursuits.
                </p>
              </div>
              <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-200">
                <div className="text-xs font-semibold text-accent-600 uppercase tracking-wider mb-3">Key Insight</div>
                <p className="text-sm text-neutral-700 leading-relaxed">
                  With Jupiter exalted and currently active as your Mahadasha lord, this is a significant period for wisdom,
                  spiritual growth, and professional advancement.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================ DASHA TEASER ================================ */}
      <section className="py-20 sm:py-28 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-100 text-brand-700 text-xs font-medium mb-4">
                Vimshottari Dasha
              </div>
              <h2 className="text-3xl font-bold text-neutral-900 tracking-tight mb-4">
                Understand your life timing
              </h2>
              <p className="text-neutral-600 leading-relaxed mb-6">
                The Vimshottari Dasha system maps a 120-year cycle of planetary periods,
                revealing the themes and energies that define each phase of your life.
                Know when to act, when to wait, and what to focus on.
              </p>
              <Link
                href="/get-reading"
                className="inline-flex px-6 py-2.5 text-sm font-semibold text-white bg-accent-700 hover:bg-accent-800 rounded-lg transition-colors"
              >
                Calculate Your Dasha
              </Link>
            </div>
            <div className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-sm">
              <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-4">Sample Dasha Timeline</div>
              <div className="space-y-3">
                {[
                  { lord: 'Jupiter', years: '2018 – 2034', active: true },
                  { lord: 'Saturn', years: '2034 – 2053', active: false },
                  { lord: 'Mercury', years: '2053 – 2070', active: false },
                ].map((d) => (
                  <div
                    key={d.lord}
                    className={`flex items-center justify-between p-3 rounded-lg ${d.active ? 'bg-accent-50 border border-accent-200' : 'bg-neutral-50 border border-neutral-100'
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${d.active ? 'bg-accent-500' : 'bg-neutral-300'}`} />
                      <span className={`text-sm font-medium ${d.active ? 'text-accent-800' : 'text-neutral-600'}`}>
                        {d.lord} Mahadasha
                      </span>
                    </div>
                    <span className={`text-xs ${d.active ? 'text-accent-600 font-semibold' : 'text-neutral-500'}`}>
                      {d.years}
                      {d.active && ' (Active)'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================ TESTIMONIALS ================================ */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 tracking-tight">
              What people are saying
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {testimonials.map((t) => (
              <div key={t.name} className="p-6 rounded-2xl bg-neutral-50 border border-neutral-200">
                <p className="text-sm text-neutral-700 leading-relaxed mb-4 italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div>
                  <p className="text-sm font-semibold text-neutral-900">{t.name}</p>
                  <p className="text-xs text-neutral-500">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================ FAQ PREVIEW ================================ */}
      <section className="py-20 sm:py-28 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-neutral-900 tracking-tight">
                Common questions
              </h2>
            </div>
            <div className="space-y-4">
              {faqs.map((faq) => (
                <div key={faq.q} className="p-5 rounded-xl bg-white border border-neutral-200">
                  <h3 className="text-sm font-semibold text-neutral-900 mb-2">{faq.q}</h3>
                  <p className="text-sm text-neutral-600 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
            <div className="text-center mt-8">
              <Link href="/faq" className="text-sm font-medium text-accent-700 hover:text-accent-800 transition-colors">
                View all FAQ →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ================================ CTA ================================ */}
      <section className="py-20 sm:py-28 bg-accent-800">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Ready to understand your chart?
          </h2>
          <p className="mt-4 text-lg text-accent-200 max-w-xl mx-auto">
            Enter your birth details and receive your personalized Vedic astrology reading in minutes.
          </p>
          <Link
            href="/get-reading"
            className="inline-flex mt-8 px-8 py-3.5 text-base font-semibold text-accent-800 bg-white hover:bg-neutral-100 rounded-xl transition-colors shadow-lg"
          >
            Get Your Free Reading
          </Link>
        </div>
      </section>
    </div>
  );
}
