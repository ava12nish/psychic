// ============================================================================
// API Route: Contact Form
// POST /api/contact
// ============================================================================

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, subject, message } = body;

        // Validation
        if (!name || !email || !message) {
            return NextResponse.json(
                { success: false, error: 'Name, email, and message are required' },
                { status: 400 }
            );
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { success: false, error: 'Please provide a valid email address' },
                { status: 400 }
            );
        }

        // Store submission
        const submission = await prisma.contactSubmission.create({
            data: { name, email, subject: subject || null, message },
        });

        return NextResponse.json({
            success: true,
            id: submission.id,
            message: 'Thank you for reaching out. We will get back to you soon.',
        });
    } catch (error) {
        console.error('Contact form error:', error);
        return NextResponse.json(
            { success: false, error: 'An unexpected error occurred' },
            { status: 500 }
        );
    }
}
