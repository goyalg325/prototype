import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const pagesFilePath = path.join(process.cwd(), 'data', 'pages.json');

export async function GET(request, { params }) {
  try {
    const { route } = params;
    const fileContent = await fs.readFile(pagesFilePath, 'utf-8');
    const pages = JSON.parse(fileContent);
    const page = pages.find(p => p.route === route);
    if (!page) {
      return NextResponse.json({ success: false, message: 'Page not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: page });
  } catch (error) {
    console.error('Error fetching page:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch page', error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { route } = params;
    const fileContent = await fs.readFile(pagesFilePath, 'utf-8');
    let pages = JSON.parse(fileContent);
    const filteredPages = pages.filter(p => p.route !== route);
    if (filteredPages.length === pages.length) {
      return NextResponse.json({ success: false, message: 'Page not found' }, { status: 404 });
    }
    await fs.writeFile(pagesFilePath, JSON.stringify(filteredPages, null, 2));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting page:', error);
    return NextResponse.json({ success: false, message: 'Failed to delete page', error: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { route } = params;
    const { title, content } = await request.json();
    const fileContent = await fs.readFile(pagesFilePath, 'utf-8');
    let pages = JSON.parse(fileContent);
    const pageIndex = pages.findIndex(p => p.route === route);
    if (pageIndex === -1) {
      return NextResponse.json({ success: false, message: 'Page not found' }, { status: 404 });
    }
    const updatedPage = { ...pages[pageIndex], title, content };
    pages[pageIndex] = updatedPage;
    await fs.writeFile(pagesFilePath, JSON.stringify(pages, null, 2));
    return NextResponse.json({ success: true, data: updatedPage });
  } catch (error) {
    console.error('Error updating page:', error);
    return NextResponse.json({ success: false, message: 'Failed to update page', error: error.message }, { status: 500 });
  }
}
