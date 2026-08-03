import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    const body = await req.json();
    const partName = (body.part || '').toLowerCase().replace(/_\d+$/, '');
    console.log('Calling backend with:', { partName, question: body.question });

    try {
        const res = await fetch('http://127.0.0.1:8000/ask', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ part: partName, question: body.question }),
        });
        console.log('Backend status:', res.status);
        // const data = await res.json();
        // return NextResponse.json(data);
        // Forward the stream directly to the frontend
        return new NextResponse(res.body, {
        status: res.status,
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
        });
    } catch (err) {
        console.error('Backend error:', err);
        return NextResponse.json({ error: 'Failed to reach backend' }, { status: 502 });
    }
}