// ============================================================================
// API Route: Generate Chart Reading
// POST /api/chart/generate
// ============================================================================

import { NextResponse } from 'next/server';
import { generateChartReading, AstrologyEngineError } from '@/lib/astrology';
import { prisma } from '@/lib/db/prisma';

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

        // Store in database
        const birthProfile = await prisma.birthProfile.create({
            data: {
                fullName,
                birthDate,
                birthTime,
                birthPlace,
                latitude: reading.resolvedBirthData.latitude,
                longitude: reading.resolvedBirthData.longitude,
                timezone: reading.resolvedBirthData.timezone,
                chartResult: {
                    create: {
                        chartData: JSON.stringify(reading.chart),
                        dashaData: JSON.stringify(reading.dasha),
                        interpretation: JSON.stringify(reading.interpretation),
                        aiContext: JSON.stringify(reading.aiContext),
                    },
                },
            },
            include: {
                chartResult: true,
            },
        });

        return NextResponse.json({
            success: true,
            id: birthProfile.chartResult?.id,
            reading,
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
