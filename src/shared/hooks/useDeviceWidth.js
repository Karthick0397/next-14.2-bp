import { useState, useEffect } from "react";
import useDebounce from "./useDebounce";

// useDeviceWidth hook to return the width of the device on resize event
const useDeviceWidth = () => {
  const [windowWidth, setWindowWidth] = useState();

  useEffect(() => setWindowWidth(window.innerWidth), []);

  const handleWindowResize = () => {
    setWindowWidth(window.innerWidth);
  };

  const debouncedHandleResize = useDebounce(handleWindowResize, 200);

  useEffect(() => {
    window.addEventListener("resize", debouncedHandleResize);

    return () => {
      window.removeEventListener("resize", debouncedHandleResize);
    };
  }, []);

  return windowWidth;
};

export default useDeviceWidth;
