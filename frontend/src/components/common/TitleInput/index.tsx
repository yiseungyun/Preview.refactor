interface TitleProps {
  placeholder: string;
  onChange: (title: string) => void;
}

const TitleInput = ({ placeholder, onChange }: TitleProps) => {
  const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  return (
    <input
      className="text-medium-m w-full h-11 p-4 border-custom-s border-gray-100 rounded-custom-m"
      placeholder={placeholder}
      onChange={changeHandler}
      minLength={5}
      maxLength={20}
    />
  );
};

export default TitleInput;
