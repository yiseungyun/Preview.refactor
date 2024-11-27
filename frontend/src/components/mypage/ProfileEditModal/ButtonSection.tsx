import Button from "@components/common/Button";

const ButtonSection = () => {
  return (
    <div className="flex w-full gap-4 my-4 px-8">
      <Button text="취소하기" type="gray" />
      <Button text="수정하기" type="green" />
    </div>
  );
};

export default ButtonSection;
