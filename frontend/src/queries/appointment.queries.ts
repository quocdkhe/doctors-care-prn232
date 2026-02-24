import { useMutation, useQuery } from "@tanstack/react-query";
import {
  CreateAppointment,
  AppointmentItem,
  AppointmentDetail,
  PatientAppointment,
} from "../types/appointment";
import api from "../lib/client-fetcher";
import { AxiosError } from "axios";
import { Error } from "../types/common";

export const useCreateAppointment = () => {
  return useMutation<void, AxiosError<Error>, CreateAppointment>({
    mutationFn: async (data) =>
      await api.post<void>(`/appointments`, data).then((res) => res.data),
  });
};

export const useDoctorGetAllAppointments = (month: number, year: number) => {
  return useQuery<AppointmentItem[], AxiosError<Error>>({
    queryKey: ["doctor-appointments", year, month],
    queryFn: async () =>
      await api
        .get<
          AppointmentItem[]
        >(`/doctors/me/appointments?month=${month}&year=${year}`)
        .then((res) => res.data),
    staleTime: 1000 * 60 * 10,
  });
};

export const useGetAppointmentDetail = (appointmentId: string) => {
  return useQuery<AppointmentDetail, AxiosError<Error>>({
    queryKey: ["appointment-detail", appointmentId],
    queryFn: async () =>
      await api
        .get<AppointmentDetail>(`/appointments/${appointmentId}`)
        .then((res) => res.data),
    staleTime: 1000 * 60 * 10,
  });
};

export const useCancelAppointment = (appointmentId: string) => {
  return useMutation<void, AxiosError<Error>, undefined>({
    mutationFn: async () =>
      await api
        .patch<void>(`/appointments/${appointmentId}/cancel`)
        .then((res) => res.data),
  });
};

export const useCompleteAppointment = (appointmentId: string) => {
  return useMutation<
    void,
    AxiosError<Error>,
    { medicalRecordFileUrl: string | null }
  >({
    mutationFn: async ({ medicalRecordFileUrl }) =>
      await api
        .patch<void>(`/appointments/${appointmentId}/complete`, {
          medicalRecordFileUrl,
        })
        .then((res) => res.data),
  });
};

export const useGetAllAppointmentsForPatient = () => {
  return useQuery<PatientAppointment[], AxiosError<Error>>({
    queryKey: ["patient-appointments"],
    queryFn: async () =>
      await api
        .get<PatientAppointment[]>(`/patients/me/appointments`)
        .then((res) => res.data),
    staleTime: 1000 * 60 * 10,
  });
};

export const useRevokeAppointment = (appointmentId: string) => {
  return useMutation<void, AxiosError<Error>, undefined>({
    mutationFn: async () =>
      await api
        .delete<void>(`/appointments/${appointmentId}/revoke`)
        .then((res) => res.data),
  });
};
