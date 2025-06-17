import { NextResponse } from 'next/server';
import connectToDatabase from '../../../lib/mongodb'; // ✅ Mongoose connection
import User from '../../models/user'; // ✅ Your User schema
import crypto from 'crypto';
import nodemailer from 'nodemailer';

export async function POST(req) {
  try {
    await connectToDatabase();

    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // ✅ Generate token
    const token = crypto.randomBytes(32).toString('hex');

    // ✅ Save token & expiry to DB
    user.resetToken = token;
    user.resetTokenExpiry = Date.now() + 3600000; // 1 hour
    await user.save();

    // ✅ Create transporter
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // ✅ Create dynamic reset URL
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const resetUrl = `${baseUrl}/reset-password?token=${token}`;

    // ✅ Send email
    await transporter.sendMail({
      to: user.email,
      subject: 'Password Reset',
      html: `
        <p>You requested to reset your password.</p>
        <p>Click <a href="${resetUrl}">here</a> to reset your password.</p>
        <p>This link will expire in 1 hour.</p>
      `,
    });

    return NextResponse.json({ message: 'Reset link sent!' });
  } catch (error) {
    console.error('Error in forgot-password API:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
