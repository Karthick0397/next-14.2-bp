import { useEffect, useState } from 'react';
import { IS_PRODUCTION } from 'shared/hoc/constants';

export default function useAvoidHydration(isLoader) {
  const [isMounted, setIsMounted] = useState();
  const [loader, setLoader] = useState(isLoader);
  useEffect(() => {
    setIsMounted(true);
    if (isLoader) setLoader(false);
  }, []);
  return {
    AVOID_HYDRATION_ISSUE_IN_DEVELOPMENT: isMounted || IS_PRODUCTION,
    loader: IS_PRODUCTION ? false : loader,
  };
}
