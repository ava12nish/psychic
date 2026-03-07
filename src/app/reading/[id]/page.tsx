'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { FadeIn } from '@/components/ui/FadeIn';
import { Stagger, StaggerItem } from '@/components/ui/Stagger';

interface ChartData {
    id: string;
    birthProfile: {
        fullName: string;
        birthDate: string;
        birthTime: string;
        birthPlace: string;
        latitude: number;
        longitude: number;
        timezone: string;
    };
    chartData: {
        ascendant: { sign: { name: string; sanskrit: string }; degree: number; nakshatra: { name: string; pada: number } };
        moonSign: { name: string; sanskrit: string };
        sunSign: { name: string; sanskrit: string };
        planets: Array<{
            id: string; name: string; sanskrit: string; sign: { name: string; sanskrit: string };
            house: number; degreeInSign: number; nakshatra: { name: string; pada: number };
            isRetrograde: boolean; isExalted: boolean; isDebilitated: boolean;
        }>;
        houses: Array<{
            house: number; sign: { name: string; sanskrit: string }; ruler: string; planets: string[];
        }>;
    };
    dashaData: {
        system: string;
        birthNakshatra: { name: string; lord: string; pada: number };
        dashaBalance: number;
        currentMahadasha: { lord: string; lordSanskrit: string; startDate: string; endDate: string; durationYears: number; subPeriods?: Array<{ lord: string; startDate: string; endDate: string; isActive: boolean; durationYears: number }> };
        currentAntardasha: { lord: string; lordSanskrit: string; startDate: string; endDate: string };
        mahadashas: Array<{ lord: string; lordSanskrit: string; startDate: string; endDate: string; durationYears: number; isActive: boolean }>;
    };
    interpretation: {
        personalityOverview: string;
        strengths: string[];
        challenges: string[];
        careerThemes: string;
        relationshipThemes: string;
        currentPeriodFocus: string;
        mindfulnessNotes: string[];
        lifePathSummary: string;
    };
    aiContext: any;
    messages: Array<{ role: string; content: string; createdAt: string }>;
}

const suggestedQuestions = [
    'How is my career looking this year?',
    'What should I focus on right now?',
    'What does my chart say about relationships?',
    'What should I be mindful of during this dasha?',
    'What are my natural strengths?',
    'How can I make the best of this period?',
];

