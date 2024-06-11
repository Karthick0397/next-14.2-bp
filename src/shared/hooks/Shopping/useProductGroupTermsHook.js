import { useEffect, useMemo, useRef, useState } from 'react';
import { typeOf } from 'react-boilerplate-redux-saga-hoc/utils';
import { useDashboardHOC, useQuery } from 'shared/hoc';
import { useAntdMessage } from '../Common';
import { useRouter } from 'next/router';

const LIMIT = 10;

export const useProductGroupTermsHook = ({ slug_name = '' } = {}) => {
  const router = useRouter();
  const { errorMessage } = useAntdMessage();
  const {
    reducerName,
    reducerConstants: { GET_ALL_PRODUCT_GROUPS_API, PRODUCT_BY_GROUP_SLUG_API },
    actions: {
      GET_ALL_PRODUCT_GROUPS_API_CALL,
      GET_ALL_PRODUCT_GROUPS_API_CANCEL,
      PRODUCT_BY_GROUP_SLUG_API_CALL,
      PRODUCT_BY_GROUP_SLUG_API_CANCEL,
    },
  } = useDashboardHOC();

  const getGroups = () => {
    GET_ALL_PRODUCT_GROUPS_API_CALL({
      request: {},
    });
    return () => {
      GET_ALL_PRODUCT_GROUPS_API_CANCEL();
    };
  };
  const getProducts = () => {
    PRODUCT_BY_GROUP_SLUG_API_CALL({
      request: {
        params: {
          id: slug_name,
        },
      },
      filter: [slug_name],
    });
    return () => {
      PRODUCT_BY_GROUP_SLUG_API_CANCEL();
    };
  };

  const {
    data: { data: groups },
    loader: groupsLoader,
  } = useQuery(reducerName, {
    key: GET_ALL_PRODUCT_GROUPS_API,
    default: {},
    initialLoaderState: true,
  });
  const {
    data: { [slug_name]: { data: { data: products } = {} } = {} } = {},
    loader: productsLoader,
  } = useQuery(reducerName, {
    key: PRODUCT_BY_GROUP_SLUG_API,
    default: {},
    initialLoaderState: true,
  });
  console.log(products);
  return {
    groups: {
      getData: getGroups,
      data: groups,
      loader: groupsLoader,
    },
    products_by_slug: {
      getData: getProducts,
      data: products,
      loader: productsLoader,
    },
  };
};
