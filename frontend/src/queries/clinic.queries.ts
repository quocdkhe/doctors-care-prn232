import { useMutation, useQuery } from "@tanstack/react-query";
import { Clinic, CreateClinic, UpdateClinic } from "../types/clinic";
import { AxiosError } from "axios";
import api from "../lib/client-fetcher";
import { Error } from "../types/common";

export function useGetClinicList() {
  return useQuery<Clinic[], AxiosError<Error>>({
    queryKey: ["clinics"],
    queryFn: async () =>
      await api.get<Clinic[]>("/clinics").then((res) => res.data),
    staleTime: 1000 * 60 * 10,
  });
}

export function useCreateClinic() {
  return useMutation<Clinic, AxiosError<Error>, CreateClinic>({
    mutationFn: async (clinic: CreateClinic) =>
      await api.post<Clinic>("/clinics", clinic).then((res) => res.data),
  });
}

export function useUpdateClinic(id: string) {
  return useMutation<Clinic, AxiosError<Error>, UpdateClinic>({
    mutationFn: async (clinic: UpdateClinic) =>
      await api.put<Clinic>(`/clinics/${id}`, clinic).then((res) => res.data),
  });
}

export function useDeleteClinic() {
  return useMutation<boolean, AxiosError<Error>, string>({
    mutationFn: async (id: string) =>
      await api.delete<boolean>(`/clinics/${id}`).then((res) => res.data),
  });
}

export function useGetClinic(id: string) {
  return useQuery<Clinic, AxiosError<Error>>({
    queryKey: ["clinics", id],
    queryFn: async () =>
      await api.get<Clinic>(`/clinics/${id}`).then((res) => res.data),
    staleTime: 1000 * 60 * 10,
  });
}

