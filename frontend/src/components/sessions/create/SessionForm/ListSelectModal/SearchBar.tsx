import { IoIosSearch } from "react-icons/io";

const SearchBar = () => {
  return (
    <div className="relative mx-8 mb-6 h-11 flex items-center text-gray-400">
      <IoIosSearch className="absolute left-4 w-5 h-5" />
      <input
        className={
          "rounded-custom-m pl-10 px-4 w-full h-full border border-gray-200 text-medium-r"
        }
        type="text"
        placeholder="질문지를 검색하세요"
      />
    </div>
  )
}

export default SearchBar;