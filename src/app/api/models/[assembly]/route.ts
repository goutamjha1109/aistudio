import { NextResponse } from 'next/server';
 
const BACKEND_URL = process.env.BACKEND_URL || 'http://127.0.0.1:8000';
 
// GET /api/models/[assembly] -> fetch that assembly's .gltf file
export async function GET(
    _req: Request,
    { params }: { params: Promise<{ assembly: string }> }
) {
    const { assembly } = await params;
 
    try {
        const res = await fetch(`${BACKEND_URL}/models/${assembly}`);
 
        if (!res.ok) {
            return NextResponse.json({ error: 'Model not found' }, { status: res.status });
        }
 
        const buffer = await res.arrayBuffer();
        return new NextResponse(buffer, {
            status: 200,
            headers: { 'Content-Type': 'model/gltf+json' },
        });
    } catch (err) {
        console.error('Backend error:', err);
        return NextResponse.json({ error: 'Failed to reach backend' }, { status: 502 });
    }
}
 