import { useQuery } from "@tanstack/react-query";
import { getSessionList } from "@/api/session-list/getSessionList.ts";

export const useGetSessionList = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["sessionList"],
    queryFn: () => getSessionList(),
    staleTime: 60 * 1000,
    refetchInterval: 60 * 1000,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  return {
    data,
    isLoading,
    error,
  };
};
