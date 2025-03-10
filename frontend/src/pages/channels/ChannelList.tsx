import ChannelCard from "./ChannelCard";
import NotFound from "@components/common/Animate/NotFound.tsx";
import { useGetChannelList } from "@hooks/api/useGetChannelList";

interface ChannelListProps {
  inProgress: boolean;
}

const ChannelList = ({
  inProgress,
}: ChannelListProps) => {
  const { data: channelList } = useGetChannelList({ inProgress });

  if (channelList.length <= 0) {
    return (
      <div className="flex justify-center items-center">
        <NotFound
          key={-1}
          message={inProgress ? "현재 진행 중인 스터디 채널 없어요.\n채널을 생성해서 면접 연습을 시작하세요!" : "공개된 스터디 채널이 없어요.\n채널을 생성해서 면접 연습을 시작하세요!"}
        />
      </div>
    )
  }

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
        />
      );
    });
  };

  return (
    <div>
      <ul className="w-full grid grid-cols-2 lg:grid-cols-3 gap-4">
        {renderChannelList()}
      </ul>
    </div>
  );
};

export default ChannelList;
