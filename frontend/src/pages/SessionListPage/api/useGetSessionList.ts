import { useQuery } from "@tanstack/react-query";
import { getSessionList } from "@/api/session-list/getSessionList.ts";

export const useGetSessionList = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["sessionList"],
    queryFn: () => getSessionList(),
  });

  return {
    data,
    isLoading,
    error,
  };
};
