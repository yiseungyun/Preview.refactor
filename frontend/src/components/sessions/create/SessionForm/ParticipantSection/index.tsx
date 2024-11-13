import { useState } from "react";
import ParticipantButton from "./ParticpantButton";
import SelectTitle from "../../SelectTitle";
type Participant = 1 | 2 | 3 | 4 | 5;
const MEMBER_COUNTS = [1, 2, 3, 4, 5] as const;

const ParticipantSection = () => {
  const [totalMember, setTotalMember] = useState<Participant>(1);

  return (
    <div>
      <SelectTitle title="최대 인원" />
      <div className="flex w-full h-11 gap-2">
        {MEMBER_COUNTS.map((value) => (
          <ParticipantButton
            key={value}
            totalMember={totalMember}
            selectedValue={value}
            onClick={() => setTotalMember(value)}
          />
        ))}
      </div>
    </div>
  );
};

export default ParticipantSection;
