import { FaArrowRight } from "react-icons/fa6";

interface IntroCardProps {
  index: string;
  title: string | React.ReactNode;
  description: string | React.ReactNode;
  image: string;
  buttonText: string;
  onClick: () => void;
  imagePosition?: "left" | "right";
}

const IntroCard = ({
  index,
  title,
  description,
  image,
  buttonText,
  onClick,
  imagePosition,
}: IntroCardProps) => {
  return (
    <div className="max-w-6xl mx-auto grid grid-cols-2 gap-16 items-center">
      {imagePosition === "left" && (
        <div>
          <img
            src={image}
            alt={buttonText}
            className="w-full rounded-2xl shadow-lg"
          />
        </div>
      )}
      <div>
        <div className="select-none text-[200px] font-bold text-gray-800">
          {index}
        </div>
        <h2 className="text-4xl font-bold text-white mb-6">{title}</h2>
        <p className="text-gray-200 mb-6">{description}</p>
        <button
          onClick={onClick}
          className="flex items-center text-green-100 hover:text-green-200 transition-colors"
        >
          <span className="mr-2">{buttonText}</span>
          <FaArrowRight className="w-4 h-4" />
        </button>
      </div>
      {imagePosition === "right" && (
        <div>
          <img
            src={image}
            alt={buttonText}
            className="w-full rounded-2xl shadow-lg"
          />
        </div>
      )}
    </div>
  );
};

export default IntroCard;
