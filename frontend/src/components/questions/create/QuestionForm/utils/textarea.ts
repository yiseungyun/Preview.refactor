import { RefObject } from "react";

export const adjustHeight = (
  textareaRef: RefObject<HTMLTextAreaElement>,
  value: string
) => {
  const textarea = textareaRef.current;
  if (textarea) {
    textarea.style.height = "auto";

    const defaultHeight = 2.75;
    const scrollHeight = textarea.scrollHeight;

    textarea.style.height = value
      ? `${Math.max(defaultHeight, scrollHeight / 16)}rem`
      : `${defaultHeight}rem`;
  }
};
