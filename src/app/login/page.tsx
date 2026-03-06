'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function LoginPage() {
    const [form, setForm] = useState({ email: '', password: '' });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);

    const validate = () => {
        const errs: Record<string, string> = {};
        if (!form.email.trim()) errs.email = 'Email is required';
        if (!form.password) errs.password = 'Password is required';
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });
            const data = await res.json();
            if (data.success) {
                window.location.href = '/get-reading';
            } else {
                setErrors({ form: data.error || 'Invalid credentials' });
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
                    <h1 className="text-2xl font-bold text-neutral-900">Welcome back</h1>
                    <p className="mt-2 text-sm text-neutral-600">Sign in to access your readings</p>
                </div>

                <form onSubmit={handleSubmit} className="p-8 rounded-2xl bg-white border border-neutral-200 shadow-sm space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1.5">Email</label>
                        <input
                            type="email"
                            value={form.email}
                            onChange={(e) => { setForm({ ...form, email: e.target.value }); setErrors({}); }}
                            className={`w-full px-4 py-2.5 rounded-xl border ${errors.email ? 'border-red-400' : 'border-neutral-300'} bg-white text-sm text-neutral-900 placeholder-neutral-400`}
                            placeholder="you@example.com"
                        />
                        {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1.5">Password</label>
                        <input
                            type="password"
                            value={form.password}
                            onChange={(e) => { setForm({ ...form, password: e.target.value }); setErrors({}); }}
                            className={`w-full px-4 py-2.5 rounded-xl border ${errors.password ? 'border-red-400' : 'border-neutral-300'} bg-white text-sm text-neutral-900 placeholder-neutral-400`}
                            placeholder="••••••••"
                        />
                        {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
                    </div>
                    {errors.form && <p className="text-xs text-red-500 text-center">{errors.form}</p>}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full px-6 py-3 rounded-xl text-sm font-semibold text-white bg-accent-700 hover:bg-accent-800 disabled:opacity-50 transition-colors"
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                    <p className="text-sm text-neutral-600 text-center">
                        Don&apos;t have an account?{' '}
                        <Link href="/signup" className="font-medium text-accent-700 hover:text-accent-800">Sign up</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}
