import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://127.0.0.1:8000';

// GET /api/models -> list available assemblies for the library screen
export async function GET() {
    try {
        const res = await fetch(`${BACKEND_URL}/models`);
        const data = await res.json();
        return NextResponse.json(data, { status: res.status });
    } catch (err) {
        console.error('Backend error:', err);
        return NextResponse.json({ error: 'Failed to reach backend' }, { status: 502 });
    }
}