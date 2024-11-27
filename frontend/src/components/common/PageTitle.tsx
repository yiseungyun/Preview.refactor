interface TitleProps {
  title: string;
}

const PageTitle = ({ title }: TitleProps) => {
  return (
    <h1 className={"text-bold-l mb-6 text-gray-black dark:text-white"}>
      {title}
    </h1>
  );
};

export default PageTitle;
