'use client';

import { useState } from 'react';
import type { Metadata } from 'next';

export default function ContactPage() {
    return (
        <div>
            <section className="py-12 sm:py-16 bg-gradient-to-b from-accent-50/40 to-white flex-shrink-0">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 tracking-tight">
                        Get in touch
                    </h1>
                    <p className="mt-4 text-base text-neutral-600 leading-relaxed">
                        Have a question or feedback? We&apos;d love to hear from you.
                    </p>
                </div>
            </section>

            <section className="py-4 pb-12 bg-white flex-grow">
                <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
                    <ContactForm />
                </div>
            </section>
        </div>
    );
}

function ContactForm() {
    const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const validate = () => {
        const errs: Record<string, string> = {};
        if (!form.name.trim()) errs.name = 'Name is required';
        if (!form.email.trim()) errs.email = 'Email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Invalid email';
        if (!form.message.trim()) errs.message = 'Message is required';
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);
        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });
            if (res.ok) setSuccess(true);
        } catch {
            setErrors({ form: 'Something went wrong. Please try again.' });
        }
        setLoading(false);
    };

    if (success) {
        return (
            <div className="text-center py-12 animate-fade-in">
                <div className="w-16 h-16 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                </div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">Message sent</h3>
                <p className="text-sm text-neutral-600">Thank you for reaching out. We&apos;ll get back to you soon.</p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {(['name', 'email', 'subject'] as const).map((field) => (
                <div key={field}>
                    <label className="block text-sm font-medium text-neutral-700 mb-1.5 capitalize">{field === 'subject' ? 'Subject (optional)' : field}</label>
                    <input
                        type={field === 'email' ? 'email' : 'text'}
                        value={form[field]}
                        onChange={(e) => { setForm({ ...form, [field]: e.target.value }); setErrors({ ...errors, [field]: '' }); }}
                        className={`w-full px-4 py-2.5 rounded-xl border ${errors[field] ? 'border-red-400' : 'border-neutral-300'} bg-white text-sm text-neutral-900 placeholder-neutral-400 focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20 transition-all`}
                        placeholder={field === 'name' ? 'Your name' : field === 'email' ? 'you@example.com' : 'What is this about?'}
                    />
                    {errors[field] && <p className="text-xs text-red-500 mt-1">{errors[field]}</p>}
                </div>
            ))}
            <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">Message</label>
                <textarea
                    value={form.message}
                    onChange={(e) => { setForm({ ...form, message: e.target.value }); setErrors({ ...errors, message: '' }); }}
                    rows={4}
                    className={`w-full px-4 py-2.5 rounded-xl border ${errors.message ? 'border-red-400' : 'border-neutral-300'} bg-white text-sm text-neutral-900 placeholder-neutral-400 focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20 transition-all resize-none`}
                    placeholder="Tell us what's on your mind..."
                />
                {errors.message && <p className="text-xs text-red-500 mt-1">{errors.message}</p>}
            </div>
            {errors.form && <p className="text-xs text-red-500">{errors.form}</p>}
            <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-3 rounded-xl text-sm font-semibold text-white bg-accent-700 hover:bg-accent-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
            >
                {loading ? 'Sending...' : 'Send Message'}
            </button>
        </form>
    );
}
