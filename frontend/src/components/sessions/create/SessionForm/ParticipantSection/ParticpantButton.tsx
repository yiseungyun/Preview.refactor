interface Props {
  totalMember: 1 | 2 | 3 | 4 | 5;
  selectedValue: 1 | 2 | 3 | 4 | 5;
  onClick: () => void;
}

const ParticipantButton = ({ totalMember, selectedValue, onClick }: Props) => {
  return (
    <button
      className={`flex-grow rounded-custom-m
      ${
        totalMember === selectedValue
          ? "bg-green-50 border-2 border-green-200 text-semibold-m text-green-600"
          : "bg-gray-white border border-gray-100 text-medium-l text-gray-400"
      }`}
      onClick={onClick}
    >
      {selectedValue}명
    </button>
  );
};

export default ParticipantButton;
