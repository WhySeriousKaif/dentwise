"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { format, isBefore, isSameDay, parseISO } from "date-fns";
import Image from "next/image";
import { CalendarIcon, ClockIcon, UserIcon, InfoIcon, StethoscopeIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface AppointmentDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointment: any; // Consider a more specific type for appointment
  onDelete: (appointmentId: string) => void;
  isDeleting: boolean;
}

export function AppointmentDetailsModal({
  open,
  onOpenChange,
  appointment,
  onDelete,
  isDeleting,
}: AppointmentDetailsModalProps) {
  if (!appointment) return null;

  const appointmentDate = parseISO(appointment.date);
  const today = new Date();
  const canCancel = isBefore(today, appointmentDate) && !isSameDay(today, appointmentDate);

  const handleDeleteClick = () => {
    if (window.confirm("Are you sure you want to cancel this appointment? This action cannot be undone.")) {
      onDelete(appointment._id);
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'pending':
        return 'secondary';
      case 'confirmed':
        return 'default';
      case 'cancelled':
        return 'destructive';
      case 'completed':
        return 'outline';
      default:
        return 'outline';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] md:max-w-lg lg:max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <StethoscopeIcon className="h-5 w-5 text-primary" />
            Appointment Details
          </DialogTitle>
          <DialogDescription>
            View the full details of your appointment and manage it.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Doctor Info */}
          <div className="flex items-center gap-4 border-b pb-4">
            <Image
              src={appointment.doctorImageUrl || "/default-doctor.jpg"}
              alt={appointment.doctorName || "Doctor"}
              width={64}
              height={64}
              className="rounded-full object-cover size-16"
            />
            <div>
              <p className="text-lg font-semibold">{appointment.doctorName || "Dr. Unknown"}</p>
              <p className="text-sm text-muted-foreground">{appointment.reason || "General Checkup"}</p>
            </div>
          </div>

          {/* Appointment Details */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <CalendarIcon className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Date:</p>
                <p className="text-muted-foreground text-sm">
                  {format(appointmentDate, "EEEE, MMMM d, yyyy")}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ClockIcon className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Time:</p>
                <p className="text-muted-foreground text-sm">{appointment.time}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <InfoIcon className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Status:</p>
                <Badge variant={getStatusBadgeVariant(appointment.status)}>
                  {appointment.status?.charAt(0).toUpperCase() + appointment.status?.slice(1)}
                </Badge>
              </div>
            </div>
          </div>

          {/* Patient Info (Optional, if needed) */}
          {appointment.patient && (
            <div className="space-y-3 border-t pt-4">
              <p className="font-semibold text-md">Patient Information:</p>
              <div className="flex items-center gap-3">
                <UserIcon className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Name:</p>
                  <p className="text-muted-foreground text-sm">{appointment.patient.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-muted-foreground"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.93 1.93 0 0 1-2.06 0L2 7"/></svg>
                <div>
                  <p className="font-medium">Email:</p>
                  <p className="text-muted-foreground text-sm">{appointment.patient.email}</p>
                </div>
              </div>
            </div>
          )}

          {/* Notes */}
          {appointment.notes && (
            <div className="space-y-2 border-t pt-4">
              <p className="font-medium">Notes:</p>
              <p className="text-muted-foreground text-sm">{appointment.notes}</p>
            </div>
          )}
        </div>

        <DialogFooter>
          {appointment.status !== 'cancelled' && canCancel ? (
            <Button
              variant="destructive"
              onClick={handleDeleteClick}
              disabled={isDeleting}
            >
              {isDeleting ? "Cancelling..." : "Cancel Appointment"}
            </Button>
          ) : (
            <Button
              variant="secondary"
              disabled
              title="Appointments can only be cancelled before the day of the appointment."
            >
              Cannot Cancel
            </Button>
          )}
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
