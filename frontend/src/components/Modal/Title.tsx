import { ModalProps } from ".";

const ModalTitle = ({
  title,
  subtitle,
}: Pick<ModalProps, "title" | "subtitle">) => {
  return (
    <div className="text-gray-black flex flex-col">
      {title.split("\\n").map((text, index) => {
        return (
          <p key={index} className="text-semibold-m flex justify-center">
            {text}
          </p>
        );
      })}
      <span className="text-medium-l flex justify-center mt-1">{subtitle}</span>
    </div>
  );
};

export default ModalTitle;
