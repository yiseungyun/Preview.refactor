import { useQuery } from "@tanstack/react-query";
import { getSessionList } from "@/api/session-list/getSessionList.ts";

interface SessionListRequest {
  inProgress: boolean;
}

export const useGetSessionList = ({ inProgress }: SessionListRequest) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["sessionList", inProgress],
    queryFn: () => getSessionList({ inProgress }),
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
