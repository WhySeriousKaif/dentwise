import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Appointment from '@/models/Appointment';
import jwt from 'jsonwebtoken';

export async function GET(request) {
  try {
    await connectDB();
    
    // Get token from cookies
    const token = request.cookies.get('token')?.value;
    
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user's appointment stats from database
    const total = await Appointment.countDocuments({ patient: decoded.id });
    const confirmed = await Appointment.countDocuments({ patient: decoded.id, status: 'confirmed' });
    const pending = await Appointment.countDocuments({ patient: decoded.id, status: 'pending' });
    const cancelled = await Appointment.countDocuments({ patient: decoded.id, status: 'cancelled' });
    const completed = await Appointment.countDocuments({ patient: decoded.id, status: 'completed' });
    
    // Count upcoming appointments (confirmed or pending with future dates)
    const now = new Date();
    const upcoming = await Appointment.countDocuments({
      patient: decoded.id,
      status: { $in: ['confirmed', 'pending'] },
      date: { $gte: now }
    });
    
    const stats = {
      total,
      confirmed,
      pending,
      cancelled,
      upcoming,
      completed
    };
    
    return NextResponse.json({ 
      stats,
      message: 'Appointment stats retrieved successfully' 
    });
  } catch (error) {
    console.error('Get appointment stats error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
