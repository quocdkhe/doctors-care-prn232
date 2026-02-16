import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import api from "../lib/client-fetcher";
import { TimeSlot } from "../types/slot";
import { Error } from "../types/common";

export default function useDoctorSlotsQuery(sundayOfWeek: string) {
  return useQuery<TimeSlot[], AxiosError<Error>>({
    queryKey: ["doctorSlots", sundayOfWeek],
    queryFn: async () =>
      await api.get<TimeSlot[]>(`/doctors/me/slots?sundayOfWeek=${sundayOfWeek}`).then((res) => res.data),
    staleTime: 1000 * 60 * 10,
  });
}