import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import api from "../lib/client-fetcher";
import { Error, Message } from "../types/common";
import { AdminCreateUser, UserInfo } from "../types/user";

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
