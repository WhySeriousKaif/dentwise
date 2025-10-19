'use client';

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { getUserAppointments } from "@/features/appointments/appointmentSlice";
import { format, isAfter, isSameDay, parseISO } from "date-fns";
import NoNextAppointments from "./NoNextAppointments";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { CalendarIcon, ClockIcon, UserIcon, EyeIcon } from "lucide-react";
import { AppointmentDetailsModal } from "../appointments/AppointmentDetailsModal";
import { useCancelAppointment } from "@/hooks/use-appointment";
import { toast } from "sonner";

function NextAppointment() {
  const dispatch = useAppDispatch();
  const { appointments, loading } = useAppSelector((state) => state.appointments);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const cancelAppointmentMutation = useCancelAppointment();

  useEffect(() => {
    dispatch(getUserAppointments());
  }, [dispatch]);

  const handleAppointmentClick = (appointment) => {
    setSelectedAppointment(appointment);
    setShowDetailsModal(true);
  };

  const handleDeleteAppointment = async (appointmentId) => {
    try {
      await cancelAppointmentMutation.mutateAsync(appointmentId);
      toast.success('Appointment cancelled successfully');
      setShowDetailsModal(false);
    } catch (error) {
      toast.error('Failed to cancel appointment');
    }
  };

  // filter for upcoming appointments (today or future) - include pending and confirmed
  const upcomingAppointments =
    appointments?.filter((appointment) => {
      const appointmentDate = parseISO(appointment.date);
      const today = new Date();
      const isUpcoming = isSameDay(appointmentDate, today) || isAfter(appointmentDate, today);
      const hasValidStatus = appointment.status === "confirmed" || appointment.status === "CONFIRMED" || appointment.status === "pending" || appointment.status === "PENDING";
      return isUpcoming && hasValidStatus;
    }) || [];

  // get the next appointment (earliest upcoming one)
  const nextAppointment = upcomingAppointments[0];

  if (loading) {
    return (
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-background">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="size-5 text-primary" />
            Next Appointment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!nextAppointment) return <NoNextAppointments />; // no appointments, return nothing

  const appointmentDate = parseISO(nextAppointment.date);
  const formattedDate = format(appointmentDate, "EEEE, MMMM d, yyyy");
  const isToday = isSameDay(appointmentDate, new Date());

  return (
    <>
      <Card 
        className="border-primary/20 bg-gradient-to-br from-primary/5 to-background cursor-pointer hover:shadow-md transition-shadow"
        onClick={() => handleAppointmentClick(nextAppointment)}
      >
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="size-5 text-primary" />
            Next Appointment
            <EyeIcon className="size-4 text-muted-foreground ml-auto" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
        {/* Status Badge */}
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full border border-primary/20">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-primary">
              {isToday ? "Today" : "Upcoming"}
            </span>
          </div>
          <span className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded">
            {nextAppointment.status}
          </span>
        </div>

        {/* Appointment Details */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <UserIcon className="size-4 text-primary" />
            </div>
            <div>
              <p className="font-medium text-sm">{nextAppointment.doctorName || nextAppointment.doctor?.name || 'Dr. Smith'}</p>
              <p className="text-xs text-muted-foreground">{nextAppointment.reason || 'General Checkup'}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <CalendarIcon className="size-4 text-primary" />
            </div>
            <div>
              <p className="font-medium text-sm">{formattedDate}</p>
              <p className="text-xs text-muted-foreground">
                {isToday ? "Today" : format(appointmentDate, "EEEE")}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <ClockIcon className="size-4 text-primary" />
            </div>
            <div>
              <p className="font-medium text-sm">{nextAppointment.time}</p>
              <p className="text-xs text-muted-foreground">Local time</p>
            </div>
          </div>
        </div>

        {/* More Appointments Count */}
        {upcomingAppointments.length > 1 && (
          <p className="text-xs text-center text-muted-foreground">
            +{upcomingAppointments.length - 1} more upcoming appointment
            {upcomingAppointments.length > 2 ? "s" : ""}
          </p>
        )}
        </CardContent>
      </Card>

      {/* Appointment Details Modal */}
      {selectedAppointment && (
        <AppointmentDetailsModal
          open={showDetailsModal}
          onOpenChange={setShowDetailsModal}
          appointment={selectedAppointment}
          onDelete={handleDeleteAppointment}
          isDeleting={cancelAppointmentMutation.isPending}
        />
      )}
    </>
  );
}

export default NextAppointment;
