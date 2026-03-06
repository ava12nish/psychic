// ============================================================================
// Vedic Astrology Engine — Interpretation Layer (Layer 3)
// ============================================================================
// Converts raw chart data into human-readable thematic summaries.
// This is a rule-based interpretation system that provides personality
// insights, strengths, challenges, and life themes based on chart placements.
//
// ARCHITECTURE: This layer is separate from raw calculations (Layer 1-2)
// and can be enhanced or replaced by an LLM for more nuanced language.
// ============================================================================

import { ChartResult, DashaResult, InterpretationSummary, PlanetPlacement, HousePlacement } from './types';

// ---------------------------------------------------------------------------
// Sign-based personality descriptions
// ---------------------------------------------------------------------------
const SIGN_PERSONALITIES: Record<string, { traits: string; overview: string }> = {
    'Aries': {
        traits: 'bold, pioneering, energetic, independent',
        overview: 'You possess a natural leadership quality with a pioneering spirit. Direct, action-oriented, and courageous, you tend to approach life with enthusiasm and determination.',
    },
    'Taurus': {
        traits: 'stable, grounded, sensual, patient',
        overview: 'You are grounded and value stability, comfort, and beauty. With natural patience and persistence, you build lasting foundations in everything you pursue.',
    },
    'Gemini': {
        traits: 'curious, communicative, versatile, intellectual',
        overview: 'Your mind is naturally curious and agile, drawn to learning, communication, and making connections. You thrive in environments that offer variety and intellectual stimulation.',
    },
    'Cancer': {
        traits: 'nurturing, intuitive, emotional, protective',
        overview: 'You are deeply intuitive and emotionally attuned, with a strong connection to home, family, and emotional security. Your caring nature creates nurturing spaces for those around you.',
    },
    'Leo': {
        traits: 'confident, creative, generous, warm',
        overview: 'You radiate confidence and warmth, with a natural flair for creativity and self-expression. Generous and dignified, you inspire others through your presence and leadership.',
    },
    'Virgo': {
        traits: 'analytical, precise, service-oriented, practical',
        overview: 'You have a keen analytical mind with an eye for detail and a desire to improve and serve. Practical and health-conscious, you bring order and refinement to your surroundings.',
    },
    'Libra': {
        traits: 'balanced, diplomatic, aesthetic, partnership-oriented',
        overview: 'You seek harmony, balance, and beauty in all areas of life. Diplomatic and fair-minded, you excel in partnerships and have a refined aesthetic sensibility.',
    },
    'Scorpio': {
        traits: 'intense, transformative, perceptive, determined',
        overview: 'You possess remarkable depth and intensity, with a penetrating insight into the hidden dimensions of life. Transformative and resilient, you navigate life with quiet determination.',
    },
    'Sagittarius': {
        traits: 'optimistic, philosophical, adventurous, expansive',
        overview: 'You are drawn to philosophy, higher learning, and expanding horizons. Optimistic and adventurous, you approach life as a journey of growth and understanding.',
    },
    'Capricorn': {
        traits: 'disciplined, ambitious, responsible, structured',
        overview: 'You are disciplined and goal-oriented, with a natural understanding of structure and long-term achievement. Responsible and practical, you build your life with strategic patience.',
    },
    'Aquarius': {
        traits: 'innovative, humanitarian, independent, progressive',
        overview: 'You think independently and are drawn to innovation, social causes, and unconventional approaches. Your progressive vision seeks to improve systems and benefit the collective.',
    },
    'Pisces': {
        traits: 'compassionate, imaginative, spiritual, empathetic',
        overview: 'You are deeply compassionate and imaginative, with a natural connection to the spiritual and subtle dimensions of life. Empathetic and creative, you see beyond the material world.',
    },
};

