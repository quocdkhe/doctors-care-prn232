import { useMutation, useQuery } from "@tanstack/react-query";
import { CurrentDoctorProfile, UpdateDoctorProfile } from "../types/doctor";
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

export function useUpdateDoctorProfile() {
  return useMutation<
    CurrentDoctorProfile,
    AxiosError<Error>,
    UpdateDoctorProfile
  >({
    mutationFn: async (data: UpdateDoctorProfile) =>
      await api
        .put<CurrentDoctorProfile>("/doctors/me", data)
        .then((res) => res.data),
  });
}
