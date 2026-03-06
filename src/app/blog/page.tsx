import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Blog — Psychic',
    description: 'Insights, guides, and articles about Vedic astrology.',
};

const posts = [
    {
        title: 'Understanding Your Ascendant: Why It Matters More Than Your Sun Sign',
        excerpt: 'In Vedic astrology, the ascendant (Lagna) is considered more important than the Sun sign. It determines your chart\'s house structure and sets the foundation for your entire reading.',
        date: 'Feb 28, 2026',
        readTime: '5 min read',
        category: 'Fundamentals',
    },
    {
        title: 'The Vimshottari Dasha System: A Guide to Life Timing',
        excerpt: 'The dasha system is one of Jyotish\'s most powerful predictive tools. Learn how planetary periods shape the themes and events of different life phases.',
        date: 'Feb 20, 2026',
        readTime: '7 min read',
        category: 'Dasha',
    },
    {
        title: 'Nakshatras: The 27 Lunar Mansions Explained',
        excerpt: 'Nakshatras add a layer of depth beyond zodiac signs. Each of the 27 lunar mansions carries unique qualities, deities, and influences on your chart.',
        date: 'Feb 12, 2026',
        readTime: '6 min read',
        category: 'Nakshatras',
    },
    {
        title: 'Sidereal vs. Tropical: Understanding the Zodiac Difference',
        excerpt: 'Why does your Vedic sign differ from your Western sign? The answer lies in precession and the choice between sidereal and tropical reference frames.',
        date: 'Feb 5, 2026',
        readTime: '4 min read',
        category: 'Fundamentals',
    },
    {
        title: 'Saturn Return in Vedic Astrology: What to Expect',
        excerpt: 'Saturn\'s return to its natal position is a major life milestone in Jyotish. Understanding its timing and themes can help you navigate this transformative period.',
        date: 'Jan 28, 2026',
        readTime: '5 min read',
        category: 'Transits',
    },
    {
        title: 'How Birth Time Affects Your Chart',
        excerpt: 'Even 15 minutes can shift your ascendant and house placements. Learn why birth time accuracy is crucial and what to do if you\'re unsure of yours.',
        date: 'Jan 20, 2026',
        readTime: '3 min read',
        category: 'Fundamentals',
    },
];

export default function BlogPage() {
    return (
        <div>
            <section className="py-20 sm:py-28 bg-gradient-to-b from-accent-50/40 to-white">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl sm:text-5xl font-bold text-neutral-900 tracking-tight">
                        Insights & Guides
                    </h1>
                    <p className="mt-6 text-lg text-neutral-600 leading-relaxed">
                        Learn about Vedic astrology concepts, chart interpretation, and celestial timing.
                    </p>
                </div>
            </section>

            <section className="py-20 bg-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {posts.map((post) => (
                            <article
                                key={post.title}
                                className="p-6 rounded-2xl bg-white border border-neutral-200 hover:border-accent-300 hover:shadow-lg transition-all cursor-pointer group"
                            >
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="px-2.5 py-0.5 rounded-full bg-accent-50 text-accent-700 text-xs font-medium">
                                        {post.category}
                                    </span>
                                    <span className="text-xs text-neutral-400">·</span>
                                    <span className="text-xs text-neutral-500">{post.readTime}</span>
                                </div>
                                <h2 className="text-base font-semibold text-neutral-900 mb-2 group-hover:text-accent-700 transition-colors">
                                    {post.title}
                                </h2>
                                <p className="text-sm text-neutral-600 leading-relaxed mb-3">{post.excerpt}</p>
                                <p className="text-xs text-neutral-400">{post.date}</p>
                            </article>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