// ---------------------------------------------------------------------------
// Planet-in-sign interpretations (key placements)
// ---------------------------------------------------------------------------
const PLANET_SIGN_STRENGTHS: Record<string, Record<string, string>> = {
    'Sun': {
        'Leo': 'Strong sense of self, natural authority, confidence in creative expression',
        'Aries': 'Dynamic energy, initiative, courage in self-expression',
        'Libra': 'Learning to balance self with others, diplomatic leadership',
        'Aquarius': 'Innovative thinking, humanitarian vision, independent spirit',
    },
    'Moon': {
        'Cancer': 'Deeply nurturing, emotionally intelligent, strong intuition',
        'Taurus': 'Emotionally stable, appreciates beauty, grounded emotions',
        'Scorpio': 'Intense emotional depth, transformative inner life',
        'Capricorn': 'Disciplined emotions, practical emotional approach',
    },
    'Mars': {
        'Capricorn': 'Disciplined energy, strategic action, persistent effort',
        'Aries': 'Bold action, competitive spirit, physical vitality',
        'Cancer': 'Protective energy, emotionally driven action',
        'Libra': 'Diplomatic approach to conflict, balanced action',
    },
    'Jupiter': {
        'Cancer': 'Abundant generosity, emotional wisdom, nurturing growth',
        'Sagittarius': 'Philosophical depth, love of learning, spiritual expansion',
        'Capricorn': 'Practical wisdom, structured growth, patient expansion',
        'Gemini': 'Intellectual breadth, communicative wisdom',
    },
    'Venus': {
        'Pisces': 'Unconditional love, artistic sensitivity, spiritual romance',
        'Taurus': 'Refined pleasures, stable relationships, aesthetic appreciation',
        'Virgo': 'Discerning love, practical devotion, service-oriented care',
        'Aries': 'Passionate love, independent in relationships',
    },
    'Saturn': {
        'Libra': 'Fair judgment, balanced discipline, harmonious structures',
        'Aquarius': 'Social responsibility, innovative discipline, collective service',
        'Aries': 'Learning patience, disciplining impulses',
        'Cancer': 'Emotional maturity through challenges, building inner security',
    },
};

// ---------------------------------------------------------------------------
// Dasha period interpretations
// ---------------------------------------------------------------------------
const DASHA_THEMES: Record<string, { focus: string; advice: string }> = {
    'Sun': {
        focus: 'Self-expression, authority, career recognition, health, and leadership',
        advice: 'Focus on building your identity, stepping into leadership roles, and pursuing creative expression. Take care of vitality and heart health.',
    },
    'Moon': {
        focus: 'Emotional fulfillment, home life, nurturing, intuition, and maternal connections',
        advice: 'Prioritize emotional well-being, strengthen family bonds, trust your intuition. Pay attention to mental health and emotional balance.',
    },
    'Mars': {
        focus: 'Action, courage, property, competition, energy, and physical vitality',
        advice: 'Channel your energy into constructive goals. Good period for property decisions, physical fitness, and taking bold steps. Be mindful of anger and impulsiveness.',
    },
    'Mercury': {
        focus: 'Communication, learning, business, intellectual growth, and analytical work',
        advice: 'Pursue education, improve communication skills, engage in business ventures. Great time for writing, networking, and developing technical abilities.',
    },
    'Jupiter': {
        focus: 'Wisdom, expansion, spirituality, higher education, and prosperity',
        advice: 'Seek spiritual growth, pursue higher learning, expand your horizons. Generally a favorable period for growth, marriage, and children. Practice generosity.',
    },
    'Venus': {
        focus: 'Relationships, art, luxury, beauty, romance, and creative pursuits',
        advice: 'Enjoy the finer aspects of life, invest in relationships and creative projects. Good period for partnerships, artistic expression, and material comfort.',
    },
    'Saturn': {
        focus: 'Discipline, karmic lessons, hard work, structure, and long-term foundations',
        advice: 'Embrace patience, discipline and perseverance. This period builds lasting foundations through effort. Focus on duty, responsibility, and long-term goals.',
    },
    'Rahu': {
        focus: 'Ambition, innovation, unconventional paths, material desires, and transformation',
        advice: 'Be open to unexpected opportunities and unconventional approaches. Stay grounded amid rapid changes. Guard against obsessive or compulsive tendencies.',
    },
    'Ketu': {
        focus: 'Spirituality, detachment, past-life themes, introspection, and liberation',
        advice: 'This period favors spiritual growth, meditation, and letting go of attachments. Embrace simplicity and inner wisdom. Watch for confusion about material direction.',
    },
};

// ---------------------------------------------------------------------------
// House interpretations
// ---------------------------------------------------------------------------
const HOUSE_THEMES: Record<number, string> = {
    1: 'Self, personality, physical body, overall life direction',
    2: 'Wealth, family, speech, food, values',
    3: 'Courage, siblings, communication, short travel, skills',
    4: 'Home, mother, emotions, property, inner peace',
    5: 'Creativity, children, intelligence, romance, past merit',
    6: 'Health challenges, enemies, service, daily work',
    7: 'Partnerships, marriage, business partnerships, public dealings',
    8: 'Transformation, longevity, hidden matters, joint resources',
    9: 'Fortune, dharma, higher learning, father, long travel',
    10: 'Career, reputation, public life, status, actions in the world',
    11: 'Gains, aspirations, social networks, elder siblings',
    12: 'Losses, spirituality, foreign lands, isolation, liberation',
};

