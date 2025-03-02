import { useSuspenseQuery } from "@tanstack/react-query";
import { getSessionList } from "@/api/session-list/getSessionList.ts";

interface ChannelListRequest {
  inProgress: boolean;
}

export const useGetChannelList = ({ inProgress }: ChannelListRequest) => {
  const { data } = useSuspenseQuery({
    queryKey: ["channelList", inProgress],
    queryFn: () => getSessionList({ inProgress }),
    staleTime: 60 * 1000,
    refetchInterval: 60 * 1000,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  return { data };
};
