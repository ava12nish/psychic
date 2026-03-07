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
        <div>
            <section className="py-12 sm:py-16 bg-gradient-to-b from-accent-50/40 to-white flex-shrink-0">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 tracking-tight">
                        Simple, honest pricing
                    </h1>
                    <p className="mt-4 text-base text-neutral-600 leading-relaxed">
                        Start with your free chart. Upgrade when you want deeper insights.
                    </p>
                </div>
            </section>

            <section className="py-4 pb-12 bg-white flex-grow">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {plans.map((plan) => (
                            <div
                                key={plan.name}
                                className={`relative p-8 rounded-2xl border ${plan.highlighted
                                    ? 'border-accent-300 shadow-xl shadow-accent-100/50 scale-105'
                                    : 'border-neutral-200'
                                    } bg-white flex flex-col`}
                            >
                                {plan.highlighted && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-accent-700 text-white text-xs font-semibold rounded-full">
                                        Most Popular
                                    </div>
                                )}
                                <div className="mb-6">
                                    <h3 className="text-lg font-semibold text-neutral-900">{plan.name}</h3>
                                    <div className="mt-3 flex items-baseline gap-1">
                                        <span className="text-4xl font-bold text-neutral-900">{plan.price}</span>
                                        {plan.period && (
                                            <span className="text-sm text-neutral-500">/ {plan.period}</span>
                                        )}
                                    </div>
                                    <p className="mt-2 text-sm text-neutral-600">{plan.description}</p>
                                </div>
                                <ul className="space-y-3 mb-8 flex-1">
                                    {plan.features.map((feature) => (
                                        <li key={feature} className="flex items-start gap-2 text-sm text-neutral-700">
                                            <svg className="w-4 h-4 text-accent-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                            </svg>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                                <Link
                                    href={plan.ctaHref}
                                    className={`block text-center px-6 py-3 rounded-xl text-sm font-semibold transition-colors ${plan.highlighted
                                        ? 'bg-accent-700 text-white hover:bg-accent-800 shadow-sm'
                                        : plan.comingSoon
                                            ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
                                            : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
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