// ---------------------------------------------------------------------------
// Main Interpretation Function
// ---------------------------------------------------------------------------

/**
 * Generate a complete interpretation summary from chart and dasha data.
 * 
 * @param chart - Computed chart result
 * @param dasha - Computed dasha result
 * @returns InterpretationSummary with personality overview, themes, and guidance
 */
export function generateInterpretation(
    chart: ChartResult,
    dasha: DashaResult
): InterpretationSummary {
    const ascSign = chart.ascendant.sign.name;
    const moonSign = chart.moonSign.name;
    const sunSign = chart.sunSign.name;

    // --- Personality Overview ---
    const ascPersonality = SIGN_PERSONALITIES[ascSign]?.overview || '';
    const moonPersonality = SIGN_PERSONALITIES[moonSign];

    const personalityOverview =
        `With ${ascSign} (${chart.ascendant.sign.sanskrit}) rising, ${ascPersonality} ` +
        `Your Moon in ${moonSign} (${chart.moonSign.sanskrit}) adds a ${moonPersonality?.traits || 'unique'} emotional nature. ` +
        `Your Sun in ${sunSign} gives your core identity a ${SIGN_PERSONALITIES[sunSign]?.traits || 'distinctive'} quality.`;

    // --- Strengths ---
    const strengths = generateStrengths(chart);

    // --- Challenges ---
    const challenges = generateChallenges(chart);

    // --- Career Themes ---
    const tenthHouse = chart.houses.find(h => h.house === 10);
    const careerPlanets = chart.planets.filter(p => p.house === 10);
    const careerThemes = generateCareerThemes(tenthHouse, careerPlanets, chart);

    // --- Relationship Themes ---
    const seventhHouse = chart.houses.find(h => h.house === 7);
    const relationPlanets = chart.planets.filter(p => p.house === 7);
    const venusPlacement = chart.planets.find(p => p.id === 'venus');
    const relationshipThemes = generateRelationshipThemes(seventhHouse, relationPlanets, venusPlacement);

    // --- Current Period Focus ---
    const currentDashaLord = dasha.currentMahadasha.lord;
    const currentAntardashaLord = dasha.currentAntardasha.lord;
    const dashaTheme = DASHA_THEMES[currentDashaLord];
    const antarTheme = DASHA_THEMES[currentAntardashaLord];

    const currentPeriodFocus =
        `You are currently in ${currentDashaLord} Mahadasha / ${currentAntardashaLord} Antardasha. ` +
        `${dashaTheme?.focus ? `Primary themes include: ${dashaTheme.focus}.` : ''} ` +
        `${antarTheme ? `The ${currentAntardashaLord} sub-period brings an emphasis on ${antarTheme.focus.toLowerCase()}.` : ''}`;

    // --- Mindfulness Notes ---
    const mindfulnessNotes = generateMindfulnessNotes(chart, dasha);

    // --- Life Path Summary ---
    const lifePathSummary = generateLifePathSummary(chart, dasha);

    return {
        personalityOverview,
        strengths,
        challenges,
        careerThemes,
        relationshipThemes,
        currentPeriodFocus,
        mindfulnessNotes,
        lifePathSummary,
    };
}

function generateStrengths(chart: ChartResult): string[] {
    const strengths: string[] = [];
    const ascSign = chart.ascendant.sign.name;

    // Ascendant-based strength
    const ascTraits = SIGN_PERSONALITIES[ascSign]?.traits;
    if (ascTraits) {
        strengths.push(`Natural ${ascTraits.split(',')[0].trim()} nature from your ${ascSign} ascendant`);
    }

    // Exalted planets
    chart.planets.forEach(p => {
        if (p.isExalted) {
            strengths.push(`${p.name} exalted in ${p.sign.name} — ${getPlanetStrengthNote(p)}`);
        }
    });

    // Planets in own sign
    chart.planets.forEach(p => {
        if (p.sign.ruler === p.name && !p.isExalted) {
            strengths.push(`${p.name} in its own sign ${p.sign.name} — comfortable and effective`);
        }
    });

    // Jupiter in angles (1, 4, 7, 10)
    const jupiter = chart.planets.find(p => p.id === 'jupiter');
    if (jupiter && [1, 4, 7, 10].includes(jupiter.house)) {
        strengths.push(`Jupiter in house ${jupiter.house} — expansion, wisdom, and protection in this area of life`);
    }

    // Benefics in specific houses
    const beneficIds = ['jupiter', 'venus', 'mercury', 'moon'];
    const beneficsInGoodHouses = chart.planets.filter(
        p => beneficIds.includes(p.id) && [1, 5, 9].includes(p.house)
    );
    beneficsInGoodHouses.forEach(p => {
        strengths.push(`${p.name} in the auspicious ${getHouseOrdinal(p.house)} house — ${HOUSE_THEMES[p.house]}`);
    });

    if (strengths.length === 0) {
        strengths.push('Balanced chart with potential across many life areas');
    }

    return strengths.slice(0, 6); // Cap at 6 strengths
}

