import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import api from "../lib/client-fetcher";
import { Error } from "../types/common";
import { CreateSpecialtyDto, Specialty, UpdateSpecialtyDto } from "../types/specialty";

export function useGetSpecialtyList() {
  return useQuery<Specialty[], AxiosError<Error>>({
    queryKey: ["specialties"],
    queryFn: async () =>
      await api.get<Specialty[]>("/specialties").then((res) => res.data),
    staleTime: 1000 * 60 * 10,
  });
}

export function useGetSpecialtyById(id: number) {
  return useQuery<Specialty, AxiosError<Error>>({
    queryKey: ["specialties", id],
    queryFn: async () =>
      await api.get<Specialty>(`/specialties/${id}`).then((res) => res.data),
    staleTime: 1000 * 60 * 10,
  });
}

export function useCreateSpecialty() {
  return useMutation<Specialty, AxiosError<Error>, CreateSpecialtyDto>({
    mutationFn: async (specialty: CreateSpecialtyDto) =>
      await api.post<Specialty>("/specialties", specialty).then((res) => res.data),
  });
}

export function useUpdateSpecialty(id: number) {
  return useMutation<Specialty, AxiosError<Error>, UpdateSpecialtyDto>({
    mutationFn: async (specialty: UpdateSpecialtyDto) =>
      await api.put<Specialty>(`/specialties/${id}`, specialty).then((res) => res.data),
  });
}

export function useDeleteSpecialty() {
  return useMutation<void, AxiosError<Error>, number>({
    mutationFn: async (id: number) =>
      await api.delete<void>(`/specialties/${id}`).then((res) => res.data),
  });
} 