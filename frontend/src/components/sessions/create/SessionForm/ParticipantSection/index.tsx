import { useState } from "react";
import ParticipantButton from "./ParticpantButton";
import SelectTitle from "../../SelectTitle";
type Participant = 1 | 2 | 3 | 4 | 5;

const ParticipantSection = () => {
  const [totalMember, setTotalMember] = useState<Participant>(1);

  return (
    <div>
      <SelectTitle title="최대 인원" />
      <div className="flex w-full h-11 gap-2">
        <ParticipantButton
          totalMember={totalMember}
          selectedValue={1}
          onClick={() => setTotalMember(1)}
        />
        <ParticipantButton
          totalMember={totalMember}
          selectedValue={2}
          onClick={() => setTotalMember(2)}
        />
        <ParticipantButton
          totalMember={totalMember}
          selectedValue={3}
          onClick={() => setTotalMember(3)}
        />
        <ParticipantButton
          totalMember={totalMember}
          selectedValue={4}
          onClick={() => setTotalMember(4)}
        />
        <ParticipantButton
          totalMember={totalMember}
          selectedValue={5}
          onClick={() => setTotalMember(5)}
        />
      </div>
    </div>
  );
};

export default ParticipantSection;
