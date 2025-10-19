import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
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
    
    // Get user's appointments from database
    const appointments = await Appointment.find({ patient: decoded.id })
      .populate('patient', 'name email')
      .sort({ date: 1, time: 1 });
    
    return NextResponse.json({ 
      appointments: appointments,
      message: 'Appointments retrieved successfully' 
    });
  } catch (error) {
    console.error('Get appointments error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();
    
    // Get token from cookies
    const token = request.cookies.get('token')?.value;
    
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const appointmentData = await request.json();
    
    // Get user details
    const user = await User.findById(decoded.id);
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }
    
    // Create appointment in database
    const newAppointment = new Appointment({
      patient: decoded.id,
      doctorId: appointmentData.doctorId,
      doctorName: appointmentData.doctorName || 'Dr. Smith', // Default doctor name
      doctorImageUrl: appointmentData.doctorImageUrl || '/default-doctor.jpg',
      date: new Date(appointmentData.date),
      time: appointmentData.time,
      reason: appointmentData.reason,
      status: 'pending',
      notes: appointmentData.notes || ''
    });
    
    await newAppointment.save();
    
    // Populate the appointment with patient details
    await newAppointment.populate('patient', 'name email');
    
    return NextResponse.json({ 
      appointment: newAppointment,
      message: 'Appointment created successfully' 
    }, { status: 201 });
  } catch (error) {
    console.error('Create appointment error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
