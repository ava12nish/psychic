// ============================================================================
// Vedic Astrology Engine — AI Context Generator (Layer 4)
// ============================================================================
// Generates a compact, structured context object optimized for use by
// an LLM or answer engine. Contains essential chart facts, current dasha
// info, key placements, themes, and guidance topics.
//
// This object is designed to be included in an LLM system prompt or
// context window to ground Q&A responses in real chart data.
// ============================================================================

import { ChartResult, DashaResult, InterpretationSummary, AiContext } from './types';

/**
 * Generate a compact AI context object from chart, dasha, and interpretation data.
 * This is optimized for token efficiency while retaining all essential grounding facts.
 * 
 * @param chart - Computed chart result
 * @param dasha - Computed dasha result
 * @param interpretation - Generated interpretation summary
 * @returns AiContext ready for LLM consumption
 */
export function generateAiContext(
    chart: ChartResult,
    dasha: DashaResult,
    interpretation: InterpretationSummary
): AiContext {
    // --- Essential Facts ---
    const essentialFacts: string[] = [
        `Ascendant (Lagna): ${chart.ascendant.sign.name} (${chart.ascendant.sign.sanskrit}) at ${chart.ascendant.degree.toFixed(1)}°`,
        `Moon Sign (Rashi): ${chart.moonSign.name} (${chart.moonSign.sanskrit})`,
        `Sun Sign (Sidereal): ${chart.sunSign.name} (${chart.sunSign.sanskrit})`,
        `Moon Nakshatra: ${dasha.birthNakshatra.name} (Pada ${dasha.birthNakshatra.pada})`,
        `Ascendant Nakshatra: ${chart.ascendant.nakshatra.name}`,
    ];

    // Add planetary positions concisely
    chart.planets.forEach(p => {
        let fact = `${p.name} in ${p.sign.name} (House ${p.house})`;
        if (p.isRetrograde) fact += ' [Retrograde]';
        if (p.isExalted) fact += ' [Exalted]';
        if (p.isDebilitated) fact += ' [Debilitated]';
        essentialFacts.push(fact);
    });

    // --- Current Dasha ---
    const currentDasha = {
        mahadasha: `${dasha.currentMahadasha.lord} (${dasha.currentMahadasha.lordSanskrit})`,
        antardasha: `${dasha.currentAntardasha.lord} (${dasha.currentAntardasha.lordSanskrit})`,
        periodDescription: `Currently in ${dasha.currentMahadasha.lord} Mahadasha / ${dasha.currentAntardasha.lord} Antardasha. ` +
            `Mahadasha runs from ${formatDate(dasha.currentMahadasha.startDate)} to ${formatDate(dasha.currentMahadasha.endDate)}. ` +
            `Antardasha runs from ${formatDate(dasha.currentAntardasha.startDate)} to ${formatDate(dasha.currentAntardasha.endDate)}.`,
    };

    // --- Key Placements ---
    const keyPlacements: string[] = [];

    // Highlight exalted/debilitated planets
    chart.planets
        .filter(p => p.isExalted || p.isDebilitated)
        .forEach(p => {
            if (p.isExalted) keyPlacements.push(`${p.name} is exalted in ${p.sign.name} — exceptionally strong`);
            if (p.isDebilitated) keyPlacements.push(`${p.name} is debilitated in ${p.sign.name} — requires conscious effort`);
        });

    // Highlight angular planet placements
    chart.planets
        .filter(p => [1, 4, 7, 10].includes(p.house))
        .forEach(p => {
            keyPlacements.push(`${p.name} in angular House ${p.house} — prominent influence on life direction`);
        });

    // --- Summary Themes ---
    const summaryThemes: string[] = [
        interpretation.personalityOverview.substring(0, 200),
        `Career: ${interpretation.careerThemes.substring(0, 150)}`,
        `Relationships: ${interpretation.relationshipThemes.substring(0, 150)}`,
        `Current Focus: ${interpretation.currentPeriodFocus.substring(0, 200)}`,
    ];

    // --- Caution Notes ---
    const cautionNotes: string[] = [];

    // Retrograde planets
    const retrogrades = chart.planets.filter(p => p.isRetrograde && !['rahu', 'ketu'].includes(p.id));
    if (retrogrades.length > 0) {
        cautionNotes.push(`Retrograde planets (${retrogrades.map(p => p.name).join(', ')}): energy may be internalized or delayed in expression`);
    }

    // Challenging houses (6, 8, 12)
    const challengingPlanets = chart.planets.filter(p => [6, 8, 12].includes(p.house) && !['rahu', 'ketu'].includes(p.id));
    if (challengingPlanets.length > 0) {
        challengingPlanets.forEach(p => {
            cautionNotes.push(`${p.name} in House ${p.house} — be mindful of challenges related to this placement`);
        });
    }

    // Debilitated planets
    chart.planets.filter(p => p.isDebilitated).forEach(p => {
        cautionNotes.push(`${p.name} debilitated — areas governed by ${p.name} may need extra attention`);
    });

    // --- Guidance Topics ---
    const guidanceTopics = [
        'Career direction and purpose',
        'Relationship dynamics and compatibility',
        'Current dasha period navigation',
        'Strengths to leverage',
        'Areas for growth and mindfulness',
        'Spiritual development and self-understanding',
        'Timing of major life decisions',
        'Health and wellness tendencies',
    ];

    return {
        essentialFacts,
        currentDasha,
        keyPlacements,
        summaryThemes,
        cautionNotes,
        guidanceTopics,
    };
}

/**
 * Build a system prompt for LLM-based Q&A using chart context.
 * This can be used directly as a system message when calling an LLM API.
 */
export function buildLLMSystemPrompt(
    context: AiContext,
    userName: string
): string {
    return `You are a knowledgeable and compassionate Vedic astrology advisor. You are providing personalized guidance to ${userName} based on their birth chart.

IMPORTANT RULES:
- Ground all responses in the chart data provided below
- Use Vedic/Jyotish terminology where appropriate
- Be thoughtful, calm, and professional in tone
- Never make absolute predictions — frame guidance as tendencies and influences
- Encourage self-reflection and personal growth
- If asked about topics outside astrology, gently redirect

CHART DATA:
${context.essentialFacts.join('\n')}

CURRENT DASHA PERIOD:
${context.currentDasha.periodDescription}

KEY PLACEMENTS:
${context.keyPlacements.join('\n')}

THEMES:
${context.summaryThemes.join('\n')}

CAUTIONS:
${context.cautionNotes.join('\n')}

GUIDANCE AREAS: ${context.guidanceTopics.join(', ')}

Respond helpfully and specifically to the user's question, referencing their actual chart placements and current dasha period.`;
}

function formatDate(isoString: string): string {
    try {
        const date = new Date(isoString);
        return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    } catch {
        return isoString;
    }
}
