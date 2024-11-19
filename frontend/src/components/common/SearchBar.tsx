import { IoIosSearch } from "react-icons/io";
interface Props {
  text: string;
}

const SearchBar = ({ text }: Props) => {
  return (
    <div className="relative w-full  h-11 flex items-center text-gray-400">
      <IoIosSearch className="absolute left-4 w-5 h-5" />
      <input
        className={
          "rounded-custom-m pl-10 px-4 w-full h-full border border-gray-200 text-medium-r"
        }
        type="text"
        placeholder={text}
      />
    </div>
  );
};

export default SearchBar;
