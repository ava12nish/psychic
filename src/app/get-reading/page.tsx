'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function GetReadingPage() {
    const router = useRouter();
    const [form, setForm] = useState({
        fullName: '',
        birthDate: '',
        birthTime: '',
        birthPlace: '',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    const [serverError, setServerError] = useState('');

    const validate = () => {
        const errs: Record<string, string> = {};
        if (!form.fullName.trim()) errs.fullName = 'Name is required';
        if (!form.birthDate) errs.birthDate = 'Birth date is required';
        if (!form.birthTime) errs.birthTime = 'Birth time is required for accurate chart calculation';
        if (!form.birthPlace.trim()) errs.birthPlace = 'Birth place is required';
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);
        setServerError('');

        try {
            const res = await fetch('/api/chart/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });
            const data = await res.json();

            if (data.success && data.id) {
                router.push(`/reading/${data.id}`);
            } else {
                setServerError(data.error?.message || 'Failed to generate reading. Please try again.');
            }
        } catch {
            setServerError('Something went wrong. Please check your connection and try again.');
        }
        setLoading(false);
    };

    return (
        <div className="min-h-[80vh] py-16 sm:py-24 bg-gradient-to-b from-accent-50/30 to-neutral-50">
            <div className="max-w-xl mx-auto px-4 sm:px-6">
                {/* Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-100 text-accent-700 text-xs font-medium mb-4">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent-500" />
                        Free Vedic Chart
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 tracking-tight">
                        Generate your reading
                    </h1>
                    <p className="mt-3 text-neutral-600 text-base">
                        Enter your birth details below. Your chart will be calculated using real sidereal astronomy.
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-8 rounded-2xl bg-white border border-neutral-200 shadow-sm space-y-6">
                    {/* Name */}
                    <div>
                        <label htmlFor="fullName" className="block text-sm font-medium text-neutral-700 mb-1.5">
                            Full Name
                        </label>
                        <input
                            id="fullName"
                            type="text"
                            value={form.fullName}
                            onChange={(e) => { setForm({ ...form, fullName: e.target.value }); setErrors({ ...errors, fullName: '' }); }}
                            className={`w-full px-4 py-3 rounded-xl border ${errors.fullName ? 'border-red-400' : 'border-neutral-300'} bg-white text-sm text-neutral-900 placeholder-neutral-400 focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20 transition-all`}
                            placeholder="e.g. Arjun Sharma"
                        />
                        {errors.fullName && <p className="text-xs text-red-500 mt-1.5">{errors.fullName}</p>}
                    </div>

                    {/* Date & Time row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="birthDate" className="block text-sm font-medium text-neutral-700 mb-1.5">
                                Date of Birth
                            </label>
                            <input
                                id="birthDate"
                                type="date"
                                value={form.birthDate}
                                onChange={(e) => { setForm({ ...form, birthDate: e.target.value }); setErrors({ ...errors, birthDate: '' }); }}
                                className={`w-full px-4 py-3 rounded-xl border ${errors.birthDate ? 'border-red-400' : 'border-neutral-300'} bg-white text-sm text-neutral-900 focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20 transition-all`}
                            />
                            {errors.birthDate && <p className="text-xs text-red-500 mt-1.5">{errors.birthDate}</p>}
                        </div>

                        <div>
                            <label htmlFor="birthTime" className="block text-sm font-medium text-neutral-700 mb-1.5">
                                Time of Birth
                            </label>
                            <input
                                id="birthTime"
                                type="time"
                                value={form.birthTime}
                                onChange={(e) => { setForm({ ...form, birthTime: e.target.value }); setErrors({ ...errors, birthTime: '' }); }}
                                className={`w-full px-4 py-3 rounded-xl border ${errors.birthTime ? 'border-red-400' : 'border-neutral-300'} bg-white text-sm text-neutral-900 focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20 transition-all`}
                            />
                            {errors.birthTime && <p className="text-xs text-red-500 mt-1.5">{errors.birthTime}</p>}
                            <p className="text-xs text-neutral-400 mt-1">24-hour format, as precise as possible</p>
                        </div>
                    </div>

                    {/* Place */}
                    <div>
                        <label htmlFor="birthPlace" className="block text-sm font-medium text-neutral-700 mb-1.5">
                            Place of Birth
                        </label>
                        <input
                            id="birthPlace"
                            type="text"
                            value={form.birthPlace}
                            onChange={(e) => { setForm({ ...form, birthPlace: e.target.value }); setErrors({ ...errors, birthPlace: '' }); }}
                            className={`w-full px-4 py-3 rounded-xl border ${errors.birthPlace ? 'border-red-400' : 'border-neutral-300'} bg-white text-sm text-neutral-900 placeholder-neutral-400 focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20 transition-all`}
                            placeholder="e.g. Mumbai, India"
                        />
                        {errors.birthPlace && <p className="text-xs text-red-500 mt-1.5">{errors.birthPlace}</p>}
                        <p className="text-xs text-neutral-400 mt-1">Include city and country for best accuracy</p>
                    </div>

                    {/* Server error */}
                    {serverError && (
                        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
                            {serverError}
                        </div>
                    )}

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full px-6 py-3.5 rounded-xl text-base font-semibold text-white bg-accent-700 hover:bg-accent-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-accent-700/20"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                                Generating your reading...
                            </span>
                        ) : (
                            'Generate My Reading'
                        )}
                    </button>

                    <p className="text-xs text-neutral-400 text-center">
                        Free preview includes chart summary and current dasha. No account required.
                    </p>
                </form>

                {/* Info card */}
                <div className="mt-8 p-5 rounded-xl bg-white border border-neutral-200">
                    <h3 className="text-sm font-semibold text-neutral-700 mb-2">Why we need this information</h3>
                    <p className="text-xs text-neutral-500 leading-relaxed">
                        Your birth date, time, and place are required to compute the exact positions of celestial bodies
                        at the moment of your birth. This data determines your ascendant, house placements, planetary positions,
                        and Vimshottari Dasha timeline — all of which are unique to your birth moment and location.
                    </p>
                </div>
            </div>
        </div>
    );
}
