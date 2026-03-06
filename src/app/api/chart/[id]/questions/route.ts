// ============================================================================
// API Route: Ask Question About Chart
// POST /api/chart/[id]/questions
// ============================================================================
// Receives a user question and chart ID, returns a grounded response
// based on the chart's AI context. Currently uses rule-based responses
// with an LLM service interface ready for production.
// ============================================================================

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { AiContext } from '@/lib/astrology/types';

/**
 * LLM Service Interface — implement this to connect a real LLM provider.
 * For MVP, we use a mock implementation that generates contextual responses.
 */
interface LLMService {
    generateResponse(systemPrompt: string, userMessage: string): Promise<string>;
}

/**
 * Mock LLM service that generates contextual responses based on chart data.
 * Replace with OpenAI/Gemini/Claude integration for production.
 */
class MockLLMService implements LLMService {
    async generateResponse(systemPrompt: string, userMessage: string): Promise<string> {
        // Extract chart data from the system prompt for context-aware responses
        const question = userMessage.toLowerCase();

        // Extract key info from system prompt
        const ascendantMatch = systemPrompt.match(/Ascendant \(Lagna\): (\w+)/);
        const moonSignMatch = systemPrompt.match(/Moon Sign \(Rashi\): (\w+)/);
        const mahadashaMatch = systemPrompt.match(/Currently in (\w+) Mahadasha/);
        const antardashaMatch = systemPrompt.match(/(\w+) Antardasha/);

        const ascendant = ascendantMatch?.[1] || 'your ascendant sign';
        const moonSign = moonSignMatch?.[1] || 'your Moon sign';
        const mahadasha = mahadashaMatch?.[1] || 'your current';
        const antardasha = antardashaMatch?.[1] || 'the current sub';

        if (question.includes('career') || question.includes('work') || question.includes('job') || question.includes('profession')) {
            return `Based on your chart with ${ascendant} ascendant, your career direction is strongly influenced by your 10th house configuration. During this ${mahadasha} Mahadasha period, professional themes connected to ${mahadasha}'s significations are highlighted. This is a time to focus on building skills and authority in your chosen field. The ${antardasha} Antardasha sub-period adds nuance — pay attention to opportunities that align with both these planetary energies. Trust your natural strengths while remaining open to unexpected professional developments.`;
        }

        if (question.includes('relationship') || question.includes('love') || question.includes('marriage') || question.includes('partner')) {
            return `Your 7th house of partnerships reflects your relational patterns and desires. With your Moon in ${moonSign}, emotional connection and ${moonSign}-related qualities are central to your relational happiness. The current ${mahadasha} Mahadasha influences your approach to relationships — each dasha lord colors how we connect with others. Focus on authentic communication and understanding. If you're seeking partnership, this period favors connections that align with your chart's deeper themes of growth and mutual support.`;
        }

        if (question.includes('health') || question.includes('wellness') || question.includes('body')) {
            return `As a ${ascendant} ascendant, your physical constitution is influenced by ${ascendant}'s element and ruler. Your 6th house configuration reveals tendencies around health and wellness routines. During this ${mahadasha} period, pay extra attention to the body systems associated with ${mahadasha}. Regular routines, mindful eating, and stress management are especially important now. Listen to your body's signals and maintain preventive health practices.`;
        }

        if (question.includes('finance') || question.includes('money') || question.includes('wealth') || question.includes('income')) {
            return `Your 2nd house of wealth and 11th house of gains shape your financial patterns. With ${ascendant} rising, your approach to finances tends to reflect ${ascendant}'s practical sensibilities. The ${mahadasha} Mahadasha period brings its own financial themes — ${mahadasha}'s energy can either support accumulation or encourage particular spending patterns. Focus on building stable foundations while remaining open to growth opportunities that align with your chart's natural abundance indicators.`;
        }

        if (question.includes('spiritual') || question.includes('meditation') || question.includes('growth') || question.includes('purpose')) {
            return `Your chart reveals a meaningful spiritual trajectory. With your Moon in ${moonSign} and the nakshatra placement at birth, there's a natural pull toward self-understanding and inner growth. The ${mahadasha} Mahadasha can deepen this journey — each planetary period offers unique spiritual lessons. Your 9th house of dharma and 12th house of transcendence provide the framework for your spiritual path. Meditation, self-reflection, and connection with wisdom traditions can be especially fruitful during this time.`;
        }

        if (question.includes('future') || question.includes('upcoming') || question.includes('next') || question.includes('predict')) {
            return `Based on your current ${mahadasha} Mahadasha / ${antardasha} Antardasha, the coming period emphasizes themes connected to these planetary energies. Rather than fixed predictions, Vedic astrology reveals tendencies and timing. The current period favors actions aligned with ${mahadasha}'s qualities. Key areas to watch include career developments, relational dynamics, and personal growth opportunities. Stay attuned to the natural rhythms indicated by your dasha periods, and remember that your conscious choices shape how planetary energies manifest.`;
        }

        if (question.includes('dasha') || question.includes('period') || question.includes('timing')) {
            return `You're currently running ${mahadasha} Mahadasha with ${antardasha} Antardasha. In Vimshottari Dasha, each planetary period brings its own themes, opportunities, and areas of focus. ${mahadasha} period emphasizes its natural significations — review the specific areas of life governed by ${mahadasha} in your chart. The ${antardasha} sub-period adds a secondary influence. Understanding these timing cycles helps you work with the natural flow rather than against it. Major life decisions often align best with supportive dasha periods.`;
        }

        // Default response
        return `Thank you for your question. Based on your ${ascendant} ascendant chart with Moon in ${moonSign}, and your current ${mahadasha} Mahadasha / ${antardasha} Antardasha period, I can provide some guidance.

Your chart reflects a unique combination of planetary energies that influence various life areas. The specific placement of planets across your houses creates patterns that shape your experiences, tendencies, and opportunities.

For the topic you're asking about, consider how your chart's key placements — particularly your ascendant lord, Moon sign, and current dasha lord — interact with this area of life. The current planetary period adds its own coloring to your experiences.

Would you like to explore a specific area in more detail? I can provide insights on career, relationships, health, finances, spiritual growth, or current planetary timing.`;
    }
}

