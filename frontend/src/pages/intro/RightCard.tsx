interface IntroCardProps {
  index: string;
  title: string | React.ReactNode;
  description: string | React.ReactNode;
  image: string;
  buttonText: string;
  onClick: () => void;
}

const RightCard = ({
  index,
  title,
  description,
  image,
  buttonText,
  onClick
}: IntroCardProps) => {
  return (
    <div className="max-w-6xl mx-auto grid grid-cols-2">
      <div>
        <div className="select-none text-8xl font-semibold text-gray-600 mb-3">
          {index}
        </div>
        <h2 className="text-3xl font-semibold text-gray-600 mb-10 leading-snug">{title}</h2>
        <p className="text-gray-400 mb-6 text-medium-l">{description}</p>
        <button
          onClick={onClick}
          className="flex items-center text-semibold-l text-green-400 hover:text-green-300 transition-colors"
        >
          <span className="mr-2">{buttonText}</span>
        </button>
      </div>
      <div>
        <img
          src={image}
          alt={buttonText}
          className="w-2xl rounded-xl shadow-16 mt-24"
        />
      </div>
    </div>
  );
};

export default RightCard;
