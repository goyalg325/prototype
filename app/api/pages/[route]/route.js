import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const pagesFilePath = path.join(process.cwd(), 'data', 'pages.json');

export async function GET(request, { params }) {
  const { route } = params;
  const fileContent = fs.readFileSync(pagesFilePath);
  const pages = JSON.parse(fileContent);
  const page = pages.find(p => p.route === route);
  if (!page) {
    return NextResponse.json({ success: false }, { status: 404 });
  }
  return NextResponse.json({ success: true, data: page });
}

export async function DELETE(request, { params }) {
  const { route } = params;
  const fileContent = fs.readFileSync(pagesFilePath);
  let pages = JSON.parse(fileContent);
  pages = pages.filter(p => p.route !== route);
  fs.writeFileSync(pagesFilePath, JSON.stringify(pages, null, 2));
  return NextResponse.json({ success: true });
}
