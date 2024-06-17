import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const pagesFilePath = path.join(process.cwd(), 'data', 'pages.json');

export async function GET() {
  const fileContent = fs.readFileSync(pagesFilePath);
  const pages = JSON.parse(fileContent);
  return NextResponse.json({ success: true, data: pages });
}

export async function POST(request) {
  const { title, route, content } = await request.json();
  const fileContent = fs.readFileSync(pagesFilePath);
  const pages = JSON.parse(fileContent);

  if (pages.find(page => page.route === route)) {
    return NextResponse.json({ success: false, message: 'Route already exists' }, { status: 400 });
  }

  const newPage = { title, route, content };
  pages.push(newPage);
  fs.writeFileSync(pagesFilePath, JSON.stringify(pages, null, 2));
  return NextResponse.json({ success: true, data: newPage }, { status: 201 });
}
