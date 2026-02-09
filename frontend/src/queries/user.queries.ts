import { Register, useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import api from "../lib/client-fetcher";
import { Error, Message } from "../types/common";
import { AdminCreateUser, Login, UserInfo } from "../types/user";

export function useGetUserList() {
  return useQuery<UserInfo[], AxiosError<Message>>({
    queryKey: ["users"],
    queryFn: async () =>
      await api.get<UserInfo[]>("/admin/users").then((res) => res.data),
    staleTime: 1000 * 60 * 10,
  });
}

export function useCreateUser() {
  return useMutation<Message, AxiosError<Error>, AdminCreateUser>({
    mutationFn: async (user: AdminCreateUser) =>
      await api.post<Message>("/admin/users", user).then((res) => res.data),
  });
}

export function useLogin() {
  return useMutation<UserInfo, AxiosError<Error>, Login>({
    mutationFn: async (user: Login) =>
      await api.post<UserInfo>("/auth/login", user).then((res) => res.data),
  });
}

export function useLogout() {
  return useMutation<Message, AxiosError<Error>, void>({
    mutationFn: async () =>
      await api.post<Message>("/auth/logout").then((res) => res.data),
  });
}

export function useRegister() {
  return useMutation<UserInfo, AxiosError<Error>, Register>({
    mutationFn: async (user: Register) =>
      await api.post<UserInfo>("/auth/register", user).then((res) => res.data),
  });
}
