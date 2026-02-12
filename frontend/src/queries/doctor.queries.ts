import { useQuery } from "@tanstack/react-query";
import { CurrentDoctorProfile } from "../types/doctor";
import { AxiosError } from "axios";
import { Error } from "../types/common";
import api from "../lib/client-fetcher";

export function useGetDoctorProfile() {
  return useQuery<CurrentDoctorProfile, AxiosError<Error>>({
    queryKey: ["doctor-profile"],
    queryFn: async () =>
      await api
        .get<CurrentDoctorProfile>("/doctors/me")
        .then((res) => res.data),
    staleTime: 1000 * 60 * 10,
  });
}
