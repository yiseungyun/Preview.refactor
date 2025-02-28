import useSessionFormStore from "@/pages/channels/create/stores/useSessionFormStore";

interface Props {
  selectedValue: 1 | 2 | 3 | 4 | 5;
  onClick: () => void;
}

const ParticipantButton = ({ selectedValue, onClick }: Props) => {
  const { participant } = useSessionFormStore();

  return (
    <button
      className={`flex-grow rounded-custom-m
      ${participant === selectedValue
          ? "bg-green-50 border-2 border-green-200 text-semibold-r text-green-600"
          : "bg-gray-white border border-gray-100 text-medium-m text-gray-400"
        }`}
      onClick={onClick}
    >
      {selectedValue}명
    </button>
  );
};

export default ParticipantButton;
