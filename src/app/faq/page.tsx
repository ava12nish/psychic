import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'FAQ — Psychic',
    description: 'Frequently asked questions about Vedic astrology readings on Psychic.',
};

const faqs = [
    {
        category: 'About Vedic Astrology',
        items: [
            {
                q: 'What is Vedic astrology?',
                a: 'Vedic astrology (Jyotish Shastra) is the traditional Hindu system of astrology that originated in ancient India. It uses the sidereal zodiac, which accounts for the precession of equinoxes, and includes unique predictive tools like the Vimshottari Dasha system, nakshatras (lunar mansions), and divisional charts.',
            },
            {
                q: 'How is Vedic astrology different from Western astrology?',
                a: 'The key difference is the zodiac system. Western astrology uses the tropical zodiac (tied to seasons), while Vedic astrology uses the sidereal zodiac (tied to actual star positions). Due to precession, there is currently about a 24° difference between the two. Vedic astrology also emphasizes the Moon sign, uses the Whole Sign house system, and includes the Dasha timing system.',
            },
            {
                q: 'Is Vedic astrology deterministic?',
                a: 'No. Vedic astrology reveals tendencies, patterns, and timing — not fixed fate. It is a tool for self-understanding and reflection. Your choices, effort, and consciousness always play a role in how planetary influences manifest.',
            },
            {
                q: 'What are Mahadasha and Antardasha?',
                a: 'Mahadasha is a major planetary period in the Vimshottari Dasha system, which covers a 120-year cycle. Each planet rules a Mahadasha of a specific duration (e.g., Venus = 20 years, Saturn = 19 years). Antardasha is a sub-period within a Mahadasha, providing more nuanced timing information.',
            },
            {
                q: 'What is a Nakshatra?',
                a: 'Nakshatras are 27 lunar mansions — divisions of the zodiac into 13°20\' segments. Each nakshatra has a ruling planet, deity, and specific qualities. The Moon\'s nakshatra at birth is especially important as it determines the starting point of the Vimshottari Dasha system.',
            },
        ],
    },
    {
        category: 'Your Reading',
        items: [
            {
                q: 'What information do I need to provide?',
                a: 'You need your full name, date of birth, exact time of birth, and place of birth. The more precise your birth time, the more accurate your chart will be — especially your ascendant and house placements.',
            },
            {
                q: 'Why is exact birth time so important?',
                a: 'Your birth time determines your ascendant (rising sign), which sets the entire house structure of your chart. The ascendant changes approximately every 2 hours, so even a difference of 15-30 minutes can shift your chart significantly. If you don\'t know your exact time, use the closest estimate you have.',
            },
            {
                q: 'How are the readings generated?',
                a: 'Our engine calculates real planetary positions using astronomical algorithms (based on Meeus/VSOP87 methods), applies the Lahiri ayanamsa for sidereal conversion, and uses the Whole Sign house system. Interpretations are generated from the actual chart data — not generic templates.',
            },
            {
                q: 'How accurate are the calculations?',
                a: 'Our planetary positions are accurate to approximately ±1° for inner planets and ±2° for outer planets, which is sufficient for sign-level and nakshatra-level analysis. For professional-grade precision, integration with the Swiss Ephemeris is planned as a future enhancement.',
            },
            {
                q: 'Can I ask follow-up questions about my chart?',
                a: 'Yes! After your reading is generated, you can use the Q&A panel to ask questions about career, relationships, health, timing, or any other life area. Responses are grounded in your specific chart data and current dasha period.',
            },
        ],
    },
    {
        category: 'Privacy & Data',
        items: [
            {
                q: 'Is my birth data kept private?',
                a: 'Yes. We take privacy seriously. Your birth data is used solely to generate your reading and is stored securely. We never share, sell, or use your personal data for any purpose other than providing your astrology service.',
            },
            {
                q: 'Can I delete my data?',
                a: 'Yes. You can request deletion of your account and all associated data at any time by contacting us. We will permanently remove all your information within a reasonable timeframe.',
            },
            {
                q: 'Do you share my data with third parties?',
                a: 'No. Your birth data and chart results are never shared with third parties. We use geocoding services to resolve your birth location, but only the place name is sent — not your personal information.',
            },
        ],
    },
];

export default function FAQPage() {
    return (
        <div className="relative z-10 pt-32 pb-24">
            <section className="mb-16">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight mb-4">
                        Frequently asked questions
                    </h1>
                    <p className="text-lg text-neutral-400 leading-relaxed">
                        Everything you need to know about Psychic and Vedic astrology.
                    </p>
                </div>
            </section>

            <section>
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    {faqs.map((category) => (
                        <div key={category.category} className="mb-16 last:mb-0">
                            <h2 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4">{category.category}</h2>
                            <div className="space-y-4">
                                {category.items.map((faq) => (
                                    <div key={faq.q} className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-lg hover:bg-white/10 transition-colors">
                                        <h3 className="text-base font-semibold text-white mb-3">{faq.q}</h3>
                                        <p className="text-sm text-neutral-400 leading-relaxed">{faq.a}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
