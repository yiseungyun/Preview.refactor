import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const useCategory = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("전체");
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (selectedCategory !== "전체") {
      setSearchParams({ category: selectedCategory });
    } else {
      setSearchParams({});
    }
  }, [selectedCategory]);

  useEffect(() => {
    if (searchParams.get("category")) {
      setSelectedCategory(searchParams.get("category") ?? "전체");
    }
  }, [searchParams]);

  return {
    selectedCategory,
    setSelectedCategory,
  };
};

export default useCategory;
