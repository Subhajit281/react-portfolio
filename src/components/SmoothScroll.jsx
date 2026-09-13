import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToHash() {
  const { hash, pathname } = useLocation();

  useEffect(() => {
    let cancelled = false;

    const timer = setTimeout(() => {
      if (cancelled) return;

      const lenis = window.__lenis;

      // No hash → scroll to top
      if (!hash) {
        if (lenis) {
          lenis.scrollTo(0, {
            immediate: true,
          });
        } else {
          window.scrollTo({
            top: 0,
            left: 0,
            behavior: "auto",
          });
        }

        return;
      }

      const id = decodeURIComponent(hash.slice(1));
      const element = document.getElementById(id);

      if (!element) return;

      if (lenis) {
        lenis.scrollTo(element, {
          offset: -75,
          duration: 1.1,
        });
      } else {
        element.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 200);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [pathname, hash]);

  return null;
}