function generateChallenges(chart: ChartResult): string[] {
    const challenges: string[] = [];

    // Debilitated planets
    chart.planets.forEach(p => {
        if (p.isDebilitated) {
            challenges.push(`${p.name} debilitated in ${p.sign.name} — areas related to ${p.name} may require extra conscious effort`);
        }
    });

    // Malefics in sensitive houses
    const maleficIds = ['saturn', 'mars', 'rahu', 'ketu'];
    const maleficsInSensitiveHouses = chart.planets.filter(
        p => maleficIds.includes(p.id) && [1, 4, 7, 8].includes(p.house)
    );
    maleficsInSensitiveHouses.forEach(p => {
        challenges.push(`${p.name} in house ${p.house} — may bring intensity to ${HOUSE_THEMES[p.house]?.toLowerCase()}`);
    });

    // Retrograde planets
    const retrogradePlanets = chart.planets.filter(
        p => p.isRetrograde && !['rahu', 'ketu'].includes(p.id)
    );
    retrogradePlanets.forEach(p => {
        challenges.push(`${p.name} retrograde — internalized ${p.name.toLowerCase()} energy, may require deeper self-reflection in related areas`);
    });

    if (challenges.length === 0) {
        challenges.push('No major challenging placements — focus on maximizing your natural strengths');
    }

    return challenges.slice(0, 5);
}

function generateCareerThemes(
    tenthHouse: HousePlacement | undefined,
    careerPlanets: PlanetPlacement[],
    chart: ChartResult
): string {
    let themes = '';

    if (tenthHouse) {
        themes += `Your 10th house of career is in ${tenthHouse.sign.name}, ruled by ${tenthHouse.ruler}. `;
    }

    if (careerPlanets.length > 0) {
        const planetNames = careerPlanets.map(p => p.name).join(', ');
        themes += `With ${planetNames} placed in the 10th house, you are likely drawn to `;
        if (careerPlanets.some(p => p.id === 'sun')) themes += 'leadership, authority, and government roles. ';
        else if (careerPlanets.some(p => p.id === 'mercury')) themes += 'communication, analysis, and intellectual work. ';
        else if (careerPlanets.some(p => p.id === 'venus')) themes += 'creative fields, art, luxury goods, or diplomacy. ';
        else if (careerPlanets.some(p => p.id === 'mars')) themes += 'engineering, medicine, sports, or competitive fields. ';
        else if (careerPlanets.some(p => p.id === 'jupiter')) themes += 'teaching, consulting, law, or spiritual guidance. ';
        else if (careerPlanets.some(p => p.id === 'saturn')) themes += 'structured roles, management, real estate, or skilled trades. ';
        else themes += 'careers that align with these planetary energies. ';
    } else {
        const ruler = tenthHouse?.ruler || chart.ascendant.sign.ruler;
        themes += `Career direction is influenced by ${ruler}'s placement and condition in your chart. `;
    }

    // Add ascendant-based career note
    const ascSign = chart.ascendant.sign.name;
    const ascElement = chart.ascendant.sign.element;
    if (ascElement === 'Fire') themes += 'Your fire-sign ascendant supports entrepreneurial and leadership-oriented careers.';
    else if (ascElement === 'Earth') themes += 'Your earth-sign ascendant favors practical, tangible, and business-oriented careers.';
    else if (ascElement === 'Air') themes += 'Your air-sign ascendant supports communication, technology, and people-oriented careers.';
    else themes += 'Your water-sign ascendant supports healing, creative, and emotionally fulfilling career paths.';

    return themes;
}

function generateRelationshipThemes(
    seventhHouse: HousePlacement | undefined,
    relationPlanets: PlanetPlacement[],
    venus?: PlanetPlacement
): string {
    let themes = '';

    if (seventhHouse) {
        themes += `Your 7th house of partnerships is in ${seventhHouse.sign.name}, suggesting you seek ${getRelationshipQuality(seventhHouse.sign.name)} in relationships. `;
    }

    if (venus) {
        themes += `Venus in ${venus.sign.name} (house ${venus.house}) indicates ${getVenusTheme(venus)}. `;
    }

    if (relationPlanets.length > 0) {
        themes += `Planets in the 7th house (${relationPlanets.map(p => p.name).join(', ')}) bring their energies to your partnerships.`;
    }

    return themes || 'Your relational life is influenced by the overall balance of your chart and current planetary periods.';
}

