// app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';
import { mkdirSync, existsSync } from 'fs';
import sharp from 'sharp'; 

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const name = (formData.get('name') as string).trim();
  const beforeFile = formData.get('before') as File;
  const afterFile = formData.get('after') as File;

  if (!name || !beforeFile || !afterFile) {
    return NextResponse.json({ error: '缺少必要字段' }, { status: 400 });
  }

  const baseName = name;
  const ext = '.jpg';

  const beforeDir = path.join(process.cwd(), 'public', 'img', 'demo', 'before');
  const afterDir = path.join(process.cwd(), 'public', 'img', 'demo', 'after');

  [beforeDir, afterDir].forEach((dir) => {
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  });

  let saveName = `${baseName}${ext}`;
  let counter = 1;
  while (
    existsSync(path.join(beforeDir, saveName)) ||
    existsSync(path.join(afterDir, saveName))
  ) {
    saveName = `${baseName}_${counter}${ext}`;
    counter++;
  }

  const beforePath = path.join(beforeDir, saveName);
  const afterPath = path.join(afterDir, saveName);

  await compressAndSave(beforePath, beforeFile);
  await compressAndSave(afterPath, afterFile);

  return NextResponse.json({ message: '上传成功（已压缩）', savedName: saveName });
}

async function compressAndSave(filePath: string, file: File) {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  await sharp(buffer)
    .resize({ width: 1200, withoutEnlargement: true })
    .jpeg({ quality: 70 })
    .toFile(filePath);
}
