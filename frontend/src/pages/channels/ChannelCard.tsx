import { Link } from "react-router-dom";
import type { Channel } from "@/pages/channels/types/channel";
import useToast from "@/hooks/useToast";
import { FaUserGroup } from "@/components/common/Icons/FaUserGroup";

interface ChannelCardProps extends Omit<Channel, "host" | "createdAt"> {
  host: string;
}

const ChannelCard = ({
  category = ["기타"],
  id,
  title,
  host,
  participants,
  maxParticipants,
  inProgress,
  questionListTitle,
}: ChannelCardProps) => {
  const toast = useToast();

  return (
    <li className={`relative h-52 bg-white rounded-custom-m px-5 py-6 transition-all duration-200 ease-in-out hover:-translate-y-1.5 border-custom-s border-gray-200
      ${inProgress === false ? "hover:shadow-16 hover:ring-1 hover:ring-green-200" : ""}`}>
      <Link
        to={`/channel/${id}`}
        className="w-full h-full"
        onClick={() => toast.success("채널에 참가했습니다.")}
      >
        <div className="flex flex-col justify-between">
          <div className="flex-grow flex flex-col items-start">
            <span className="text-semibold-s text-green-600 bg-green-50 border-custom-s border-gray-300 rounded-2xl py-px px-2">
              {category[0]}
            </span>
            <div className="px-0.5">
              <h3 className="text-semibold-m mt-2 mb-0.5">{title}</h3>
              <p className="text-medium-m text-gray-400">
                {questionListTitle ?? "함께 면접 스터디에 참여해보세요!"}
              </p>
              <div className="absolute bottom-5 left-6 text-medium-r flex flex-col">
                <span className="text-gray-600">{host}</span>
                <span className="text-gray-black flex gap-2 items-center">
                  <FaUserGroup className="text-green-400" />
                  참여자 {participants}/{maxParticipants}명
                </span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </li>
  );
};

export default ChannelCard;
