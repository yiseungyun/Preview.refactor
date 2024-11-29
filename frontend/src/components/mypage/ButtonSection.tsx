import Button from "@components/common/Button";

const ButtonSection = ({ closeModal }: { closeModal: () => void }) => {
  return (
    <div className="flex w-full gap-4 my-4 px-8">
      <Button text="취소하기" type="gray" onClick={closeModal} />
      <Button text="수정하기" type="green" onClick={() => { }} />
    </div>
  );
};

export default ButtonSection;
