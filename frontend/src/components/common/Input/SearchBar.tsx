import { IoIosSearch } from "../Icons/IoIosSearch";

interface Props {
  text: string;
}

const SearchBar = ({ text }: Props) => {
  return (
    <div className="relative w-full h-11 flex items-center text-gray-400 dark:text-white fill-current">
      <IoIosSearch className="absolute left-4" />
      <input
        className="rounded-custom-m pl-10 px-4 w-full h-full border border-gray-200 text-medium-m"
        type="text"
        placeholder={text}
      />
    </div>
  );
};

export default SearchBar;