export default function ReadingPage() {
    const params = useParams();
    const id = params.id as string;
    const [data, setData] = useState<ChartData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [question, setQuestion] = useState('');
    const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([]);
    const [askingQuestion, setAskingQuestion] = useState(false);
    const [activeTab, setActiveTab] = useState<'overview' | 'planets' | 'houses' | 'dasha'>('overview');

    useEffect(() => {
        fetchChart();
    }, [id]);

    const fetchChart = async () => {
        if (id === 'local') {
            try {
                const stored = sessionStorage.getItem('psychic_reading_local');
                if (stored) {
                    const parsed = JSON.parse(stored);
                    setData(parsed);
                    setMessages(parsed.messages || []);
                    setLoading(false);
                    return;
                } else {
                    setError('No local reading found. Please generate a new one.');
                    setLoading(false);
                    return;
                }
            } catch {
                setError('Failed to load local reading.');
                setLoading(false);
                return;
            }
        }

        try {
            const res = await fetch(`/api/chart/${id}`);
            const json = await res.json();
            if (json.success) {
                setData(json.chart);
                setMessages(json.chart.messages || []);
            } else {
                setError('Reading not found');
            }
        } catch {
            setError('Failed to load reading');
        }
        setLoading(false);
    };

    const askQuestion = async (q: string) => {
        const questionText = q || question;
        if (!questionText.trim()) return;

        setMessages(prev => [...prev, { role: 'user', content: questionText }]);
        setQuestion('');
        setAskingQuestion(true);

        try {
            const res = await fetch(`/api/chart/${id}/questions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ question: questionText, aiContext: data?.aiContext }),
            });
            const json = await res.json();
            if (json.success) {
                setMessages(prev => [...prev, { role: 'assistant', content: json.answer }]);
            }
        } catch {
            setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I couldn\'t process your question. Please try again.' }]);
        }
        setAskingQuestion(false);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center relative z-10">
                <div className="text-center">
                    <div className="w-16 h-16 mx-auto rounded-full bg-accent-500/20 shadow-[0_0_30px_rgba(59,130,246,0.3)] flex items-center justify-center mb-6 animate-pulse">
                        <div className="w-8 h-8 rounded-full border-2 border-accent-400 border-t-transparent animate-spin" />
                    </div>
                    <p className="text-neutral-400">Decoding your cosmic blueprint...</p>
                </div>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="min-h-screen flex items-center justify-center relative z-10">
                <div className="text-center p-10 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl max-w-md mx-auto shadow-2xl">
                    <h2 className="text-xl font-bold text-white mb-3">Reading not found</h2>
                    <p className="text-neutral-400 mb-6">{error || 'This reading may have expired or does not exist.'}</p>
                    <a href="/get-reading" className="inline-flex px-8 py-3 text-sm font-bold text-white bg-accent-600 hover:bg-accent-500 rounded-xl transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)]">
                        Generate New Reading
                    </a>
                </div>
            </div>
        );
    }

    const { chartData, dashaData, interpretation, birthProfile } = data;

    return (
        <div className="relative z-10 min-h-screen pb-24">
            {/* Welcome Header */}
            <div className="pt-24 pb-12 sm:pt-32 sm:pb-16 border-b border-white/5 bg-black/20 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <FadeIn direction="up">
                        <div className="max-w-3xl">
                            <p className="text-accent-400 text-sm font-semibold uppercase tracking-wider mb-3">Your Cosmic Blueprint</p>
                            <h1 className="text-4xl sm:text-6xl font-bold text-white tracking-tight mb-4">
                                {birthProfile.fullName}
                            </h1>
                            <div className="flex flex-wrap items-center gap-3 text-sm text-neutral-400 font-medium">
                                <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10">{birthProfile.birthDate}</span>
                                <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10">{birthProfile.birthTime}</span>
                                <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10">{birthProfile.birthPlace}</span>
                            </div>
                        </div>
                    </FadeIn>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {/* Chart Summary Cards */}
                <Stagger className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10 -mt-16">
                    <StaggerItem>
                        <div className="p-6 rounded-3xl bg-white/10 border border-white/20 backdrop-blur-xl shadow-2xl hover:bg-white/15 transition-all">
                            <p className="text-xs font-bold text-accent-400 uppercase tracking-widest mb-2">Ascendant (Lagna)</p>
                            <p className="text-3xl font-bold text-white mb-1">{chartData.ascendant.sign.name}</p>
                            <p className="text-sm text-neutral-400">{chartData.ascendant.sign.sanskrit} · {chartData.ascendant.degree.toFixed(1)}°</p>
                            <p className="text-xs text-neutral-500 mt-2 border-t border-white/10 pt-2">{chartData.ascendant.nakshatra.name} (Pada {chartData.ascendant.nakshatra.pada})</p>
                        </div>
                    </StaggerItem>
                    <StaggerItem>
                        <div className="p-6 rounded-3xl bg-white/10 border border-white/20 backdrop-blur-xl shadow-2xl hover:bg-white/15 transition-all">
                            <p className="text-xs font-bold text-accent-400 uppercase tracking-widest mb-2">Moon Sign (Rashi)</p>
                            <p className="text-3xl font-bold text-white mb-1">{chartData.moonSign.name}</p>
                            <p className="text-sm text-neutral-400">{chartData.moonSign.sanskrit}</p>
                            <p className="text-xs text-neutral-500 mt-2 border-t border-white/10 pt-2">Nakshatra: {dashaData.birthNakshatra.name} (Pada {dashaData.birthNakshatra.pada})</p>
                        </div>
                    </StaggerItem>
                    <StaggerItem>
                        <div className="p-6 rounded-3xl bg-accent-950/40 border border-accent-500/30 backdrop-blur-xl shadow-[0_0_30px_rgba(59,130,246,0.15)] relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-accent-500/10 to-transparent" />
                            <div className="relative z-10">
                                <p className="text-xs font-bold text-accent-300 uppercase tracking-widest mb-2 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-accent-400 animate-pulse" />
                                    Current Dasha
                                </p>
                                <p className="text-3xl font-bold text-white mb-1">{dashaData.currentMahadasha.lord}</p>
                                <p className="text-sm text-accent-200">{dashaData.currentMahadasha.lordSanskrit} MD</p>
                                <p className="text-xs text-accent-400/80 mt-2 border-t border-accent-500/20 pt-2">Antardasha: {dashaData.currentAntardasha.lord}</p>
                            </div>
                        </div>
                    </StaggerItem>
                </Stagger>

                {/* Tab Navigation */}
                <FadeIn delay={0.2} className="flex gap-2 mb-8 bg-black/40 rounded-2xl border border-white/10 p-1.5 overflow-x-auto backdrop-blur-md">
                    {(['overview', 'planets', 'houses', 'dasha'] as const).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${activeTab === tab
                                ? 'bg-accent-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]'
                                : 'text-neutral-400 hover:bg-white/5 hover:text-white'
                                }`}
                        >
                            {tab === 'overview' ? 'Overview' : tab === 'planets' ? 'Planetary Placements' : tab === 'houses' ? 'Houses' : 'Dasha Timeline'}
                        </button>
                    ))}
                </FadeIn>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {activeTab === 'overview' && (
                            <FadeIn direction="up">
                                <div className="space-y-6">
                                    {/* Personality Overview */}
                                    <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl hover:bg-white/[0.07] transition-colors">
                                        <h2 className="text-xl font-bold text-white mb-4">Personality Overview</h2>
                                        <p className="text-neutral-300 leading-relaxed text-lg">{interpretation.personalityOverview}</p>
                                    </div>

                                    {/* Strengths & Challenges */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl">
                                            <h3 className="text-base font-bold text-white mb-4 flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center border border-green-500/30">
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                </div>
                                                Core Strengths
                                            </h3>
                                            <ul className="space-y-3">
                                                {interpretation.strengths.map((s, i) => (
                                                    <li key={i} className="text-sm text-neutral-300 leading-relaxed flex items-start gap-2">
                                                        <span className="text-green-400/50 mt-0.5">•</span>
                                                        {s}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl">
                                            <h3 className="text-base font-bold text-white mb-4 flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                                    </svg>
                                                </div>
                                                Karmic Challenges
                                            </h3>
                                            <ul className="space-y-3">
                                                {interpretation.challenges.map((c, i) => (
                                                    <li key={i} className="text-sm text-neutral-300 leading-relaxed flex items-start gap-2">
                                                        <span className="text-amber-400/50 mt-0.5">•</span>
                                                        {c}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>

                                    {/* Career & Relationships */}
                                    <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl">
                                        <div className="mb-8">
                                            <h3 className="text-base font-bold text-accent-400 uppercase tracking-wider mb-3">Career & Dharma</h3>
                                            <p className="text-neutral-300 leading-relaxed">{interpretation.careerThemes}</p>
                                        </div>
                                        <div className="pt-8 border-t border-white/10">
                                            <h3 className="text-base font-bold text-pink-400 uppercase tracking-wider mb-3">Love & Relationships</h3>
                                            <p className="text-neutral-300 leading-relaxed">{interpretation.relationshipThemes}</p>
                                        </div>
                                    </div>

                                    {/* Current Period Focus & Mindfulness */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="p-8 rounded-3xl bg-gradient-to-br from-accent-900/40 to-indigo-900/40 border border-accent-500/30 backdrop-blur-xl shadow-[0_0_30px_rgba(79,70,229,0.1)]">
                                            <h3 className="text-base font-bold text-white mb-3">Current Period Focus</h3>
                                            <p className="text-accent-200 leading-relaxed text-sm">{interpretation.currentPeriodFocus}</p>
                                        </div>
                                        <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl">
                                            <h3 className="text-base font-bold text-white mb-4">Mindfulness Notes</h3>
                                            <ul className="space-y-4">
                                                {interpretation.mindfulnessNotes.map((n, i) => (
                                                    <li key={i} className="text-sm text-neutral-400 leading-relaxed pl-4 border-l-2 border-accent-500/50">
                                                        {n}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>

                                    {/* Life Path Summary */}
                                    <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl text-center">
                                        <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-4">Conclusion</h3>
                                        <p className="text-xl text-white font-serif italic leading-relaxed max-w-2xl mx-auto">
                                            "{interpretation.lifePathSummary}"
                                        </p>
                                    </div>
                                </div>
                            </FadeIn>
                        )}

                        {activeTab === 'planets' && (
                            <FadeIn direction="up">
                                <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl overflow-x-auto">
                                    <h2 className="text-xl font-bold text-white mb-6">Planetary Placements</h2>
                                    <table className="w-full text-left border-collapse min-w-[600px]">
                                        <thead>
                                            <tr className="border-b border-white/10">
                                                <th className="py-4 pr-4 font-semibold text-neutral-400 text-sm tracking-wider uppercase">Planet</th>
                                                <th className="py-4 pr-4 font-semibold text-neutral-400 text-sm tracking-wider uppercase">Sign</th>
                                                <th className="py-4 pr-4 font-semibold text-neutral-400 text-sm tracking-wider uppercase">House</th>
                                                <th className="py-4 pr-4 font-semibold text-neutral-400 text-sm tracking-wider uppercase">Degree</th>
                                                <th className="py-4 pr-4 font-semibold text-neutral-400 text-sm tracking-wider uppercase">Nakshatra</th>
                                                <th className="py-4 font-semibold text-neutral-400 text-sm tracking-wider uppercase">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {chartData.planets.map((p) => (
                                                <tr key={p.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                                    <td className="py-4 pr-4">
                                                        <div className="font-bold text-white text-base">{p.name}</div>
                                                        <div className="text-xs text-neutral-500 mt-0.5">{p.sanskrit}</div>
                                                    </td>
                                                    <td className="py-4 pr-4">
                                                        <span className="text-white font-medium">{p.sign.name}</span>
                                                        <span className="text-xs text-neutral-500 ml-1.5">({p.sign.sanskrit})</span>
                                                    </td>
                                                    <td className="py-4 pr-4">
                                                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-white/10 text-white font-bold text-sm">
                                                            {p.house}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 pr-4 text-neutral-300 font-medium">{p.degreeInSign.toFixed(1)}°</td>
                                                    <td className="py-4 pr-4 text-neutral-300">
                                                        {p.nakshatra.name}
                                                        <span className="text-xs text-neutral-500 ml-1.5">(P{p.nakshatra.pada})</span>
                                                    </td>
                                                    <td className="py-4">
                                                        <div className="flex gap-2 flex-wrap">
                                                            {p.isRetrograde && <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-orange-500/20 text-orange-400 border border-orange-500/30">Retrograde</span>}
                                                            {p.isExalted && <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-green-500/20 text-green-400 border border-green-500/30">Exalted</span>}
                                                            {p.isDebilitated && <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-red-500/20 text-red-400 border border-red-500/30">Debilitated</span>}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </FadeIn>
                        )}

                        {activeTab === 'houses' && (
                            <FadeIn direction="up">
                                <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl">
                                    <h2 className="text-xl font-bold text-white mb-6">House Breakdown</h2>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {chartData.houses.map((h) => (
                                            <div key={h.house} className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all">
                                                <div className="flex items-center justify-between mb-3">
                                                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-accent-500/20 text-accent-300 font-bold text-sm">
                                                        {h.house}
                                                    </span>
                                                    <span className="text-xs text-neutral-500 uppercase tracking-wider font-semibold">Ruler: {h.ruler}</span>
                                                </div>
                                                <p className="text-white font-medium mb-3">{h.sign.name} <span className="text-xs text-neutral-500 ml-1">({h.sign.sanskrit})</span></p>
                                                {h.planets.length > 0 ? (
                                                    <div className="flex gap-1.5 flex-wrap">
                                                        {h.planets.map((p) => (
                                                            <span key={p} className="px-2.5 py-1 rounded-lg bg-white/10 text-white text-xs font-medium border border-white/10">{p}</span>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <p className="text-xs text-neutral-600 italic">Empty House</p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </FadeIn>
                        )}

                        {activeTab === 'dasha' && (
                            <FadeIn direction="up">
                                <div className="space-y-6">
                                    <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl">
                                        <div className="flex justify-between items-start mb-8">
                                            <div>
                                                <h2 className="text-xl font-bold text-white mb-2">Vimshottari Dasha Timeline</h2>
                                                <p className="text-sm text-neutral-400">Based on Moon in {dashaData.birthNakshatra.name} (lord: {dashaData.birthNakshatra.lord})</p>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            {dashaData.mahadashas.slice(0, 10).map((d, i) => {
                                                const start = new Date(d.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
                                                const end = new Date(d.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
                                                return (
                                                    <div
                                                        key={i}
                                                        className={`flex items-center justify-between p-4 rounded-2xl transition-all ${d.isActive
                                                            ? 'bg-accent-500/10 border border-accent-500/40 shadow-[0_0_20px_rgba(37,99,235,0.15)]'
                                                            : 'bg-white/5 border border-white/5 hover:bg-white/10'
                                                            }`}
                                                    >
                                                        <div className="flex items-center gap-4">
                                                            <div className={`w-3 h-3 rounded-full shadow-lg ${d.isActive ? 'bg-accent-400 shadow-accent-400/80 animate-pulse' : 'bg-neutral-600'}`} />
                                                            <div>
                                                                <span className={`text-base font-bold ${d.isActive ? 'text-white' : 'text-neutral-300'}`}>
                                                                    {d.lord} Mahadasha
                                                                </span>
                                                                <span className="text-xs text-neutral-500 ml-2">({d.lordSanskrit})</span>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <span className={`text-sm ${d.isActive ? 'text-accent-300 font-semibold' : 'text-neutral-500'}`}>
                                                                {start} — {end}
                                                            </span>
                                                            {d.isActive && <div className="text-xs font-bold text-accent-400 tracking-wider uppercase mt-1">Active Now</div>}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Current Antardasha */}
                                    {dashaData.currentMahadasha.subPeriods && (
                                        <div className="p-8 rounded-3xl bg-accent-950/20 border border-accent-500/20 backdrop-blur-xl">
                                            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
                                                <span className="p-2 rounded-xl bg-accent-500/20 text-accent-400">
                                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                </span>
                                                Current Antardasha Timeline
                                            </h3>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                                {dashaData.currentMahadasha.subPeriods.map((sp, i) => {
                                                    const start = new Date(sp.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' });
                                                    const end = new Date(sp.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' });
                                                    return (
                                                        <div
                                                            key={i}
                                                            className={`p-4 rounded-xl text-sm transition-all border ${sp.isActive ? 'bg-accent-500/20 border-accent-400/50 shadow-[0_0_15px_rgba(59,130,246,0.2)] scale-105 relative z-10' : 'bg-white/5 border-white/5 hover:bg-white/10'
                                                                }`}
                                                        >
                                                            <div className="flex justify-between items-center mb-2">
                                                                <span className={`font-bold ${sp.isActive ? 'text-white' : 'text-neutral-300'}`}>{sp.lord}</span>
                                                                {sp.isActive && <span className="w-1.5 h-1.5 rounded-full bg-accent-400 animate-pulse" />}
                                                            </div>
                                                            <div className={`text-xs ${sp.isActive ? 'text-accent-200' : 'text-neutral-500'}`}>
                                                                {start} — {end}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </FadeIn>
                        )}
                    </div>

                    {/* Q&A Sidebar */}
                    <div className="lg:col-span-1">
                        <FadeIn delay={0.3} direction="left" className="sticky top-24">
                            <div className="p-6 rounded-3xl bg-neutral-900/50 border border-white/10 backdrop-blur-xl shadow-2xl flex flex-col h-[75vh]">
                                <div className="mb-4">
                                    <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-accent-500/20 flex items-center justify-center text-accent-400">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                            </svg>
                                        </div>
                                        Astrology Copilot
                                    </h3>
                                    <p className="text-xs text-neutral-400">
                                        Ask me anything. I know your entire chart and timeline.
                                    </p>
                                </div>

                                <div className="flex-1 flex flex-col overflow-y-auto mb-4 space-y-4 pr-2 custom-scrollbar">
                                    {/* Suggested Questions */}
                                    {messages.length === 0 && (
                                        <div className="space-y-2">
                                            {suggestedQuestions.map((q) => (
                                                <button
                                                    key={q}
                                                    onClick={() => askQuestion(q)}
                                                    className="w-full text-left px-4 py-3 rounded-xl text-sm text-neutral-300 bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all font-medium"
                                                >
                                                    {q}
                                                </button>
                                            ))}
                                        </div>
                                    )}

                                    {/* Messages */}
                                    {messages.length > 0 && (
                                        <>
                                            {messages.map((m, i) => (
                                                <div
                                                    key={i}
                                                    className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                                >
                                                    <div
                                                        className={`p-4 rounded-2xl max-w-[85%] text-sm leading-relaxed ${m.role === 'user'
                                                            ? 'bg-accent-600 text-white shadow-[0_5px_15px_rgba(37,99,235,0.2)] rounded-tr-sm'
                                                            : 'bg-white/10 text-neutral-200 border border-white/10 rounded-tl-sm'
                                                            }`}
                                                    >
                                                        {m.content}
                                                    </div>
                                                </div>
                                            ))}
                                            {askingQuestion && (
                                                <div className="flex justify-start">
                                                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-neutral-400 text-sm rounded-tl-sm flex items-center gap-2">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-accent-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                                                        <span className="w-1.5 h-1.5 rounded-full bg-accent-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                                                        <span className="w-1.5 h-1.5 rounded-full bg-accent-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>

                                {/* Input */}
                                <div className="pt-2 mt-auto">
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={question}
                                            onChange={(e) => setQuestion(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && askQuestion(question)}
                                            placeholder="Message..."
                                            className="w-full pl-5 pr-14 py-4 rounded-2xl bg-black/40 border border-white/10 text-sm text-white placeholder-neutral-500 focus:border-accent-500 focus:ring-1 focus:ring-accent-500/50 transition-all outline-none"
                                        />
                                        <button
                                            onClick={() => askQuestion(question)}
                                            disabled={askingQuestion || !question.trim()}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-accent-600 text-white hover:bg-accent-500 disabled:opacity-50 disabled:bg-white/10 disabled:text-neutral-500 transition-all flex items-center justify-center w-8 h-8"
                                        >
                                            <svg className="w-4 h-4 ml-[2px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </FadeIn>
                    </div>
                </div>
            </div>
        </div>
    );
}
