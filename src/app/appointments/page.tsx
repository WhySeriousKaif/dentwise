"use client";

import { AppointmentConfirmationModal } from "@/components/appointments/AppointmentConfirmationModal";
import { AppointmentDetailsModal } from "@/components/appointments/AppointmentDetailsModal";
import BookingConfirmationStep from "@/components/appointments/BookingConfirmationStep";
import DoctorSelectionStep from "@/components/appointments/DoctorSelectionStep";
import ProgressSteps from "@/components/appointments/ProgressSteps";
import TimeSelectionStep from "@/components/appointments/TimeSelectionStep";
import Navbar from "@/components/Navbar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useBookAppointment, useUserAppointments, useCancelAppointment } from "@/hooks/use-appointment";
import { APPOINTMENT_TYPES } from "@/lib/utils";
import { format } from "date-fns";
import { useState } from "react";
import { toast } from "sonner";

// Helper function to safely format dates
const safeFormatDate = (date: any, formatString: string) => {
  try {
    if (!date) {
      return "No Date";
    }
    
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      return "Invalid Date";
    }
    
    return format(dateObj, formatString);
  } catch (error) {
    console.error("Date formatting error:", error);
    return "Invalid Date";
  }
};

function AppointmentsPage() {
  // state management for the booking process - this could be done with something like Zustand for larger apps
  const [selectedDentistId, setSelectedDentistId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [currentStep, setCurrentStep] = useState(1); // 1: select dentist, 2: select time, 3: confirm
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [bookedAppointment, setBookedAppointment] = useState<any>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const bookAppointmentMutation = useBookAppointment();
  const cancelAppointmentMutation = useCancelAppointment();
  const { data: userAppointments = [] } = useUserAppointments();

  const handleSelectDentist = (dentistId: string) => {
    setSelectedDentistId(dentistId);

    // reset the state when dentist changes
    setSelectedDate("");
    setSelectedTime("");
    setSelectedType("");
  };

  const handleAppointmentClick = (appointment: any) => {
    setSelectedAppointment(appointment);
    setShowDetailsModal(true);
  };

  const handleDeleteAppointment = async (appointmentId: string) => {
    try {
      await cancelAppointmentMutation.mutateAsync(appointmentId);
      toast.success('Appointment cancelled successfully');
      setShowDetailsModal(false);
    } catch (error) {
      toast.error('Failed to cancel appointment');
    }
  };

  const handleBookAppointment = async () => {
    if (!selectedDentistId || !selectedDate || !selectedTime) {
      toast.error("Please fill in all required fields");
      return;
    }

    const appointmentType = APPOINTMENT_TYPES.find((t) => t.id === selectedType);
    
    // Mock doctor data - in a real app, this would come from the doctor selection
    const doctorData = {
      "1": { name: "Dr. Sarah Johnson", imageUrl: "/doctors/dr-sarah-johnson.jpg" },
      "2": { name: "Dr. Michael Chen", imageUrl: "/doctors/dr-michael-chen.jpg" },
      "3": { name: "Dr. Emily Davis", imageUrl: "/doctors/dr-emily-davis.jpg" }
    };
    
    const selectedDoctor = doctorData[selectedDentistId] || { name: "Dr. Smith", imageUrl: "/default-doctor.jpg" };

    bookAppointmentMutation.mutate(
      {
        doctorId: selectedDentistId,
        doctorName: selectedDoctor.name,
        doctorImageUrl: selectedDoctor.imageUrl,
        date: selectedDate,
        time: selectedTime,
        reason: appointmentType?.name,
      },
      {
        onSuccess: async (appointment) => {
          // Debug: Log the appointment object to see its structure
          console.log('Booked appointment:', appointment);
          
          // store the appointment details to show in the modal
          setBookedAppointment(appointment);

          try {
            const emailResponse = await fetch("/api/send-appointment-email", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                userEmail: appointment.patient?.email || 'user@example.com',
                doctorName: appointment.doctorName,
                appointmentDate: safeFormatDate(appointment.date, "EEEE, MMMM d, yyyy"),
                appointmentTime: appointment.time,
                appointmentType: appointmentType?.name,
                duration: appointmentType?.duration,
                price: appointmentType?.price,
              }),
            });

            if (!emailResponse.ok) {
              console.warn("Email service not configured - appointment still booked successfully");
            } else {
              console.log("Confirmation email sent successfully");
            }
          } catch (error) {
            console.warn("Email service not available - appointment still booked successfully:", error);
          }

          // show the success modal
          setShowConfirmationModal(true);

          // reset form
          setSelectedDentistId(null);
          setSelectedDate("");
          setSelectedTime("");
          setSelectedType("");
          setCurrentStep(1);
        },
        onError: (error) => toast.error(`Failed to book appointment: ${error.message}`),
      }
    );
  };

  return (
    <ProtectedRoute>
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-8 pt-24">
        {/* header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Book an Appointment</h1>
          <p className="text-muted-foreground">Find and book with verified dentists in your area</p>
        </div>

        <ProgressSteps currentStep={currentStep} />

        {currentStep === 1 && (
          <DoctorSelectionStep
            selectedDentistId={selectedDentistId}
            onContinue={() => setCurrentStep(2)}
            onSelectDentist={handleSelectDentist}
          />
        )}

        {currentStep === 2 && selectedDentistId && (
          <TimeSelectionStep
            selectedDentistId={selectedDentistId}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            selectedType={selectedType}
            onBack={() => setCurrentStep(1)}
            onContinue={() => setCurrentStep(3)}
            onDateChange={setSelectedDate}
            onTimeChange={setSelectedTime}
            onTypeChange={setSelectedType}
          />
        )}

        {currentStep === 3 && selectedDentistId && (
          <BookingConfirmationStep
            selectedDentistId={selectedDentistId}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            selectedType={selectedType}
            isBooking={bookAppointmentMutation.isPending}
            onBack={() => setCurrentStep(2)}
            onModify={() => setCurrentStep(2)}
            onConfirm={handleBookAppointment}
          />
        )}
      </div>

      {bookedAppointment && (
        <AppointmentConfirmationModal
          open={showConfirmationModal}
          onOpenChange={setShowConfirmationModal}
          appointmentDetails={{
            doctorName: bookedAppointment.appointment?.doctorName || bookedAppointment.doctorName || 'Dr. Smith',
            appointmentDate: safeFormatDate(bookedAppointment.appointment?.date || bookedAppointment.date, "EEEE, MMMM d, yyyy"),
            appointmentTime: bookedAppointment.appointment?.time || bookedAppointment.time || '10:00 AM',
            userEmail: bookedAppointment.appointment?.patient?.email || bookedAppointment.patient?.email || 'user@example.com',
          }}
        />
      )}

      {/* SHOW EXISTING APPOINTMENTS FOR THE CURRENT USER */}
      {userAppointments.length > 0 && (
        <div className="mb-8 max-w-7xl mx-auto px-6 py-8">
          <h2 className="text-xl font-semibold mb-4">Your Upcoming Appointments</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {userAppointments.map((appointment, index) => (
              <div 
                key={appointment._id || appointment.id || `appointment-${index}`} 
                className="bg-card border rounded-lg p-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleAppointmentClick(appointment)}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="size-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <img
                      src={appointment.doctorImageUrl}
                      alt={appointment.doctorName}
                      className="size-10 rounded-full"
                    />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{appointment.doctorName}</p>
                    <p className="text-muted-foreground text-xs">{appointment.reason}</p>
                  </div>
                </div>
                <div className="space-y-1 text-sm">
                  <p className="text-muted-foreground">
                    📅 {safeFormatDate(appointment.date, "MMM d, yyyy")}
                  </p>
                  <p className="text-muted-foreground">🕐 {appointment.time}</p>
                  <p className="text-xs text-muted-foreground mt-2">Click to view details</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Appointment Details Modal */}
      <AppointmentDetailsModal
        open={showDetailsModal}
        onOpenChange={setShowDetailsModal}
        appointment={selectedAppointment}
        onDelete={handleDeleteAppointment}
        isDeleting={cancelAppointmentMutation.isPending}
      />
    </ProtectedRoute>
  );
}

export default AppointmentsPage;
