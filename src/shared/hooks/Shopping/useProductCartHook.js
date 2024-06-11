import { useCallback, useEffect, useRef, useState } from 'react';
import { typeOf, useMutateReducer, useQuery } from 'react-boilerplate-redux-saga-hoc/utils';
import { useDashboardHOC } from 'shared/hoc';
import { useAntdMessage } from '../Common';
import useDebounce from '../useDebounce';

const LIMIT = 10;

export const useProductCartHook = ({ product_id = null, cart = 1, isListing = false }) => {
  const {
    reducerName,
    reducerConstants: {
      PRODUCT_ADD_TO_CART_API,
      GET_ALL_PRODUCTS_API,
      PRODUCT_REMOVE_FROM_CART_API,
      GET_PRODUCT_DETAIL_API,
    },
    actions: {
      PRODUCT_ADD_TO_CART_API_CALL,
      PRODUCT_ADD_TO_CART_API_CANCEL,
      PRODUCT_REMOVE_FROM_CART_API_CALL,
      PRODUCT_REMOVE_FROM_CART_API_CANCEL,
    },
  } = useDashboardHOC();
  const [
    { loader: addToCartLoader },
    { loader: removeCartLoader },
    {
      data: { data: productsList },
    },
    {
      data: { data: productDetail },
    },
  ] = useQuery(reducerName, [
    {
      key: PRODUCT_ADD_TO_CART_API,
    },
    {
      key: PRODUCT_REMOVE_FROM_CART_API,
    },
    {
      key: GET_ALL_PRODUCTS_API,
      default: {},
    },
    {
      key: GET_PRODUCT_DETAIL_API,
      default: {},
    },
  ]);

  const isFirstRender = useRef(true);
  const mutateReducer = useMutateReducer();
  const [cartCount, setCartCount] = useState(cart);
  const { errorMessage, successMessage } = useAntdMessage();

  const handleCartCount = useCallback(
    (val) => {
      if (val) {
        setCartCount((prevVal) => {
          return val;
        });
      }
    },
    [setCartCount]
  );

  const handleAddToCart = () => {
    PRODUCT_ADD_TO_CART_API_CALL({
      task: { clearData: true },
      request: {
        payload: {
          product_id: Number(product_id),
          quantity: cartCount,
        },
      },
      callback: {
        successCallback({ data: { data: { data: successData } = {} } }) {
          successMessage('Added to cart successfully');
          setCartCount(successData.quantity);
          if (isListing) {
            mutateReducer((state) => ({
              [GET_ALL_PRODUCTS_API]: {
                ...state[GET_ALL_PRODUCTS_API],
                data: {
                  data: productsList.map((item) =>
                    item.id === product_id
                      ? {
                          ...item,
                          cart_details: {
                            id: successData.cart_id,
                            quantity: successData.quantity,
                          },
                        }
                      : item
                  ),
                },
              },
            }));
          } else {
            setCartCount(null);
            mutateReducer((state) => ({
              [GET_PRODUCT_DETAIL_API]: {
                ...state[GET_PRODUCT_DETAIL_API],
                data: {
                  data: {
                    ...productDetail,
                    cart_details: {
                      id: successData.cart_id,
                      quantity: successData.quantity,
                    },
                  },
                },
              },
            }));
          }
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
            // setOTPError(message.non_field_errors[0] || 'OTP is incorrect');
          } else errorMessage('Something Went Wrong!!');
        },
      },
    });
    return () => {
      PRODUCT_ADD_TO_CART_API_CANCEL();
    };
  };
  const handleRemoveFromCart = () => {
    PRODUCT_REMOVE_FROM_CART_API_CALL({
      task: { clearData: true },
      request: {
        params: {
          id: product_id,
        },
      },
      callback: {
        successCallback({ data }) {
          if (isListing) {
            mutateReducer((state) => ({
              [GET_ALL_PRODUCTS_API]: {
                ...state[GET_ALL_PRODUCTS_API],
                data: {
                  data: productsList.map((item) =>
                    item.id === product_id
                      ? {
                          ...item,
                          cart_details: {
                            id: null,
                            quantity: 1,
                          },
                        }
                      : item
                  ),
                },
              },
            }));
          } else {
            mutateReducer((state) => ({
              [GET_PRODUCT_DETAIL_API]: {
                ...state[GET_PRODUCT_DETAIL_API],
                data: {
                  data: {
                    ...productDetail,
                    cart_details: {
                      id: null,
                      quantity: 1,
                    },
                  },
                },
              },
            }));
          }
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
            // setOTPError(message.non_field_errors[0] || 'OTP is incorrect');
          } else errorMessage('Something Went Wrong!!');
        },
      },
    });
    return () => {
      PRODUCT_REMOVE_FROM_CART_API_CANCEL();
    };
  };
  const handleMinusClick = () => {
    if (cartCount > 1) {
      setCartCount((prevCount) => prevCount - 1);
    }
  };

  const handleAddClick = () => {
    setCartCount((prevCount) => prevCount + 1);
  };

  const debouncedHandleAddToCart = useDebounce(handleAddToCart, 1000); //  debounced function

  useEffect(() => {
    if (!isFirstRender.current) {
      debouncedHandleAddToCart();
    } else {
      isFirstRender.current = false;
    }
  }, [cartCount]);
  return {
    cart: {
      count: cartCount,
      handleCartCount,
      handleAddToCart,
      addToCartLoader,
      handleRemoveFromCart,
      removeCartLoader,
      handleMinusClick,
      handleAddClick,
    },
  };
};
