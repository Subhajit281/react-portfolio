import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function ScrollToHash() {
  const { hash, pathname } = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => {
      // Let React finish rendering the new page
      ScrollTrigger.refresh();

      const lenis = window.__lenis;

      // No hash → go to top
      if (!hash) {
        if (lenis) {
          lenis.scrollTo(0, {
            immediate: true,
          });
        } else {
          window.scrollTo(0, 0);
        }

        return;
      }

      // Hash navigation
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

    return () => clearTimeout(timer);
  }, [pathname, hash]);

  return null;
}