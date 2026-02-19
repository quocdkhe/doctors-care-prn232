import { useMutation } from "@tanstack/react-query";
import { CreateAppointment } from "../types/appointment";
import api from "../lib/client-fetcher";
import { AxiosError } from "axios";
import { Error } from "../types/common";

export const useCreateAppointment = () => {
  return useMutation<void, AxiosError<Error>, CreateAppointment>({
    mutationFn: async (data) =>
      await api
        .post<void>(`/appointments`, data)
        .then((res) => res.data),
  });
};
