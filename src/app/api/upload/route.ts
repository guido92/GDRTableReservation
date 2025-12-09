import { NextResponse } from 'next/server';
import sharp from 'sharp';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs/promises';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const filename = `${uuidv4()}.webp`;
        const uploadDir = path.join(process.cwd(), 'public/uploads');
        await fs.mkdir(uploadDir, { recursive: true });
        const filepath = path.join(uploadDir, filename);

        await sharp(buffer)
            .resize(1200, 800, { fit: 'cover', withoutEnlargement: true })
            .webp({ quality: 80 })
            .toFile(filepath);

        const publicUrl = `/uploads/${filename}`;

        return NextResponse.json({ url: publicUrl });
    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
    }
}
