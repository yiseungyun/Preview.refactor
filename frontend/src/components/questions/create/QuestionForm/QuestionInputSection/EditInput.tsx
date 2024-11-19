interface EditInputProps {
  value: string;
  onChange: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

const EditInput = ({ value, onChange, onSave, onCancel }: EditInputProps) => {
  return (
    <div className="flex items-center relative">
      <input
        className="w-full h-11 pl-4 pr-24 shadow-16 rounded-custom-m text-medium-m text-gray-black"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        maxLength={100}
      />
      <div className="absolute right-4 flex gap-2 text-gray-600 text-semibold-s">
        <button onClick={onSave} className="hover:text-point-3">
          저장
        </button>
        <button onClick={onCancel} className="hover:text-point-1">
          취소
        </button>
      </div>
    </div>
  );
};

export default EditInput;
