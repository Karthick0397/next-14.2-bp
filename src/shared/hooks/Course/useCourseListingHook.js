import { useAuthenticationHOC, useQuery } from "shared/hoc";
import { STUDENT, TUTOR } from "utils/Routes/constants";

export const useCourseListingHook = ({ USER_TYPE = TUTOR } = {}) => {
  const {
    reducerName,
    reducerConstants: { LIST_MY_COURSES_API, STUDENT_LIST_MY_COURSES_API },
  } = useAuthenticationHOC();
  const [myCourses] = useQuery(reducerName, [
    USER_TYPE === STUDENT ? STUDENT_LIST_MY_COURSES_API : LIST_MY_COURSES_API,
  ]);

  return {
    myCourses,
  };
};
