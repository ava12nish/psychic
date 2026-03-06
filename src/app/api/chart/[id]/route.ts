// ============================================================================
// API Route: Get Chart by ID
// GET /api/chart/[id]
// ============================================================================

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const chartResult = await prisma.chartResult.findUnique({
            where: { id },
            include: {
                birthProfile: true,
                qaMessages: {
                    orderBy: { createdAt: 'asc' },
                },
            },
        });

        if (!chartResult) {
            return NextResponse.json(
                { success: false, error: 'Chart not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            chart: {
                id: chartResult.id,
                birthProfile: {
                    fullName: chartResult.birthProfile.fullName,
                    birthDate: chartResult.birthProfile.birthDate,
                    birthTime: chartResult.birthProfile.birthTime,
                    birthPlace: chartResult.birthProfile.birthPlace,
                    latitude: chartResult.birthProfile.latitude,
                    longitude: chartResult.birthProfile.longitude,
                    timezone: chartResult.birthProfile.timezone,
                },
                chartData: JSON.parse(chartResult.chartData),
                dashaData: JSON.parse(chartResult.dashaData),
                interpretation: JSON.parse(chartResult.interpretation),
                aiContext: JSON.parse(chartResult.aiContext),
                createdAt: chartResult.createdAt,
                messages: chartResult.qaMessages,
            },
        });
    } catch (error) {
        console.error('Chart retrieval error:', error);
        return NextResponse.json(
            { success: false, error: 'An unexpected error occurred' },
            { status: 500 }
        );
    }
}
