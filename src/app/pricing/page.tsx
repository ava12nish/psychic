import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Pricing — Psychic',
    description: 'Simple, transparent pricing for Vedic astrology readings.',
};

const plans = [
    {
        name: 'Free Preview',
        price: '$0',
        period: '',
        description: 'Try it out with a basic chart overview.',
        features: [
            'Birth chart summary',
            'Ascendant & Moon sign',
            'Basic planetary placements',
            'Current Mahadasha',
            'Limited Q&A (3 questions)',
        ],
        cta: 'Get Started',
        ctaHref: '/get-reading',
        highlighted: false,
    },
    {
        name: 'Full Reading',
        price: '$19',
        period: 'one-time',
        description: 'Complete Vedic astrology analysis with full dashboard access.',
        features: [
            'Everything in Free Preview',
            'Detailed planetary analysis',
            'Full house breakdown',
            'Nakshatra details',
            'Mahadasha & Antardasha timeline',
            'Personality & life themes',
            'Career & relationship insights',
            'Unlimited Q&A',
            'Saved reading history',
        ],
        cta: 'Get Full Reading',
        ctaHref: '/get-reading',
        highlighted: true,
    },
    {
        name: 'Premium Guidance',
        price: '$49',
        period: 'per month',
        description: 'Ongoing periodic insights and advanced dasha guidance.',
        features: [
            'Everything in Full Reading',
            'Monthly dasha updates',
            'Transit analysis',
            'Advanced period forecasts',
            'Priority Q&A responses',
            'Multiple chart profiles',
            'Compatibility readings',
            'Email insights digest',
        ],
        cta: 'Coming Soon',
        ctaHref: '#',
        highlighted: false,
        comingSoon: true,
    },
];

export default function PricingPage() {
    return (
        <div className="relative z-10">
            <section className="pt-32 pb-16 sm:pt-40 sm:pb-24">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight mb-6">
                        Simple, honest pricing
                    </h1>
                    <p className="text-lg text-neutral-400 leading-relaxed max-w-xl mx-auto">
                        Start with your free chart. Upgrade when you want deeper insights.
                    </p>
                </div>
            </section>

            <section className="pb-32">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {plans.map((plan) => (
                            <div
                                key={plan.name}
                                className={`relative p-8 rounded-3xl border ${plan.highlighted
                                    ? 'border-accent-500/50 shadow-[0_0_30px_rgba(59,130,246,0.2)] bg-white/10 scale-105'
                                    : 'border-white/10 bg-white/5'
                                    } backdrop-blur-xl flex flex-col transition-all hover:bg-white/10`}
                            >
                                {plan.highlighted && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-accent-600 text-white text-xs font-semibold rounded-full shadow-[0_0_15px_rgba(37,99,235,0.5)]">
                                        Most Popular
                                    </div>
                                )}
                                <div className="mb-8">
                                    <h3 className="text-xl font-semibold text-white">{plan.name}</h3>
                                    <div className="mt-4 flex items-baseline gap-1">
                                        <span className="text-5xl font-bold text-white">{plan.price}</span>
                                        {plan.period && (
                                            <span className="text-sm text-neutral-400">/ {plan.period}</span>
                                        )}
                                    </div>
                                    <p className="mt-3 text-sm text-neutral-400">{plan.description}</p>
                                </div>
                                <ul className="space-y-4 mb-10 flex-1">
                                    {plan.features.map((feature) => (
                                        <li key={feature} className="flex items-start gap-3 text-sm text-neutral-300">
                                            <svg className="w-5 h-5 text-accent-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                            </svg>
                                            <span className="leading-relaxed">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                                <Link
                                    href={plan.ctaHref}
                                    className={`block text-center px-6 py-4 rounded-xl text-sm font-bold transition-all ${plan.highlighted
                                        ? 'bg-accent-600 text-white hover:bg-accent-500 shadow-[0_0_20px_rgba(37,99,235,0.3)]'
                                        : plan.comingSoon
                                            ? 'bg-white/5 text-neutral-500 cursor-not-allowed border border-white/5'
                                            : 'bg-white/10 text-white hover:bg-white/20 border border-white/10'
                                        }`}
                                >
                                    {plan.cta}
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
