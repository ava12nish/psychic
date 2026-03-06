import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Terms of Service — Psychic',
    description: 'Terms and conditions for using Psychic astrology services.',
};

export default function TermsPage() {
    return (
        <div className="py-20 bg-white">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-neutral-900 mb-8">Terms of Service</h1>
                <p className="text-sm text-neutral-500 mb-8">Last updated: March 2026</p>

                <div className="prose prose-neutral prose-sm max-w-none space-y-6">
                    <section>
                        <h2 className="text-lg font-semibold text-neutral-900 mb-3">1. Acceptance of Terms</h2>
                        <p className="text-neutral-600 leading-relaxed">
                            By accessing or using Psychic (&ldquo;the Service&rdquo;), you agree to be bound by these Terms
                            of Service. If you do not agree, please do not use the Service.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-neutral-900 mb-3">2. Description of Service</h2>
                        <p className="text-neutral-600 leading-relaxed">
                            Psychic provides personalized Vedic astrology readings based on user-provided birth data.
                            The Service includes chart calculations, dasha timelines, interpretation summaries,
                            and an interactive Q&A feature.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-neutral-900 mb-3">3. Disclaimer</h2>
                        <p className="text-neutral-600 leading-relaxed font-medium">
                            Astrology content provided by Psychic is for entertainment, self-reflection, and personal
                            guidance purposes only. It should not be considered professional medical, financial, legal,
                            or psychological advice. Always consult qualified professionals for important life decisions.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-neutral-900 mb-3">4. User Accounts</h2>
                        <p className="text-neutral-600 leading-relaxed">
                            When you create an account, you are responsible for maintaining the confidentiality
                            of your credentials. You agree to provide accurate information and accept responsibility
                            for all activities under your account.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-neutral-900 mb-3">5. User Data</h2>
                        <p className="text-neutral-600 leading-relaxed">
                            You retain ownership of the personal data you provide. By using the Service, you grant
                            us permission to process your birth data for the purpose of generating astrology readings.
                            See our Privacy Policy for details on data handling.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-neutral-900 mb-3">6. Accuracy of Calculations</h2>
                        <p className="text-neutral-600 leading-relaxed">
                            While we strive for accuracy in our astronomical calculations, we make no guarantees
                            about the absolute precision of chart data. Calculations are based on simplified
                            astronomical models suitable for astrological analysis. For research or professional
                            purposes, we recommend cross-referencing with established ephemerides.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-neutral-900 mb-3">7. Limitation of Liability</h2>
                        <p className="text-neutral-600 leading-relaxed">
                            Psychic shall not be liable for any direct, indirect, incidental, or consequential damages
                            arising from your use of the Service. The Service is provided &ldquo;as is&rdquo; without warranties
                            of any kind, express or implied.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-neutral-900 mb-3">8. Intellectual Property</h2>
                        <p className="text-neutral-600 leading-relaxed">
                            All content, design, code, and functionality of the Service are owned by Psychic.
                            Your generated readings are for your personal use and may not be reproduced commercially
                            without permission.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-neutral-900 mb-3">9. Modifications</h2>
                        <p className="text-neutral-600 leading-relaxed">
                            We reserve the right to modify these Terms at any time. Significant changes will be
                            communicated through the Service. Continued use after modifications constitutes acceptance.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-neutral-900 mb-3">10. Contact</h2>
                        <p className="text-neutral-600 leading-relaxed">
                            For questions about these Terms, contact us at contact@psychic.app.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
