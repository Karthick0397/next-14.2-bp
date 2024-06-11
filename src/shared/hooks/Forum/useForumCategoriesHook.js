import { useEffect, useMemo, useState } from "react";
import {
  useMutateReducer,
  useQuery,
} from "react-boilerplate-redux-saga-hoc/utils";
import { useDashboardHOC } from "shared/hoc";

const LIMIT = 10;

export const useForumCategoriesHook = ({
  onSuccess = () => {},
  onError = () => {},
  currentPage = 1,
  isDetail = false,
  filterType = "filter",
}) => {
  const [initialRender, setInitialRender] = useState(true);
  const [search, setSearch] = useState("");
  const [tagSearch, setTagsSearch] = useState("");
  const {
    reducerName,
    reducerConstants: { GET_FORUM_CATEGORIES_API, TAGS_LIST_API },
    actions: {
      GET_FORUM_CATEGORIES_API_CALL,
      TAGS_LIST_API_CALL,
      GET_FORUM_CATEGORIES_API_CANCEL,
      TAGS_LIST_API_CANCEL,
    },
  } = useDashboardHOC();
  const mutateReducer = useMutateReducer();

  const getForumCategories = () => {
    GET_FORUM_CATEGORIES_API_CALL({
      request: {
        query: {
          paginate: 1,
          items: LIMIT,
          page: currentPage,
          ...(search && { search }),
        },
      },
      filter: [filterType],
    });
    return () => {
      GET_FORUM_CATEGORIES_API_CANCEL();
    };
  };
  const getForumTags = () => {
    TAGS_LIST_API_CALL({
      request: {
        query: {
          paginate: 1,
          items: LIMIT,
          page: currentPage,
          ...(search && { search: tagSearch }),
        },
      },
    });
    return () => {
      TAGS_LIST_API_CANCEL();
    };
  };

  useEffect(() => {
    if (!initialRender) {
      if (search?.length) {
        getForumCategories();
      } else {
        getForumCategories();
      }
    }
    setInitialRender(false);
  }, [search]);
  const {
    data: {
      [filterType]: { data: forumCategories, loader: categoriesLoader } = {},
    } = {},
  } = useQuery(reducerName, {
    key: GET_FORUM_CATEGORIES_API,
    default: {},
    initialLoaderState: false,
  });
  const { data: tagsList, loader: tagsLoader } = useQuery(reducerName, {
    key: TAGS_LIST_API,
    default: [],
    initialLoaderState: false,
  });

  return {
    categories: {
      getData: getForumCategories,
      loader: categoriesLoader,
      data: forumCategories,
      setSearch,
      search,
    },
    tags: {
      getData: getForumTags,
      data: tagsList,
      loader: tagsLoader,
      setTagsSearch,
      tagSearch,
    },
  };
};

const getPlatformBasedFieldValue = (e) =>
  typeof e === "object" ? e.target.value : e;
