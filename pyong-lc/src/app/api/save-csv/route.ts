import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const { filename, content } = await req.json();

    if (!filename || !content) {
      return NextResponse.json({ error: '缺少文件名或内容' }, { status: 400 });
    }

    const filePath = path.join(process.cwd(), 'public', 'text', filename);
    await fs.writeFile(filePath, content, 'utf8');

    return NextResponse.json({ message: '保存成功' });
  } catch (err) {
    console.error('写入失败:', err);
    return NextResponse.json({ error: '写入失败' }, { status: 500 });
  }
}
