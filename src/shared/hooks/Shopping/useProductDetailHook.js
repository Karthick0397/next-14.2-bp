import { useCallback, useEffect, useRef, useState } from 'react';
import { typeOf, useMutateReducer, useQuery } from 'react-boilerplate-redux-saga-hoc/utils';
import { useDashboardHOC } from 'shared/hoc';
import { useAntdMessage } from '../Common';
import useDebounce from '../useDebounce';
import { useProductCartHook } from './useProductCartHook';

const LIMIT = 10;

export const useProductDetailHook = ({
  currentPage = 1,
  product_id = null,
  onSuccess,
  onError,
}) => {
  const {
    reducerName,
    reducerConstants: { GET_PRODUCT_DETAIL_API, PRODUCT_WHISHLIST_API },
    actions: { PRODUCT_WHISHLIST_API_CALL, PRODUCT_WHISHLIST_API_CANCEL },
  } = useDashboardHOC();

  const [
    { loader: whishlistLoader },
    {
      data: { data: productDetail },
    },
  ] = useQuery(reducerName, [
    {
      key: PRODUCT_WHISHLIST_API,
      requiredKey: ['loader', 'data'],
    },
    {
      key: GET_PRODUCT_DETAIL_API,
    },
  ]);
  const { cart } = useProductCartHook({
    product_id,
    cart: productDetail?.cart_details?.quantity,
  });
  const mutateReducer = useMutateReducer();
  const { errorMessage, successMessage } = useAntdMessage();

  const addToWhishList = () => {
    PRODUCT_WHISHLIST_API_CALL({
      task: { clearData: true },
      request: {
        params: {
          id: product_id,
        },
        payload: {
          whitelisted: !productDetail.is_whitelisted,
        },
      },
      callback: {
        successCallback: ({ data = { data: { data: successData } } }) => {
          mutateReducer((state) => ({
            [GET_PRODUCT_DETAIL_API]: {
              ...state[GET_PRODUCT_DETAIL_API],
              data: {
                data: {
                  ...productDetail,
                  is_whitelisted: !productDetail.is_whitelisted,
                },
              },
            },
          }));
        },
        errorCallback: (err) => {
          let { message, status, errors } = err;
          let _errors = errors.errors;
          if (typeOf(message) === 'object' || status === 'ERROR') {
            if (typeOf(_errors) === 'object') {
              //   Object.keys(_errors).forEach((fieldName) => {
              //     const errorMessage = _errors[fieldName];
              //     // Set the error message for the field
              //   });
            } else {
              errorMessage('Something Went Wrong!!');
            }
            // Trigger onFinishFailed with the updated form
          } else errorMessage('Something Went Wrong!!');
        },
      },
    });
    return () => {
      PRODUCT_WHISHLIST_API_CANCEL();
    };
  };

  return {
    whishList: {
      loader: whishlistLoader,
      addToWhishList,
    },
    cart,
    productDetail: {
      data: productDetail,
    },
  };
};
