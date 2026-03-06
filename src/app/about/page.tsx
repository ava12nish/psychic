import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'About — Psychic',
    description: 'Learn about Psychic\'s mission to bring clarity to life through personalized Vedic astrology.',
};

const values = [
    {
        title: 'Authenticity',
        description: 'We use real sidereal calculations rooted in the Jyotish tradition — not simplified sun-sign generalizations.',
    },
    {
        title: 'Clarity',
        description: 'Complex chart data deserves clear, thoughtful presentation. We design for understanding, not mystification.',
    },
    {
        title: 'Respect',
        description: 'We treat Vedic astrology as a tool for self-reflection and timing — not as fortune-telling or fear-based prediction.',
    },
    {
        title: 'Privacy',
        description: 'Your birth data is personal. We handle it with care, never share it, and give you full control over your information.',
    },
];

export default function AboutPage() {
    return (
        <div>
            {/* Hero */}
            <section className="py-20 sm:py-28 bg-gradient-to-b from-accent-50/40 to-white">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl sm:text-5xl font-bold text-neutral-900 tracking-tight">
                        Ancient wisdom, modern clarity
                    </h1>
                    <p className="mt-6 text-lg text-neutral-600 leading-relaxed">
                        Psychic brings the depth of Vedic astrology into a clean, modern experience.
                        We believe self-understanding should be accessible, personal, and beautifully presented.
                    </p>
                </div>
            </section>

            {/* Mission */}
            <section className="py-20 bg-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-2xl font-bold text-neutral-900 mb-4">Our mission</h2>
                            <p className="text-neutral-600 leading-relaxed mb-4">
                                For thousands of years, Vedic astrology has helped people understand themselves,
                                navigate life transitions, and make sense of timing. But accessing this wisdom
                                traditionally required finding an experienced Jyotishi and interpreting complex chart data.
                            </p>
                            <p className="text-neutral-600 leading-relaxed">
                                Psychic was built to change that. We combine authentic Jyotish calculations with
                                modern technology and thoughtful design to make personalized Vedic astrology
                                readings available to everyone — instantly, beautifully, and respectfully.
                            </p>
                        </div>
                        <div className="p-8 rounded-2xl bg-neutral-50 border border-neutral-200">
                            <blockquote className="text-neutral-700 italic leading-relaxed">
                                &ldquo;The wise use the stars as a map, not a mandate. Understanding your chart is
                                understanding yourself — your patterns, your timing, your potential.&rdquo;
                            </blockquote>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="py-20 bg-neutral-50">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-2xl font-bold text-neutral-900 mb-10 text-center">What we believe</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {values.map((value) => (
                            <div key={value.title} className="p-6 rounded-2xl bg-white border border-neutral-200">
                                <h3 className="text-base font-semibold text-neutral-900 mb-2">{value.title}</h3>
                                <p className="text-sm text-neutral-600 leading-relaxed">{value.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Approach */}
            <section className="py-20 bg-white">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-2xl font-bold text-neutral-900 mb-4">Our approach</h2>
                    <p className="text-neutral-600 leading-relaxed mb-4">
                        Every reading on Psychic begins with real astronomical calculations — planetary positions
                        computed from Julian Day algorithms and converted to sidereal coordinates using the Lahiri ayanamsa.
                    </p>
                    <p className="text-neutral-600 leading-relaxed mb-4">
                        We use the Whole Sign house system, calculate all 27 nakshatras, and generate the complete
                        Vimshottari Dasha timeline from birth. The interpretation layer is grounded in traditional
                        Jyotish principles, presenting chart insights as tendencies and themes rather than rigid fate.
                    </p>
                    <p className="text-neutral-600 leading-relaxed">
                        This is astrology as a tool for reflection, not superstition. We believe the best insights
                        come from understanding patterns, not from fear or false certainty.
                    </p>
                </div>
            </section>
        </div>
    );
}
