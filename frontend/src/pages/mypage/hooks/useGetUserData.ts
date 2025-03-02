import { getMyInfo } from "@/api/user/getMyInfo";
import { useSuspenseQuery } from "@tanstack/react-query";

export const useGetUserData = () => {
  const { data } = useSuspenseQuery({
    queryKey: ["user", "my"],
    queryFn: () => getMyInfo(),
    staleTime: 60 * 1000,
    refetchInterval: 60 * 1000,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  return { data };
};
