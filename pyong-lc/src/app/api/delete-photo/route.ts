//api/delete-photo/route.ts
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';

const extensions = ['.jpg', '.jpeg', '.png', '.webp'];

export async function POST(req: NextRequest) {
  try {
    const { names } = await req.json(); // ['sample1', 'sample2']
    if (!Array.isArray(names) || names.length === 0) {
      return NextResponse.json({ error: '缺少要删除的文件名' }, { status: 400 });
    }

    const basePath = path.join(process.cwd(), 'public', 'img', 'demo');
    const deleteTargets: string[] = [];

    for (const name of names) {
      for (const ext of extensions) {
        deleteTargets.push(
          path.join(basePath, 'before', `${name}${ext}`),
          path.join(basePath, 'after', `${name}${ext}`)
        );
      }
    }

    const deleted: string[] = [];

    for (const filePath of deleteTargets) {
      try {
        await fs.unlink(filePath);
        deleted.push(filePath);
      } catch (err) {
        // 如果文件不存在也忽略
        if ((err as NodeJS.ErrnoException).code !== 'ENOENT') {
          console.warn('无法删除文件:', filePath, err);
        }
      }
    }

    return NextResponse.json({ message: '删除成功', deleted });
  } catch (err) {
    console.error('删除接口错误:', err);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}
