import ChannelCard from "./ChannelCard";
import useToast from "@hooks/useToast.ts";
import type { Channel } from "@/pages/channels/types/channel";
import NotFound from "@components/common/Animate/NotFound.tsx";

interface ChannelListProps {
  inProgress: boolean;
  channelList: Channel[];
}

const ChannelList = ({
  inProgress,
  channelList,
}: ChannelListProps) => {
  const toast = useToast();
  const renderChannelList = () => {
    return channelList.map((channel) => {
      return (
        <ChannelCard
          key={channel.id}
          id={channel.id}
          inProgress={channel.inProgress}
          category={channel.category}
          title={channel.title}
          host={channel.host.nickname ?? "익명"}
          questionListId={channel.questionListId}
          questionListTitle={channel.questionListTitle}
          participants={channel.participants}
          maxParticipants={channel.maxParticipants}
          onEnter={() => {
            toast.success("채널에 참가했습니다.");
          }}
        />
      );
    });
  };

  return (
    <div>
      {channelList.length <= 0 ? (
        <div className={"flex justify-center items-center"}>
          <NotFound
            key={-1}
            message={
              inProgress
                ? "현재 진행 중인 스터디 채널 없어요.\n채널을 생성해서 면접 연습을 시작하세요!"
                : "공개된 스터디 채널이 없어요.\n채널을 생성해서 면접 연습을 시작하세요!"
            }
            className={""}
          />
        </div>
      ) : (
        <ul className={"w-full grid grid-cols-2 lg:grid-cols-3 gap-4"}>
          {renderChannelList()}
        </ul>
      )}
    </div>
  );
};

export default ChannelList;
