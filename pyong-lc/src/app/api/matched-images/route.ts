//api/matched-images/route.ts
import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

export async function GET() {
  const publicDir = path.join(process.cwd(), 'public');
  const beforeDir = path.join(publicDir, 'img/demo/before');
  const afterDir = path.join(publicDir, 'img/demo/after');

  const supportedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];

  try {
    const beforeFiles = fs.readdirSync(beforeDir).filter(file =>
      supportedExtensions.includes(path.extname(file).toLowerCase())
    );


    const afterFilesSet = new Set(
      fs.readdirSync(afterDir).filter(file =>
        supportedExtensions.includes(path.extname(file).toLowerCase())
      )
    );


    const matched = beforeFiles
      .filter(file => afterFilesSet.has(file))
      .map(file => ({
        name: path.parse(file).name,
        beforeUrl: `/img/demo/before/${file}`,
        afterUrl: `/img/demo/after/${file}`,
      }));

    return NextResponse.json(matched);
  } catch (err) {
    console.error('读取图片目录失败:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
