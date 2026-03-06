import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'How It Works — Psychic',
    description: 'Learn how Psychic generates your personalized Vedic astrology reading using real sidereal calculations.',
};

const steps = [
    {
        number: 1,
        title: 'Enter your birth details',
        description: 'Provide your full name, date of birth, exact time of birth, and place of birth. Birth time is essential for calculating your ascendant and houses.',
        detail: 'We need precise birth data because even a few minutes can shift your ascendant sign, which changes the entire house structure of your chart.',
    },
    {
        number: 2,
        title: 'We resolve your location',
        description: 'Your birth place is geocoded to get precise latitude, longitude, and timezone data. This ensures the astronomical calculations are accurate for your exact birth location.',
        detail: 'The position of celestial bodies relative to the horizon depends on geographic location. Two people born at the same time but in different cities will have different ascendants.',
    },
    {
        number: 3,
        title: 'Chart calculation engine runs',
        description: 'Our engine calculates planetary positions using astronomical algorithms, applies the Lahiri ayanamsa for sidereal conversion, and determines signs, houses, and nakshatras.',
        detail: 'Calculations include positions for Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, Rahu, and Ketu — the nine key planets (grahas) of Vedic astrology.',
    },
    {
        number: 4,
        title: 'Dasha timeline computed',
        description: 'The Vimshottari Dasha system creates a 120-year timeline of planetary periods based on your Moon\'s nakshatra at birth, revealing life timing patterns.',
        detail: 'Both Mahadasha (major periods) and Antardasha (sub-periods) are calculated, showing you which planetary energies are most active at any point.',
    },
    {
        number: 5,
        title: 'Interpretation generated',
        description: 'Chart data is analyzed for personality traits, strengths, challenges, career themes, and relationship patterns — all grounded in your specific placements.',
        detail: 'Interpretations consider exaltation, debilitation, house placements, retrograde status, and current dasha period for personalized relevance.',
    },
    {
        number: 6,
        title: 'Your dashboard is ready',
        description: 'View your complete reading on a polished dashboard with chart summary, planetary placements, dasha timeline, life themes, and the interactive Q&A panel.',
        detail: 'You can ask follow-up questions about any aspect of your chart — career, relationships, timing, health — and receive answers grounded in your chart data.',
    },
];

export default function HowItWorksPage() {
    return (
        <div>
            <section className="py-20 sm:py-28 bg-gradient-to-b from-accent-50/40 to-white">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl sm:text-5xl font-bold text-neutral-900 tracking-tight">
                        How it works
                    </h1>
                    <p className="mt-6 text-lg text-neutral-600 leading-relaxed">
                        From your birth details to a complete Vedic astrology reading — here&apos;s what happens behind the scenes.
                    </p>
                </div>
            </section>

            <section className="py-20 bg-white">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="space-y-12">
                        {steps.map((step) => (
                            <div key={step.number} className="flex gap-6">
                                <div className="flex-shrink-0">
                                    <div className="w-10 h-10 rounded-full bg-accent-100 text-accent-700 flex items-center justify-center font-bold text-sm">
                                        {step.number}
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-neutral-900 mb-2">{step.title}</h3>
                                    <p className="text-neutral-600 leading-relaxed mb-2">{step.description}</p>
                                    <p className="text-sm text-neutral-500 leading-relaxed">{step.detail}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Technology Note */}
            <section className="py-16 bg-neutral-50">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="p-8 rounded-2xl bg-white border border-neutral-200">
                        <h3 className="text-lg font-semibold text-neutral-900 mb-3">Under the hood</h3>
                        <p className="text-sm text-neutral-600 leading-relaxed mb-3">
                            Our calculation engine uses Julian Day algorithms for precise date handling,
                            simplified VSOP87/Meeus methods for planetary positions, and the Lahiri ayanamsa
                            for sidereal conversion. Houses use the Whole Sign system traditional in Jyotish.
                        </p>
                        <p className="text-sm text-neutral-600 leading-relaxed">
                            The Vimshottari Dasha engine computes the full 120-year cycle with Antardasha sub-periods,
                            using Moon&apos;s nakshatra position at birth as the starting point. All calculations are
                            performed server-side with structured, typed output.
                        </p>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 bg-white">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-2xl font-bold text-neutral-900 mb-4">Ready to try it?</h2>
                    <p className="text-neutral-600 mb-8">It takes less than a minute to enter your details.</p>
                    <Link
                        href="/get-reading"
                        className="inline-flex px-8 py-3.5 text-base font-semibold text-white bg-accent-700 hover:bg-accent-800 rounded-xl transition-colors shadow-lg"
                    >
                        Get Your Free Reading
                    </Link>
                </div>
            </section>
        </div>
    );
}
