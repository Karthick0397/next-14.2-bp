import { useDashboardHOC, useQuery } from "shared/hoc";

const LIMIT = 50;

export const useComplaintTypeListingHook = () => {
  const {
    reducerName,
    reducerConstants: { GET_COMPLAINTS_TYPES_LIST_API },
    actions: {
      GET_COMPLAINTS_TYPES_LIST_API_CALL,
      GET_COMPLAINTS_TYPES_LIST_API_CANCEL,
    },
  } = useDashboardHOC();

  const getComplaintsTypes = () => {
    let query = {
      paginate: 1,
      items: LIMIT,
      page: 1,
    };
    GET_COMPLAINTS_TYPES_LIST_API_CALL({
      request: {
        query,
      },
    });
    return () => {
      GET_COMPLAINTS_TYPES_LIST_API_CANCEL();
    };
  };
  const {
    data: { data: complaintTypes = [] },
    loader: typeListLoader,
  } = useQuery(
    // const { data, loader: typeListLoader } = useQuery(
    reducerName,
    GET_COMPLAINTS_TYPES_LIST_API,
    {
      requiredKey: ["loader", "data"],
      default: {},
      initialLoaderState: true,
    }
  );
  // let { data: complaintTypes = [], loader: typeListLoader } = data;
  return {
    getComplaintsTypes,
    complaintTypes,
    typeListLoader,
  };
};