const llmService: LLMService = new MockLLMService();

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { question, aiContext: providedAiContext } = body;

        if (!question || question.trim().length === 0) {
            return NextResponse.json(
                { success: false, error: 'Question is required' },
                { status: 400 }
            );
        }

        let aiContextToUse: AiContext;
        let fullNameToUse = "User";

        if (id === 'local' && providedAiContext) {
            aiContextToUse = providedAiContext;
        } else {
            // Get chart data
            const chartResult = await prisma.chartResult.findUnique({
                where: { id },
                include: { birthProfile: true },
            });

            if (!chartResult) {
                return NextResponse.json(
                    { success: false, error: 'Chart not found' },
                    { status: 404 }
                );
            }
            aiContextToUse = JSON.parse(chartResult.aiContext);
            fullNameToUse = chartResult.birthProfile.fullName;
        }



        const { buildLLMSystemPrompt } = await import('@/lib/astrology/ai-context');

        // Build system prompt from AI context
        const systemPrompt = buildLLMSystemPrompt(aiContextToUse, fullNameToUse);

        // Generate response
        const response = await llmService.generateResponse(systemPrompt, question);

        // Store messages if not local
        if (id !== 'local') {
            await prisma.qaMessage.createMany({
                data: [
                    { chartResultId: id, role: 'user', content: question },
                    { chartResultId: id, role: 'assistant', content: response },
                ],
            });
        }

        return NextResponse.json({
            success: true,
            answer: response,
        });
    } catch (error) {
        console.error('Q&A error:', error);
        return NextResponse.json(
            { success: false, error: 'An unexpected error occurred' },
            { status: 500 }
        );
    }
}
