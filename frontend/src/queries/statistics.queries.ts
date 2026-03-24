import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import api from "../lib/client-fetcher";
import { Message } from "../types/common";
import { Statistics } from "../types/statistics";

export function useGetStatistics() {
  return useQuery<Statistics, AxiosError<Message>>({
    queryKey: ["statistics"],
    queryFn: async () =>
      await api.get<Statistics>("/admin/statistics").then((res) => res.data),
    staleTime: 0,
  });
}
