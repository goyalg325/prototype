import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { promises as fs } from 'fs';
import path from 'path';

const JWT_SECRET = process.env.JWT_SECRET;
const userFilePath = path.resolve(process.cwd(), 'data/users.json');

export async function POST(request) {
  try {
    const { username, password } = await request.json();
    console.log('Login attempt for username:', username);

    const fileContents = await fs.readFile(userFilePath, 'utf-8');
    const users = JSON.parse(fileContents);
    console.log('Users from file:', users);

    const user = users.find(u => u.username === username);
    console.log('Found user:', user);

    if (!user) {
      console.log('User not found');
      return NextResponse.json({ message: 'Invalid username or password' }, { status: 401 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log('Is password valid:', isPasswordValid);

    if (!isPasswordValid) {
      console.log('Invalid password');
      return NextResponse.json({ message: 'Invalid username or password' }, { status: 401 });
    }

    console.log('Login successful');
    const token = jwt.sign(
      { username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    const response = NextResponse.json({ token, message: 'Login successful' });
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'strict',
      maxAge: 86400,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}