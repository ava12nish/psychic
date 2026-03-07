'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

const navigation = [
    { name: 'About', href: '/about' },
    { name: 'How It Works', href: '/how-it-works' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'FAQ', href: '/faq' },
    { name: 'Contact', href: '/contact' },
];

export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <div className="sticky top-4 z-50 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 md:mt-6 mb-4 md:mb-8 pointer-events-none">
            <header className="w-full bg-white/85 backdrop-blur-lg border border-neutral-200/80 shadow-lg shadow-neutral-200/30 rounded-2xl pointer-events-auto transition-all">
                <div className="px-4 sm:px-5">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-2 group">
                            <Image
                                src="/logo.png"
                                alt="Psychic Logo"
                                width={32}
                                height={32}
                                className="rounded-lg shadow-sm"
                            />
                            <span className="text-lg font-semibold text-neutral-900 group-hover:text-accent-700 transition-colors">
                                Psychic
                            </span>
                        </Link>

                        {/* Desktop Nav */}
                        <nav className="hidden md:flex items-center gap-1">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className="px-3 py-2 text-sm font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </nav>

                        {/* Desktop Auth + CTA */}
                        <div className="hidden md:flex items-center gap-3">
                            <Link
                                href="/login"
                                className="px-3 py-2 text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors"
                            >
                                Sign In
                            </Link>
                            <Link
                                href="/get-reading"
                                className="px-4 py-2 text-sm font-semibold text-white bg-accent-700 hover:bg-accent-800 rounded-lg transition-colors shadow-sm"
                            >
                                Get Your Reading
                            </Link>
                        </div>

                        {/* Mobile Hamburger */}
                        <button
                            className="md:hidden p-2 rounded-lg text-neutral-600 hover:bg-neutral-100 transition-colors"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            aria-label="Toggle menu"
                        >
                            {mobileMenuOpen ? (
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="4" y1="8" x2="20" y2="8" /><line x1="4" y1="16" x2="20" y2="16" />
                                </svg>
                            )}
                        </button>
                    </div>

                    {/* Mobile Menu */}
                    {mobileMenuOpen && (
                        <div className="md:hidden border-t border-neutral-200/50 py-4 animate-fade-in px-2">
                            <nav className="flex flex-col gap-1">
                                {navigation.map((item) => (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className="px-3 py-2.5 text-sm font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        {item.name}
                                    </Link>
                                ))}
                                <hr className="my-2 border-neutral-200/50" />
                                <Link
                                    href="/login"
                                    className="px-3 py-2.5 text-sm font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Sign In
                                </Link>
                                <Link
                                    href="/get-reading"
                                    className="mx-3 mt-1 px-4 py-2.5 text-sm font-semibold text-white bg-accent-700 hover:bg-accent-800 rounded-lg transition-colors text-center"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Get Your Reading
                                </Link>
                            </nav>
                        </div>
                    )}
                </div>
            </header>
        </div>
    );
}
