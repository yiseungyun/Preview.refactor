import SelectTitle from "../../SelectTitle";

const AccessSection = () => {
  return (
    <div>
      <SelectTitle title="공개 여부" />
      <div className="flex w-full">
        <button className="rounded-l-custom-m border">공개</button>
        <button className="rounded-r-custom-m border">비공개</button>
      </div>
    </div>
  );
};

export default AccessSection;
