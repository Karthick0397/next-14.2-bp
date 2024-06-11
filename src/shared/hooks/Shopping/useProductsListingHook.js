import { useEffect, useMemo, useRef, useState } from 'react';
import { getData, typeOf } from 'react-boilerplate-redux-saga-hoc/utils';
import { useDashboardHOC, useMutateReducer, useQuery } from 'shared/hoc';
import { useAntdMessage } from '../Common';
import { useRouter } from 'next/router';
// import { useRouter } from "next/navigation";
// import { useRouter as useRouting } from "next/router";

const LIMIT = 10;

export const useProductsListingHook = ({ currentPage = 1, isDetail = false } = {}) => {
  const router = useRouter();
  const [initialRender, setInitialRender] = useState(true);
  const [filters, setFilters] = useState({
    rating: [],
    price_range: [],
    level: [],
    __in_list__brands: [],
  });

  const { errorMessage } = useAntdMessage();
  const {
    reducerName,
    reducerConstants: { GET_ALL_PRODUCTS_API },
    actions: { GET_ALL_PRODUCTS_API_CALL, GET_ALL_PRODUCTS_API_CANCEL },
  } = useDashboardHOC();

  const getProducts = () => {
    GET_ALL_PRODUCTS_API_CALL({
      request: {
        query: {
          paginate: 1,
          items: LIMIT,
          page: currentPage,
          sort_by: 'created_at',
          desc: 1,
          ...(filters?.__greater_than__rating?.length && {
            __greater_than__rating: filters.__greater_than__rating,
          }),
          ...(filters?.__in_list__brands?.length && {
            __in_list__brands: filters.__in_list__brands,
          }),
          ...(filters?.__in_list__categories?.length && {
            __in_list__categories: filters.__in_list__categories,
          }),
          ...(filters?.price_range?.length && {
            __greater_than__selling_price: filters.price_range[0],
            __lesser_than__selling_price: filters.price_range[1],
          }),
        },
      },
      callback: {
        successCallback({ message, data: { data: successData } }) {
          // let successData = [];
          if (currentPage === 1) {
            let task = {
              response: {
                data: {
                  data: successData.data,
                  pagination: successData.pagination,
                },
              },
            };
            return {
              task,
            };
          } else {
            let task = {
              name: 'Infinite-Handler',
              response: {
                data: {
                  data: [...products, ...successData.data],
                  pagination: successData.pagination,
                },
              },
            };
            return {
              task,
            };
          }
        },
        errorCallback: ({ message, status }) => {
          if (typeOf(message) === 'object' && status === 'ERROR') {
            errorMessage(
              (message.non_field_errors && message.non_field_errors[0]) || 'Something Went Wrong'
            );
            // setOTPError(message.non_field_errors[0] || 'OTP is incorrect');
          } else errorMessage('Something Went Wrong');
        },
      },
    });
    return () => {
      GET_ALL_PRODUCTS_API_CANCEL();
    };
  };
  const handleFilterChange = (filterType, values) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterType]: values,
    }));
    const updatedQuery = { ...router.query };
    if (!values?.length) {
      delete updatedQuery[filterType];
    } else {
      updatedQuery[filterType] = values.join(',');
    }
    updatingRoutes(updatedQuery);
  };

  useEffect(() => {
    if (!router?.isReady) return;

    const query = router?.query;
    if (
      query.rating ||
      query.price_range ||
      query.level ||
      query.__in_list__brands ||
      query.__in_list__categories ||
      query.__greater_than__rating
    ) {
      const priceRange = query.price_range ? query.price_range.split(',') : [];
      const level = query.level ? query.level.split(',') : [];
      const brands = (query.__in_list__brands || '')
        .split(',')
        .map((id) => parseInt(id.trim()))
        .filter((id) => !isNaN(id));
      const categories = (query.__in_list__categories || '')
        .split(',')
        .map((id) => parseInt(id.trim()))
        .filter((id) => !isNaN(id));
      const ratings = (query.__greater_than__rating || '')
        .split(',')
        .map((id) => parseInt(id.trim()))
        .filter((id) => !isNaN(id));

      setFilters({
        price_range: priceRange,
        level,
        __in_list__brands: brands,
        __in_list__categories: categories,
        __greater_than__rating: ratings,
      });
    }
  }, []);

  const updatingRoutes = (updatedQuery) => {
    router.push({ pathname: router.pathname, query: updatedQuery }, undefined, {
      shallow: true,
    });
  };

  useEffect(() => {
    if (!initialRender) {
      getProducts();
    }
    setInitialRender(false);
  }, [filters]);

  const clearFilters = () => {
    setFilters({
      rating: [],
      price_range: [],
      level: [],
      __in_list__brands: [],
    });
    const updatedQuery = { ...router.query };
    for (const key in updatedQuery) {
      if (
        key.startsWith('rating') ||
        key.startsWith('price_range') ||
        key.startsWith('level') ||
        key === '__in_list__brands' ||
        key === '__in_list__categories' ||
        key === '__greater_than__rating'
      ) {
        delete updatedQuery[key];
      }
    }
    updatingRoutes(updatedQuery);
  };
  const {
    data: { data: products, pagination },
    loader: listingLoader,
  } = useQuery(reducerName, {
    key: GET_ALL_PRODUCTS_API,
    default: {},
    initialLoaderState: true,
  });
  return {
    products: {
      getData: getProducts,
      data: products,
      loader: listingLoader,
      pagination,
      handleFilterChange,
      filters,
      clearFilters,
    },
  };
};
