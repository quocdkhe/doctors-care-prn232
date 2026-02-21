import { useMutation, useQuery } from "@tanstack/react-query";
import { CreateAppointment, AppointmentItem } from "../types/appointment";
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
    queryKey: ["doctor-appointments", month, year],
    queryFn: async () =>
      await api
        .get<
          AppointmentItem[]
        >(`/doctors/me/appointments?month=${month}&year=${year}`)
        .then((res) => res.data),
    staleTime: 1000 * 60 * 10,
  });
};
