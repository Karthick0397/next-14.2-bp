import { useAuthenticationHOC, useQuery } from 'shared/hoc';
import { STUDENT, TUTOR, USER_TYPE_MAPPING } from 'utils/Routes/constants';

export const useProfileDetailHook = () => {
  const { reducerName } = useAuthenticationHOC();

  const [profile, isLoggedIn] = useQuery(reducerName, ['profile', 'isLoggedIn']);

  const userType = profile.user_type || TUTOR;

  return {
    profile,
    isLoggedIn,
    userType,
    USER_TYPE: USER_TYPE_MAPPING[userType] || TUTOR,
    IS_STUDENT: USER_TYPE_MAPPING[userType] === STUDENT,
  };
};
