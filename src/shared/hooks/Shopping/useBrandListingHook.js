import { useEffect, useMemo, useState } from 'react';
import { useQuery } from 'react-boilerplate-redux-saga-hoc/utils';
import { useDashboardHOC } from 'shared/hoc';

const LIMIT = 10;

export const useBrandListHook = ({ currentPage = 1, filterType = 'filter' }) => {
  const [initialRender, setInitialRender] = useState(true);
  const [search, setSearch] = useState('');
  const {
    reducerName,
    reducerConstants: { GET_BRANDS_API },
    actions: { GET_BRANDS_API_CALL, GET_BRANDS_API_CANCEL },
  } = useDashboardHOC();

  const getBrands = () => {
    GET_BRANDS_API_CALL({
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
      GET_BRANDS_API_CANCEL();
    };
  };
  useEffect(() => {
    if (!initialRender) {
      getBrands();
    }
    setInitialRender(false);
  }, [search]);
  const {
    data: { [filterType]: { data: { data: brandsList } = {}, loader: brandLoader } = {} } = {},
  } = useQuery(reducerName, {
    key: GET_BRANDS_API,
    default: {},
    initialLoaderState: false,
  });

  return {
    brands: {
      getData: getBrands,
      loader: brandLoader,
      data: brandsList,
      setSearch,
      search,
    },
  };
};
