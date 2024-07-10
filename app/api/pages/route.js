import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const pagesFilePath = path.join(process.cwd(), 'data', 'pages.json');

export async function GET() {
  try {
    const fileContent = await fs.readFile(pagesFilePath, 'utf-8');
    const pages = JSON.parse(fileContent);
    return NextResponse.json({ success: true, data: pages });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to read pages file', error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { title, route, content } = await request.json();
    const fileContent = await fs.readFile(pagesFilePath, 'utf-8');
    const pages = JSON.parse(fileContent);

    if (pages.find(page => page.route === route)) {
      return NextResponse.json({ success: false, message: 'Route already exists' }, { status: 400 });
    }

    const newPage = { title, route, content };
    pages.push(newPage);
    await fs.writeFile(pagesFilePath, JSON.stringify(pages, null, 2));
    return NextResponse.json({ success: true, data: newPage }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to save new page', error: error.message }, { status: 500 });
  }
}
