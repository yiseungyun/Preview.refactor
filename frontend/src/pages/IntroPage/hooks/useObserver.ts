import { useEffect, useRef } from "react";

const useObserver = (option?: {
  threshold?: number;
  root?: HTMLElement | null;
  rootMargin?: string;
}) => {
  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observer.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          console.log(entry);
          if (entry.isIntersecting) {
            entry.target.animate(
              [
                { opacity: 0, transform: "translateY(-50px)" },
                { opacity: 1, transform: "translateY(0)" },
              ],
              {
                duration: 700,
                easing: "ease-in-out",
                fill: "both",
              }
            );
            observer.current?.unobserve(entry.target);
          }
        });
      },
      option ?? { threshold: 0.3 }
    );
  }, []);

  return { observer };
};

export default useObserver;
