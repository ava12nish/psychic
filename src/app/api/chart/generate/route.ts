// ============================================================================
// API Route: Generate Chart Reading
// POST /api/chart/generate
// ============================================================================

import { NextResponse } from 'next/server';
import { generateChartReading, AstrologyEngineError } from '@/lib/astrology';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { fullName, birthDate, birthTime, birthPlace } = body;

        // Generate the chart reading
        const reading = await generateChartReading({
            fullName,
            birthDate,
            birthTime,
            birthPlace,
        });

        // Stateless mode: Skip database, format and return directly to client
        const formattedChartData = {
            id: 'local',
            birthProfile: {
                fullName,
                birthDate,
                birthTime,
                birthPlace,
                latitude: reading.resolvedBirthData.latitude,
                longitude: reading.resolvedBirthData.longitude,
                timezone: reading.resolvedBirthData.timezone,
            },
            chartData: reading.chart,
            dashaData: reading.dasha,
            interpretation: reading.interpretation,
            aiContext: reading.aiContext,
            messages: []
        };

        return NextResponse.json({
            success: true,
            id: 'local',
            reading: formattedChartData,
        });
    } catch (error) {
        if (error instanceof AstrologyEngineError) {
            return NextResponse.json(
                { success: false, error: { code: error.code, message: error.message, field: error.field } },
                { status: 400 }
            );
        }
        console.error('Chart generation error:', error);
        return NextResponse.json(
            { success: false, error: { code: 'UNKNOWN_ERROR', message: 'An unexpected error occurred' } },
            { status: 500 }
        );
    }
}
