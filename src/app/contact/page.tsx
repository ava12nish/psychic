'use client';

import { useState } from 'react';
import type { Metadata } from 'next';

export default function ContactPage() {
    return (
        <div className="min-h-[85vh] flex flex-col justify-center relative z-10 pt-32 pb-24">
            <section className="mb-12">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight mb-4">
                        Get in touch
                    </h1>
                    <p className="text-lg text-neutral-400 leading-relaxed">
                        Have a question or feedback? We&apos;d love to hear from you.
                    </p>
                </div>
            </section>

            <section className="flex-grow">
                <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="p-8 sm:p-10 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl">
                        <ContactForm />
                    </div>
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
                <div className="w-16 h-16 mx-auto rounded-full bg-green-500/20 flex items-center justify-center mb-6">
                    <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Message sent</h3>
                <p className="text-neutral-400">Thank you for reaching out. We&apos;ll get back to you soon.</p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {(['name', 'email', 'subject'] as const).map((field) => (
                <div key={field}>
                    <label className="block text-sm font-medium text-neutral-300 mb-2 capitalize">{field === 'subject' ? 'Subject (optional)' : field}</label>
                    <input
                        type={field === 'email' ? 'email' : 'text'}
                        value={form[field]}
                        onChange={(e) => { setForm({ ...form, [field]: e.target.value }); setErrors({ ...errors, [field]: '' }); }}
                        className={`w-full px-5 py-3 rounded-xl border ${errors[field] ? 'border-red-500/50 bg-red-500/5' : 'border-white/10 bg-black/20'} text-white placeholder-neutral-500 focus:border-accent-500 focus:bg-black/40 transition-all outline-none focus:ring-4 ring-accent-500/10`}
                        placeholder={field === 'name' ? 'Your name' : field === 'email' ? 'you@example.com' : 'What is this about?'}
                    />
                    {errors[field] && <p className="text-xs text-red-400 mt-2">{errors[field]}</p>}
                </div>
            ))}
            <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">Message</label>
                <textarea
                    value={form.message}
                    onChange={(e) => { setForm({ ...form, message: e.target.value }); setErrors({ ...errors, message: '' }); }}
                    rows={4}
                    className={`w-full px-5 py-3 rounded-xl border ${errors.message ? 'border-red-500/50 bg-red-500/5' : 'border-white/10 bg-black/20'} text-white placeholder-neutral-500 focus:border-accent-500 focus:bg-black/40 transition-all outline-none resize-none focus:ring-4 ring-accent-500/10`}
                    placeholder="Tell us what's on your mind..."
                />
                {errors.message && <p className="text-xs text-red-400 mt-2">{errors.message}</p>}
            </div>
            {errors.form && <p className="text-xs text-red-400">{errors.form}</p>}
            <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-4 mt-2 rounded-xl text-sm font-bold text-white bg-accent-600 hover:bg-accent-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] border border-accent-400/30"
            >
                {loading ? 'Sending...' : 'Send Message'}
            </button>
        </form>
    );
}
