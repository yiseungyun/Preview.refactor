import ParticipantButton from "./ParticpantButton";
import SelectTitle from "../../../../common/SelectTitle";
import useSessionFormStore from "@/stores/useSessionFormStore";
const MEMBER_COUNTS = [1, 2, 3, 4, 5] as const;

const ParticipantSection = () => {
  const { setParticipant } = useSessionFormStore();

  return (
    <div>
      <SelectTitle title="최대 인원" />
      <div className="flex w-full h-11 gap-2">
        {MEMBER_COUNTS.map((value) => (
          <ParticipantButton
            key={value}
            selectedValue={value}
            onClick={() => setParticipant(value)}
          />
        ))}
      </div>
    </div>
  );
};

export default ParticipantSection;
