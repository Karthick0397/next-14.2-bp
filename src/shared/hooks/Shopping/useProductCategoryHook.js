import { useEffect, useMemo, useState } from 'react';
import { useMutateReducer, useQuery } from 'react-boilerplate-redux-saga-hoc/utils';
import { useDashboardHOC } from 'shared/hoc';

const LIMIT = 10;

export const useProductCategoryHook = ({ currentPage = 1, filterType = 'filter' }) => {
  const [initialRender, setInitialRender] = useState(true);
  const [search, setSearch] = useState('');
  const {
    reducerName,
    reducerConstants: { GET_PRODUCT_CATEGORIES_API },
    actions: { GET_PRODUCT_CATEGORIES_API_CALL, GET_PRODUCT_CATEGORIES_API_CANCEL },
  } = useDashboardHOC();
  const mutateReducer = useMutateReducer();

  const getProductCategories = () => {
    GET_PRODUCT_CATEGORIES_API_CALL({
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
      GET_PRODUCT_CATEGORIES_API_CANCEL();
    };
  };
  useEffect(() => {
    if (!initialRender) {
      getProductCategories();
    }
    setInitialRender(false);
  }, [search]);
  const {
    data: {
      [filterType]: { data: { data: categoriesList } = {}, loader: categoriesLoader } = {},
    } = {},
  } = useQuery(reducerName, {
    key: GET_PRODUCT_CATEGORIES_API,
    default: {},
    initialLoaderState: false,
  });

  return {
    categories: {
      getData: getProductCategories,
      loader: categoriesLoader,
      data: categoriesList,
      setSearch,
      search,
    },
  };
};
