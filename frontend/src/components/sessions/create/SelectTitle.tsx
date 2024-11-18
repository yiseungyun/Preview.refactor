interface Props {
  title: string;
}

const SelectTitle = ({ title }: Props) => {
  return <p className="text-semibold-l mb-3">{title}</p>;
};

export default SelectTitle;
