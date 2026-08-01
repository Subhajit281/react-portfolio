import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToHash = () => {
  const { hash } = useLocation();

  useEffect(() => {
    if (!hash) return;

    const id = hash.replace("#", "");

    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({
        behavior: "smooth",
      });
    }, 100);
  }, [hash]);

  return null;
};

export default ScrollToHash;