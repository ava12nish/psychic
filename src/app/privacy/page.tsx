import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Privacy Policy — Psychic',
    description: 'How Psychic handles your personal data and privacy.',
};

export default function PrivacyPage() {
    return (
        <div className="py-20 bg-white">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-neutral-900 mb-8">Privacy Policy</h1>
                <p className="text-sm text-neutral-500 mb-8">Last updated: March 2026</p>

                <div className="prose prose-neutral prose-sm max-w-none space-y-6">
                    <section>
                        <h2 className="text-lg font-semibold text-neutral-900 mb-3">1. Information We Collect</h2>
                        <p className="text-neutral-600 leading-relaxed">
                            When you use Psychic, we collect the following personal information that you voluntarily provide:
                        </p>
                        <ul className="list-disc pl-5 text-neutral-600 space-y-1 mt-2">
                            <li>Full name</li>
                            <li>Date, time, and place of birth</li>
                            <li>Email address (for account creation)</li>
                            <li>Questions you ask through the Q&A feature</li>
                            <li>Contact form submissions</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-neutral-900 mb-3">2. How We Use Your Information</h2>
                        <p className="text-neutral-600 leading-relaxed">
                            Your personal information is used solely to:
                        </p>
                        <ul className="list-disc pl-5 text-neutral-600 space-y-1 mt-2">
                            <li>Generate your personalized Vedic astrology reading</li>
                            <li>Geocode your birth place for chart calculation accuracy</li>
                            <li>Store your reading results for your access</li>
                            <li>Process and respond to your Q&A questions</li>
                            <li>Respond to contact inquiries</li>
                            <li>Improve our services</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-neutral-900 mb-3">3. Data Sharing</h2>
                        <p className="text-neutral-600 leading-relaxed">
                            We do not sell, rent, or share your personal information with third parties for marketing purposes.
                            We may use third-party services (such as geocoding providers) to resolve your birth location,
                            but only the place name is shared — never your personal identity information.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-neutral-900 mb-3">4. Data Security</h2>
                        <p className="text-neutral-600 leading-relaxed">
                            We implement reasonable security measures to protect your personal information.
                            Passwords are hashed using industry-standard algorithms. However, no method of
                            transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-neutral-900 mb-3">5. Data Retention</h2>
                        <p className="text-neutral-600 leading-relaxed">
                            We retain your personal data for as long as your account is active or as needed to
                            provide you services. You may request deletion of your data at any time by contacting us.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-neutral-900 mb-3">6. Your Rights</h2>
                        <p className="text-neutral-600 leading-relaxed">
                            You have the right to access, correct, or delete your personal data.
                            You may also request a copy of the data we hold about you. To exercise these rights,
                            please contact us at contact@psychic.app.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-neutral-900 mb-3">7. Cookies</h2>
                        <p className="text-neutral-600 leading-relaxed">
                            We use essential cookies to maintain your session and preferences.
                            We do not use tracking or advertising cookies.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-neutral-900 mb-3">8. Changes to This Policy</h2>
                        <p className="text-neutral-600 leading-relaxed">
                            We may update this privacy policy from time to time. We will notify you of
                            significant changes by posting a notice on our website. Your continued use of
                            the service constitutes acceptance of the updated policy.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-neutral-900 mb-3">9. Contact</h2>
                        <p className="text-neutral-600 leading-relaxed">
                            For any privacy-related questions or requests, contact us at contact@psychic.app.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
