import { useEffect } from "react";

const scrollToTop = () =>
  window.scroll({
    top: 0,
    left: 0,
    behavior: "smooth",
  });

function docReady(fn) {
  // see if DOM is already available
  if (typeof document !== "undefined")
    if (
      document.readyState === "complete" ||
      document.readyState === "interactive"
    ) {
      // call on next available tick
      setTimeout(fn, 1);
    } else {
      document.addEventListener("DOMContentLoaded", fn);
    }
}
export default function useScrollToTopHook() {
  useEffect(() => {
    docReady(() => {
      if (typeof window !== "undefined") scrollToTop();
    });
    if (typeof window !== "undefined")
      window.onunload = () => {
        scrollToTop();
      };
  }, []);
}
