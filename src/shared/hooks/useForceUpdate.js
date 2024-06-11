import { useState } from "react";

// Custom hook for force update
export const useForceUpdate = () => {
  const [, forceUpdate] = useState();
  return () => forceUpdate((prev) => !prev);
};
