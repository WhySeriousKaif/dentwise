"use client";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { 
  getAppointmentStats, 
  getUserAppointments as fetchUserAppointments 
} from "@/features/appointments/appointmentSlice";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { appointmentService } from "@/services/appointmentService";

export function useGetAppointments() {
  const dispatch = useAppDispatch();
  const { appointments, loading } = useAppSelector((state) => state.appointments);

  const result = useQuery({
    queryKey: ["getAppointments"],
    queryFn: async () => {
      await dispatch(fetchUserAppointments());
      return appointments;
    },
  });

  return { ...result, data: appointments, isLoading: loading };
}

export function useBookedTimeSlots(doctorId: string, date: string) {
  return useQuery({
    queryKey: ["getBookedTimeSlots", doctorId, date],
    queryFn: async () => {
      // Mock implementation - replace with actual API call
      return [];
    },
    enabled: !!doctorId && !!date,
  });
}

export function useBookAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: appointmentService.createAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getUserAppointments"] });
    },
    onError: (error) => console.error("Failed to book appointment:", error),
  });
}

// Get user-specific appointments
export function useUserAppointments() {
  const dispatch = useAppDispatch();
  const { appointments, loading } = useAppSelector((state) => state.appointments);

  const result = useQuery({
    queryKey: ["getUserAppointments"],
    queryFn: async () => {
      await dispatch(fetchUserAppointments());
      return appointments;
    },
  });

  return { ...result, data: appointments, isLoading: loading };
}

export function useUpdateAppointmentStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ appointmentId, updateData }) => 
      appointmentService.updateAppointment(appointmentId, updateData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getAppointments"] });
    },
    onError: (error) => console.error("Failed to update appointment:", error),
  });
}

export function useCancelAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (appointmentId) => 
      appointmentService.cancelAppointment(appointmentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getUserAppointments"] });
      queryClient.invalidateQueries({ queryKey: ["getAppointments"] });
    },
    onError: (error) => console.error("Failed to cancel appointment:", error),
  });
}
