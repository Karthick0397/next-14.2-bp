import { useEffect, useMemo, useState } from "react";
import { useDashboardHOC, useQuery } from "shared/hoc";
import { useRouter, useSearchParams } from "next/navigation";
import { useRouter as useRouting } from "next/router";
const LIMIT = 50;

export const useComplaintListingHook = () => {
  const router = useRouter();
  const routing = useRouting();
  const {
    reducerName,
    reducerConstants: { GET_COMPLAINTS_LIST_API },
    actions: { GET_COMPLAINTS_LIST_API_CALL, GET_COMPLAINTS_LIST_API_CANCEL },
  } = useDashboardHOC();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState(
    searchParams.get("platform") || "All"
  );
  const [filters, setFilters] = useState({
    complaint_type: [],
  });
  const memoizedFilters = useMemo(() => filters, [filters]);
  const handleFilterChange = (filterType, values) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterType]: values,
    }));

    const updatedQuery = { ...routing.query, page: 1 };
    if (values.length !== 0) {
      updatedQuery[filterType] = values.join(",");
    } else {
      delete updatedQuery[filterType];
    }

    router.replace(
      {
        pathname: router.pathname,
        query: updatedQuery,
      },
      undefined,
      { shallow: true }
    );
  };
  const getComplaintsList = () => {
    let query = {
      paginate: 1,
      items: LIMIT,
      page: 1,
    };
    GET_COMPLAINTS_LIST_API_CALL({
      task: { clearData: true },
      request: {
        query,
      },
    });
    return () => {
      GET_COMPLAINTS_LIST_API_CANCEL();
    };
  };
  const clearFilters = () => {
    setFilters({
      complaint_type: [],
    });
    router.replace(
      {
        pathname: router.pathname,
      },
      undefined,
      { shallow: true }
    );
    handleTabChange("All");
  };
  const handleTabChange = (newTab) => {
    let updatedQuery = { ...router.query, page: 1 };

    if (newTab) {
      if (newTab !== "All") {
        updatedQuery["tab"] = newTab.toUpperCase();
      } else {
        delete updatedQuery["tab"];
      }
    }
    router.replace(
      {
        pathname: router.pathname,
        query: updatedQuery,
      },
      undefined,
      { shallow: true }
    );
    setActiveTab(newTab);
  };

  const {
    data: { data: complaintsList = [], pagination: complaintPagination },
    loader: complaintListingLoader,
  } = useQuery(reducerName, GET_COMPLAINTS_LIST_API, {
    requiredKey: ["loader", "data"],
    default: {},
    initialLoaderState: true,
  });

  return {
    getComplaintsList,
    complaintsList,
    complaintPagination,
    complaintListingLoader,
    handleFilterChange,
    clearFilters,
    filters,
    handleTabChange,
    activeTab,
  };
};

const getPlatformBasedFieldValue = (e) =>
  typeof e === "object" ? e.target.value : e;
