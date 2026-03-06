import Link from 'next/link';

const footerLinks = {
    product: [
        { name: 'How It Works', href: '/how-it-works' },
        { name: 'Pricing', href: '/pricing' },
        { name: 'Get Your Reading', href: '/get-reading' },
        { name: 'FAQ', href: '/faq' },
    ],
    company: [
        { name: 'About', href: '/about' },
        { name: 'Contact', href: '/contact' },
        { name: 'Blog', href: '/blog' },
    ],
    legal: [
        { name: 'Privacy Policy', href: '/privacy' },
        { name: 'Terms of Service', href: '/terms' },
    ],
};

export default function Footer() {
    return (
        <footer className="bg-neutral-900 text-neutral-400">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
                    {/* Brand */}
                    <div className="md:col-span-1">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-accent-600 flex items-center justify-center">
                                <span className="text-white font-bold text-sm">P</span>
                            </div>
                            <span className="text-lg font-semibold text-white">Psychic</span>
                        </div>
                        <p className="text-sm leading-relaxed mb-6">
                            Personalized Vedic astrology readings powered by ancient wisdom and modern technology.
                            Understand your chart, your timing, and your path.
                        </p>
                        {/* Social placeholders */}
                        <div className="flex gap-3">
                            {['X', 'In', 'Ig'].map((social) => (
                                <a
                                    key={social}
                                    href="#"
                                    className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center text-xs text-neutral-400 hover:bg-neutral-700 hover:text-neutral-200 transition-colors"
                                >
                                    {social}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Product */}
                    <div>
                        <h4 className="text-sm font-semibold text-white mb-4 tracking-wide uppercase">Product</h4>
                        <ul className="space-y-2.5">
                            {footerLinks.product.map((link) => (
                                <li key={link.name}>
                                    <Link href={link.href} className="text-sm hover:text-white transition-colors">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h4 className="text-sm font-semibold text-white mb-4 tracking-wide uppercase">Company</h4>
                        <ul className="space-y-2.5">
                            {footerLinks.company.map((link) => (
                                <li key={link.name}>
                                    <Link href={link.href} className="text-sm hover:text-white transition-colors">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h4 className="text-sm font-semibold text-white mb-4 tracking-wide uppercase">Legal</h4>
                        <ul className="space-y-2.5">
                            {footerLinks.legal.map((link) => (
                                <li key={link.name}>
                                    <Link href={link.href} className="text-sm hover:text-white transition-colors">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                        <p className="mt-6 text-xs text-neutral-500">
                            contact@psychic.app
                        </p>
                    </div>
                </div>

                {/* Bottom */}
                <div className="mt-12 pt-8 border-t border-neutral-800">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                        <p className="text-xs text-neutral-500">
                            © {new Date().getFullYear()} Psychic. All rights reserved.
                        </p>
                        <p className="text-xs text-neutral-600 text-center max-w-lg">
                            Astrology content is provided for self-reflection and personal guidance.
                            It should not replace professional medical, legal, or financial advice.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
