import { AppContext } from 'constants/context';
import { useContext } from 'react';

export function useLoginModalHook() {
  const { setShowLoginModal } = useContext(AppContext);
  return {
    setShowLoginModal,
  };
}
