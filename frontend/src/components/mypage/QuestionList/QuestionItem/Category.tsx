interface CategoryProps {
  text: string;
}

const Category = ({ text }: CategoryProps) => {
  return (
    <span className="px-3 py-1 bg-green-50 text-green-600 dark:bg-green-600/20 dark:text-green-400 text-medium-s rounded-full">
      {text}
    </span>
  );
};

export default Category;