function generateMindfulnessNotes(chart: ChartResult, dasha: DashaResult): string[] {
    const notes: string[] = [];
    const currentLord = dasha.currentMahadasha.lord;
    const dashaTheme = DASHA_THEMES[currentLord];

    if (dashaTheme) {
        notes.push(dashaTheme.advice);
    }

    // Saturn-related caution
    const saturn = chart.planets.find(p => p.id === 'saturn');
    if (saturn && [1, 4, 7, 10].includes(saturn.house)) {
        notes.push('Saturn in an angular house calls for patience, discipline, and a long-term perspective in your actions.');
    }

    // Rahu-related note
    const rahu = chart.planets.find(p => p.id === 'rahu');
    if (rahu) {
        notes.push(`Rahu in house ${rahu.house} (${rahu.sign.name}) — be mindful of ${getHouseOrdinal(rahu.house)} house themes. Avoid obsessive tendencies in this area.`);
    }

    // Ketu-related note
    const ketu = chart.planets.find(p => p.id === 'ketu');
    if (ketu) {
        notes.push(`Ketu in house ${ketu.house} (${ketu.sign.name}) — natural detachment in ${getHouseOrdinal(ketu.house)} house themes. This can be a source of spiritual insight.`);
    }

    return notes.slice(0, 4);
}

function generateLifePathSummary(chart: ChartResult, dasha: DashaResult): string {
    const ascSign = chart.ascendant.sign.name;
    const moonSign = chart.moonSign.name;
    const ninthHouse = chart.houses.find(h => h.house === 9);
    const currentLord = dasha.currentMahadasha.lord;

    return `As a ${ascSign} ascendant with Moon in ${moonSign}, your life path blends ` +
        `${SIGN_PERSONALITIES[ascSign]?.traits?.split(',')[0]?.trim() || ascSign} qualities with ` +
        `${SIGN_PERSONALITIES[moonSign]?.traits?.split(',')[0]?.trim() || moonSign} emotional depth. ` +
        `Your 9th house of dharma in ${ninthHouse?.sign.name || 'its sign'} shapes your sense of purpose and higher direction. ` +
        `In your current ${currentLord} Mahadasha, the emphasis is on themes connected to ${currentLord}'s significations. ` +
        `Trust the timing of your life and focus on growth areas highlighted by your current planetary period.`;
}

// --- Helper functions ---

function getPlanetStrengthNote(p: PlanetPlacement): string {
    const notes: Record<string, string> = {
        'sun': 'strong leadership and self-confidence',
        'moon': 'emotional richness and intuitive strength',
        'mars': 'excellent energy, drive, and physical vitality',
        'mercury': 'sharp intellect and communication skills',
        'jupiter': 'wisdom, prosperity, and spiritual grace',
        'venus': 'love, beauty, and artistic sensitivity',
        'saturn': 'discipline, fairness, and lasting achievement',
    };
    return notes[p.id] || 'heightened power in this placement';
}

function getHouseOrdinal(house: number): string {
    const ordinals = ['', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th', '11th', '12th'];
    return ordinals[house] || `${house}th`;
}

function getRelationshipQuality(signName: string): string {
    const qualities: Record<string, string> = {
        'Aries': 'independence, passion, and directness',
        'Taurus': 'stability, sensuality, and loyalty',
        'Gemini': 'intellectual connection and versatility',
        'Cancer': 'emotional depth, nurturing, and security',
        'Leo': 'warmth, generosity, and admiration',
        'Virgo': 'practicality, reliability, and service',
        'Libra': 'harmony, beauty, and equal partnership',
        'Scorpio': 'depth, intensity, and transformative bonds',
        'Sagittarius': 'adventure, freedom, and philosophical connection',
        'Capricorn': 'commitment, structure, and shared ambition',
        'Aquarius': 'friendship, independence, and shared ideals',
        'Pisces': 'compassion, spirituality, and unconditional love',
    };
    return qualities[signName] || 'meaningful connection';
}

function getVenusTheme(venus: PlanetPlacement): string {
    if (venus.isExalted) return 'a naturally refined and loving approach to relationships, heightened artistic sensibility';
    if (venus.isDebilitated) return 'relationships may require conscious effort, with growth through challenges in love';
    return `an approach to love colored by ${venus.sign.name} qualities — ${SIGN_PERSONALITIES[venus.sign.name]?.traits?.split(',').slice(0, 2).join(' and ') || 'unique'}`;
}
