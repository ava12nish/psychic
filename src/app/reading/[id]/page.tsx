'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

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
            <div className="min-h-screen flex items-center justify-center bg-neutral-50">
                <div className="text-center animate-pulse-subtle">
                    <div className="w-12 h-12 mx-auto rounded-full bg-accent-100 flex items-center justify-center mb-4">
                        <span className="text-accent-600 text-lg">◎</span>
                    </div>
                    <p className="text-sm text-neutral-600">Loading your reading...</p>
                </div>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-neutral-50">
                <div className="text-center p-8 rounded-2xl bg-white border border-neutral-200 max-w-md mx-auto">
                    <h2 className="text-lg font-semibold text-neutral-900 mb-2">Reading not found</h2>
                    <p className="text-sm text-neutral-600 mb-4">{error || 'This reading may have expired or does not exist.'}</p>
                    <a href="/get-reading" className="inline-flex px-6 py-2.5 text-sm font-semibold text-white bg-accent-700 hover:bg-accent-800 rounded-lg transition-colors">
                        Generate New Reading
                    </a>
                </div>
            </div>
        );
    }

    const { chartData, dashaData, interpretation, birthProfile } = data;

    return (
        <div className="bg-neutral-50 min-h-screen">
            {/* Welcome Header */}
            <div className="bg-gradient-to-b from-accent-800 to-accent-900 text-white py-12 sm:py-16">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-3xl">
                        <p className="text-accent-300 text-sm font-medium mb-2">Your Vedic Astrology Reading</p>
                        <h1 className="text-3xl sm:text-4xl font-bold mb-3">
                            {birthProfile.fullName}
                        </h1>
                        <div className="flex flex-wrap gap-4 text-sm text-accent-200">
                            <span>{birthProfile.birthDate}</span>
                            <span>·</span>
                            <span>{birthProfile.birthTime}</span>
                            <span>·</span>
                            <span>{birthProfile.birthPlace}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Chart Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 -mt-12">
                    <div className="p-5 rounded-2xl bg-white border border-neutral-200 shadow-sm">
                        <p className="text-xs font-semibold text-accent-600 uppercase tracking-wider mb-1">Ascendant (Lagna)</p>
                        <p className="text-xl font-bold text-neutral-900">{chartData.ascendant.sign.name}</p>
                        <p className="text-sm text-neutral-500">{chartData.ascendant.sign.sanskrit} · {chartData.ascendant.degree.toFixed(1)}° · {chartData.ascendant.nakshatra.name}</p>
                    </div>
                    <div className="p-5 rounded-2xl bg-white border border-neutral-200 shadow-sm">
                        <p className="text-xs font-semibold text-accent-600 uppercase tracking-wider mb-1">Moon Sign (Rashi)</p>
                        <p className="text-xl font-bold text-neutral-900">{chartData.moonSign.name}</p>
                        <p className="text-sm text-neutral-500">{chartData.moonSign.sanskrit} · Nakshatra: {dashaData.birthNakshatra.name} (Pada {dashaData.birthNakshatra.pada})</p>
                    </div>
                    <div className="p-5 rounded-2xl bg-white border border-neutral-200 shadow-sm">
                        <p className="text-xs font-semibold text-accent-600 uppercase tracking-wider mb-1">Current Dasha</p>
                        <p className="text-xl font-bold text-neutral-900">{dashaData.currentMahadasha.lord}</p>
                        <p className="text-sm text-neutral-500">
                            {dashaData.currentMahadasha.lordSanskrit} MD / {dashaData.currentAntardasha.lord} AD
                        </p>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="flex gap-1 mb-6 bg-white rounded-xl border border-neutral-200 p-1 overflow-x-auto">
                    {(['overview', 'planets', 'houses', 'dasha'] as const).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${activeTab === tab
                                ? 'bg-accent-700 text-white'
                                : 'text-neutral-600 hover:bg-neutral-100'
                                }`}
                        >
                            {tab === 'overview' ? 'Overview' : tab === 'planets' ? 'Planetary Placements' : tab === 'houses' ? 'Houses' : 'Dasha Timeline'}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {activeTab === 'overview' && (
                            <>
                                {/* Personality Overview */}
                                <div className="p-6 rounded-2xl bg-white border border-neutral-200">
                                    <h2 className="text-lg font-bold text-neutral-900 mb-3">Personality Overview</h2>
                                    <p className="text-sm text-neutral-700 leading-relaxed">{interpretation.personalityOverview}</p>
                                </div>

                                {/* Strengths & Challenges */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="p-6 rounded-2xl bg-white border border-neutral-200">
                                        <h3 className="text-sm font-bold text-neutral-900 mb-3 flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-green-500" />
                                            Strengths
                                        </h3>
                                        <ul className="space-y-2">
                                            {interpretation.strengths.map((s, i) => (
                                                <li key={i} className="text-sm text-neutral-600 leading-relaxed">• {s}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="p-6 rounded-2xl bg-white border border-neutral-200">
                                        <h3 className="text-sm font-bold text-neutral-900 mb-3 flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-amber-500" />
                                            Challenges
                                        </h3>
                                        <ul className="space-y-2">
                                            {interpretation.challenges.map((c, i) => (
                                                <li key={i} className="text-sm text-neutral-600 leading-relaxed">• {c}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                {/* Career & Relationships */}
                                <div className="p-6 rounded-2xl bg-white border border-neutral-200">
                                    <h3 className="text-sm font-bold text-neutral-900 mb-2">Career Themes</h3>
                                    <p className="text-sm text-neutral-600 leading-relaxed mb-4">{interpretation.careerThemes}</p>
                                    <h3 className="text-sm font-bold text-neutral-900 mb-2">Relationship Themes</h3>
                                    <p className="text-sm text-neutral-600 leading-relaxed">{interpretation.relationshipThemes}</p>
                                </div>

                                {/* Current Period */}
                                <div className="p-6 rounded-2xl bg-accent-50 border border-accent-200">
                                    <h3 className="text-sm font-bold text-accent-900 mb-2">Current Period Focus</h3>
                                    <p className="text-sm text-accent-800 leading-relaxed">{interpretation.currentPeriodFocus}</p>
                                </div>

                                {/* Mindfulness */}
                                <div className="p-6 rounded-2xl bg-white border border-neutral-200">
                                    <h3 className="text-sm font-bold text-neutral-900 mb-3">Mindfulness & Guidance</h3>
                                    <ul className="space-y-3">
                                        {interpretation.mindfulnessNotes.map((n, i) => (
                                            <li key={i} className="text-sm text-neutral-600 leading-relaxed pl-4 border-l-2 border-accent-200">
                                                {n}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Life Path */}
                                <div className="p-6 rounded-2xl bg-white border border-neutral-200">
                                    <h3 className="text-sm font-bold text-neutral-900 mb-2">Life Path Summary</h3>
                                    <p className="text-sm text-neutral-600 leading-relaxed">{interpretation.lifePathSummary}</p>
                                </div>
                            </>
                        )}

                        {activeTab === 'planets' && (
                            <div className="p-6 rounded-2xl bg-white border border-neutral-200 overflow-x-auto">
                                <h2 className="text-lg font-bold text-neutral-900 mb-4">Planetary Placements</h2>
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-neutral-200">
                                            <th className="text-left py-2 pr-3 font-semibold text-neutral-700">Planet</th>
                                            <th className="text-left py-2 pr-3 font-semibold text-neutral-700">Sign</th>
                                            <th className="text-left py-2 pr-3 font-semibold text-neutral-700">House</th>
                                            <th className="text-left py-2 pr-3 font-semibold text-neutral-700">Degree</th>
                                            <th className="text-left py-2 pr-3 font-semibold text-neutral-700">Nakshatra</th>
                                            <th className="text-left py-2 font-semibold text-neutral-700">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {chartData.planets.map((p) => (
                                            <tr key={p.id} className="border-b border-neutral-100 hover:bg-neutral-50 transition-colors">
                                                <td className="py-2.5 pr-3">
                                                    <div className="font-medium text-neutral-900">{p.name}</div>
                                                    <div className="text-xs text-neutral-400">{p.sanskrit}</div>
                                                </td>
                                                <td className="py-2.5 pr-3 text-neutral-700">
                                                    {p.sign.name}
                                                    <span className="text-xs text-neutral-400 ml-1">({p.sign.sanskrit})</span>
                                                </td>
                                                <td className="py-2.5 pr-3 text-neutral-700">{p.house}</td>
                                                <td className="py-2.5 pr-3 text-neutral-700">{p.degreeInSign.toFixed(1)}°</td>
                                                <td className="py-2.5 pr-3 text-neutral-700">
                                                    {p.nakshatra.name}
                                                    <span className="text-xs text-neutral-400 ml-1">(P{p.nakshatra.pada})</span>
                                                </td>
                                                <td className="py-2.5">
                                                    <div className="flex gap-1 flex-wrap">
                                                        {p.isRetrograde && <span className="px-1.5 py-0.5 rounded text-xs bg-orange-50 text-orange-700 border border-orange-200">R</span>}
                                                        {p.isExalted && <span className="px-1.5 py-0.5 rounded text-xs bg-green-50 text-green-700 border border-green-200">Exalted</span>}
                                                        {p.isDebilitated && <span className="px-1.5 py-0.5 rounded text-xs bg-red-50 text-red-700 border border-red-200">Debilitated</span>}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {activeTab === 'houses' && (
                            <div className="p-6 rounded-2xl bg-white border border-neutral-200">
                                <h2 className="text-lg font-bold text-neutral-900 mb-4">House Breakdown</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {chartData.houses.map((h) => (
                                        <div key={h.house} className="p-4 rounded-xl bg-neutral-50 border border-neutral-100">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-sm font-bold text-neutral-900">House {h.house}</span>
                                                <span className="text-xs text-neutral-500">Ruler: {h.ruler}</span>
                                            </div>
                                            <p className="text-sm text-neutral-700">{h.sign.name} <span className="text-xs text-neutral-400">({h.sign.sanskrit})</span></p>
                                            {h.planets.length > 0 && (
                                                <div className="flex gap-1 mt-2 flex-wrap">
                                                    {h.planets.map((p) => (
                                                        <span key={p} className="px-2 py-0.5 rounded-full bg-accent-100 text-accent-700 text-xs font-medium">{p}</span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'dasha' && (
                            <>
                                <div className="p-6 rounded-2xl bg-white border border-neutral-200">
                                    <h2 className="text-lg font-bold text-neutral-900 mb-1">Vimshottari Dasha Timeline</h2>
                                    <p className="text-sm text-neutral-500 mb-4">Based on Moon in {dashaData.birthNakshatra.name} nakshatra (lord: {dashaData.birthNakshatra.lord})</p>
                                    <div className="space-y-2">
                                        {dashaData.mahadashas.slice(0, 10).map((d, i) => {
                                            const start = new Date(d.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
                                            const end = new Date(d.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
                                            return (
                                                <div
                                                    key={i}
                                                    className={`flex items-center justify-between p-3 rounded-lg transition-colors ${d.isActive
                                                        ? 'bg-accent-50 border-2 border-accent-300'
                                                        : 'bg-neutral-50 border border-neutral-100 hover:bg-neutral-100'
                                                        }`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-2.5 h-2.5 rounded-full ${d.isActive ? 'bg-accent-500 animate-pulse' : 'bg-neutral-300'}`} />
                                                        <div>
                                                            <span className={`text-sm font-semibold ${d.isActive ? 'text-accent-800' : 'text-neutral-700'}`}>
                                                                {d.lord} Mahadasha
                                                            </span>
                                                            <span className="text-xs text-neutral-400 ml-2">({d.lordSanskrit})</span>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <span className={`text-xs ${d.isActive ? 'text-accent-600 font-semibold' : 'text-neutral-500'}`}>
                                                            {start} — {end}
                                                        </span>
                                                        {d.isActive && <span className="ml-2 text-xs font-bold text-accent-600">● Active</span>}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Current Antardasha */}
                                {dashaData.currentMahadasha.subPeriods && (
                                    <div className="p-6 rounded-2xl bg-white border border-neutral-200">
                                        <h3 className="text-base font-bold text-neutral-900 mb-3">
                                            Antardasha within {dashaData.currentMahadasha.lord} Mahadasha
                                        </h3>
                                        <div className="space-y-1.5">
                                            {dashaData.currentMahadasha.subPeriods.map((sp, i) => {
                                                const start = new Date(sp.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
                                                const end = new Date(sp.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
                                                return (
                                                    <div
                                                        key={i}
                                                        className={`flex items-center justify-between p-2.5 rounded-lg text-sm ${sp.isActive ? 'bg-accent-50 border border-accent-200 font-medium' : 'hover:bg-neutral-50'
                                                            }`}
                                                    >
                                                        <span className={sp.isActive ? 'text-accent-800' : 'text-neutral-600'}>{sp.lord}</span>
                                                        <span className={`text-xs ${sp.isActive ? 'text-accent-600' : 'text-neutral-400'}`}>
                                                            {start} — {end}
                                                            {sp.isActive && ' ●'}
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    {/* Q&A Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-20 p-6 rounded-2xl bg-white border border-neutral-200">
                            <h3 className="text-base font-bold text-neutral-900 mb-3">Ask About Your Chart</h3>
                            <p className="text-xs text-neutral-500 mb-4">
                                Ask questions about your chart, dasha periods, or any life area. Responses are grounded in your chart data.
                            </p>

                            {/* Suggested Questions */}
                            {messages.length === 0 && (
                                <div className="mb-4 space-y-1.5">
                                    {suggestedQuestions.map((q) => (
                                        <button
                                            key={q}
                                            onClick={() => askQuestion(q)}
                                            className="w-full text-left px-3 py-2 rounded-lg text-xs text-accent-700 bg-accent-50 hover:bg-accent-100 transition-colors"
                                        >
                                            {q}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Messages */}
                            {messages.length > 0 && (
                                <div className="mb-4 max-h-96 overflow-y-auto space-y-3">
                                    {messages.map((m, i) => (
                                        <div
                                            key={i}
                                            className={`p-3 rounded-xl text-sm ${m.role === 'user'
                                                ? 'bg-accent-700 text-white ml-4'
                                                : 'bg-neutral-100 text-neutral-700 mr-4'
                                                }`}
                                        >
                                            {m.content}
                                        </div>
                                    ))}
                                    {askingQuestion && (
                                        <div className="p-3 rounded-xl bg-neutral-100 text-neutral-400 mr-4 text-sm animate-pulse">
                                            Thinking...
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Input */}
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={question}
                                    onChange={(e) => setQuestion(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && askQuestion(question)}
                                    placeholder="Ask a question..."
                                    className="flex-1 px-3 py-2 rounded-lg border border-neutral-300 text-sm text-neutral-900 placeholder-neutral-400 focus:border-accent-500 focus:ring-1 focus:ring-accent-500/20"
                                />
                                <button
                                    onClick={() => askQuestion(question)}
                                    disabled={askingQuestion || !question.trim()}
                                    className="px-3 py-2 rounded-lg bg-accent-700 text-white text-sm font-medium hover:bg-accent-800 disabled:opacity-50 transition-colors"
                                >
                                    Ask
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
