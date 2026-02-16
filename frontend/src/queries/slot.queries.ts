import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import api from "../lib/client-fetcher";
import { CreateTimeSlot, TimeSlot } from "../types/slot";
import { Error } from "../types/common";

export default function useDoctorSlotsQuery(sundayOfWeek: string) {
  return useQuery<TimeSlot[], AxiosError<Error>>({
    queryKey: ["current-doctor-slots", sundayOfWeek],
    queryFn: async () =>
      await api
        .get<TimeSlot[]>(`/doctors/me/slots?sundayOfWeek=${sundayOfWeek}`)
        .then((res) => res.data),
    staleTime: 1000 * 60 * 10,
  });
}

export function useCreateUpdateSlots() {
  return useMutation<void, AxiosError<Error>, CreateTimeSlot[]>({
    mutationFn: async (slots) =>
      await api.post<void>(`/doctors/me/slots`, slots).then((res) => res.data),
  });
}
