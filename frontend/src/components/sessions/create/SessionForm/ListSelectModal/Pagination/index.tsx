import { MdArrowBackIosNew } from "react-icons/md";
import { MdArrowForwardIos } from "react-icons/md";

interface PagenationProps {
  currentPage: number;
  totalPage: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({
  currentPage,
  totalPage,
  onPageChange,
}: PagenationProps) => {
  const getPageNumbers = () => {
    const pages = [];
    const maxButtons = 5;
    let startPage = Math.max(1, Math.floor((currentPage - 1) / maxButtons) * maxButtons + 1);
    let endPage = Math.min(totalPage, startPage + maxButtons - 1);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return { pages, startPage, endPage };
  };

  const { pages, startPage, endPage } = getPageNumbers();
  const showPrevButton = startPage > 1;
  const showNextButton = endPage < totalPage;

  return (
    <div className="flex justify-center gap-1 my-6">
      <button
        onClick={() => onPageChange(startPage - 1)}
        className={`px-2 py-1 text-gray-black ${!showPrevButton && 'invisible'}`}
      >
        <MdArrowBackIosNew />
      </button>
      {pages.map((number) => (
        <button
          key={number}
          onClick={() => onPageChange(number)}
          className={`w-9 h-9 rounded-custom-s ${currentPage === number
            ? "bg-green-200 text-white text-semibold-m"
            : "text-gray-black text-medium-l"
            }`}
        >
          {number}
        </button>
      ))}
      <button
        onClick={() => onPageChange(endPage + 1)}
        className={`px-2 py-1 text-gray-black ${!showNextButton && 'invisible'}`}
      >
        <MdArrowForwardIos />
      </button>
    </div>
  );
};

export default Pagination;