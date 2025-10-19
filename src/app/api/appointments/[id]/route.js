import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Appointment from '@/models/Appointment';
import jwt from 'jsonwebtoken';

// Update appointment
export async function PUT(request, { params }) {
  try {
    await connectDB();
    
    const { id } = params;
    const token = request.cookies.get('token')?.value;
    
    if (!token) {
      return NextResponse.json({ message: 'No token' }, { status: 401 });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const updateData = await request.json();
    
    // Find the appointment and verify ownership
    const appointment = await Appointment.findOne({
      _id: id,
      patient: decoded.id
    });
    
    if (!appointment) {
      return NextResponse.json({ message: 'Appointment not found' }, { status: 404 });
    }
    
    // Update the appointment
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      id,
      { ...updateData, updatedAt: new Date() },
      { new: true }
    ).populate('patient', 'name email');
    
    return NextResponse.json({ 
      message: 'Appointment updated successfully',
      appointment: updatedAppointment 
    });
    
  } catch (error) {
    console.error('Update appointment error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

// Delete appointment
export async function DELETE(request, { params }) {
  try {
    await connectDB();
    
    const { id } = params;
    const token = request.cookies.get('token')?.value;
    
    if (!token) {
      return NextResponse.json({ message: 'No token' }, { status: 401 });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find the appointment and verify ownership
    const appointment = await Appointment.findOne({
      _id: id,
      patient: decoded.id
    });
    
    if (!appointment) {
      return NextResponse.json({ message: 'Appointment not found' }, { status: 404 });
    }
    
    // Delete the appointment
    await Appointment.findByIdAndDelete(id);
    
    return NextResponse.json({ message: 'Appointment deleted successfully' });
    
  } catch (error) {
    console.error('Delete appointment error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
