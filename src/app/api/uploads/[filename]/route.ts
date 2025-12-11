
import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ filename: string }> }
) {
    const { filename } = await params;

    // Security check: prevent directory traversal
    if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
        return new NextResponse('Invalid filename', { status: 400 });
    }

    try {
        const filePath = path.join(process.cwd(), 'public/uploads', filename);

        // Check if file exists
        await fs.access(filePath);

        const fileBuffer = await fs.readFile(filePath);

        // Determine content type (default to webp as per upload logic, but fallbacks are nice)
        let contentType = 'image/webp';
        if (filename.endsWith('.png')) contentType = 'image/png';
        if (filename.endsWith('.jpg') || filename.endsWith('.jpeg')) contentType = 'image/jpeg';
        if (filename.endsWith('.gif')) contentType = 'image/gif';

        return new NextResponse(fileBuffer, {
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=31536000, immutable',
            },
        });
    } catch (error) {
        console.error('Error serving image:', error);
        return new NextResponse('Image not found', { status: 404 });
    }
}
