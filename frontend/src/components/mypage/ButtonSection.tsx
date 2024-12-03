import Button from "@/components/common/Button/DefaultButton";

interface ButtonSectionProps {
  closeModal: () => void;
  onSubmit: () => void;
}

const ButtonSection = ({ closeModal, onSubmit }: ButtonSectionProps) => {
  return (
    <div className="flex w-full gap-4 my-4 px-8">
      <Button text="취소하기" type="gray" onClick={closeModal} />
      <Button text="수정하기" type="green" onClick={onSubmit} />
    </div>
  );
};

export default ButtonSection;
