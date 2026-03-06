'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function SignupPage() {
    const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);

    const validate = () => {
        const errs: Record<string, string> = {};
        if (!form.name.trim()) errs.name = 'Name is required';
        if (!form.email.trim()) errs.email = 'Email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Invalid email';
        if (!form.password) errs.password = 'Password is required';
        else if (form.password.length < 8) errs.password = 'Password must be at least 8 characters';
        if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match';
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);
        try {
            const res = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
            });
            const data = await res.json();
            if (data.success) {
                window.location.href = '/get-reading';
            } else {
                setErrors({ form: data.error || 'Could not create account' });
            }
        } catch {
            setErrors({ form: 'Something went wrong' });
        }
        setLoading(false);
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center py-20 bg-neutral-50">
            <div className="w-full max-w-md mx-auto px-4">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-neutral-900">Create your account</h1>
                    <p className="mt-2 text-sm text-neutral-600">Start your Vedic astrology journey</p>
                </div>

                <form onSubmit={handleSubmit} className="p-8 rounded-2xl bg-white border border-neutral-200 shadow-sm space-y-5">
                    {([
                        { key: 'name', label: 'Full Name', type: 'text', placeholder: 'Your name' },
                        { key: 'email', label: 'Email', type: 'email', placeholder: 'you@example.com' },
                        { key: 'password', label: 'Password', type: 'password', placeholder: '••••••••' },
                        { key: 'confirmPassword', label: 'Confirm Password', type: 'password', placeholder: '••••••••' },
                    ] as const).map((field) => (
                        <div key={field.key}>
                            <label className="block text-sm font-medium text-neutral-700 mb-1.5">{field.label}</label>
                            <input
                                type={field.type}
                                value={form[field.key]}
                                onChange={(e) => { setForm({ ...form, [field.key]: e.target.value }); setErrors({}); }}
                                className={`w-full px-4 py-2.5 rounded-xl border ${errors[field.key] ? 'border-red-400' : 'border-neutral-300'} bg-white text-sm text-neutral-900 placeholder-neutral-400`}
                                placeholder={field.placeholder}
                            />
                            {errors[field.key] && <p className="text-xs text-red-500 mt-1">{errors[field.key]}</p>}
                        </div>
                    ))}
                    {errors.form && <p className="text-xs text-red-500 text-center">{errors.form}</p>}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full px-6 py-3 rounded-xl text-sm font-semibold text-white bg-accent-700 hover:bg-accent-800 disabled:opacity-50 transition-colors"
                    >
                        {loading ? 'Creating account...' : 'Create Account'}
                    </button>
                    <p className="text-sm text-neutral-600 text-center">
                        Already have an account?{' '}
                        <Link href="/login" className="font-medium text-accent-700 hover:text-accent-800">Sign in</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}
