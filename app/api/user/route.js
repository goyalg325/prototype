import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { promises as fs } from 'fs';
import path from 'path';

const JWT_SECRET = process.env.JWT_SECRET;
const userFilePath = path.resolve(process.cwd(), 'data/users.json');

export async function GET(request) {
  const token = request.cookies.get('token')?.value || request.headers.get('Authorization')?.split(' ')[1];

  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return NextResponse.json({ username: decoded.username, role: decoded.role });
  } catch (error) {
    return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
  }
}

export async function POST(request) {
  const { username, password, role } = await request.json();
  const token = request.cookies.get('token')?.value || request.headers.get('Authorization')?.split(' ')[1];

  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== 'admin') {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const fileContents = await fs.readFile(userFilePath, 'utf-8');
    const users = JSON.parse(fileContents);

    if (users.find(user => user.username === username)) {
      return NextResponse.json({ message: 'User already exists' }, { status: 400 });
    }

    users.push({ username, password: hashedPassword, role });

    await fs.writeFile(userFilePath, JSON.stringify(users, null, 2));

    return NextResponse.json({ message: 'User created successfully' }, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}