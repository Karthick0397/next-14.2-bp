import { Form } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { typeOf, useMutateReducer, useQuery } from 'react-boilerplate-redux-saga-hoc/utils';
import { useDashboardHOC } from 'shared/hoc';
import { useAntdMessage } from '../Common';

const LIMIT = 10;

export const useProductReviewsHook = ({
  currentPage = 1,
  product_id = null,
  onSuccess,
  onError,
}) => {
  const {
    reducerName,
    reducerConstants: { GET_PRODUCT_REVIEWS_API, POST_PRODUCT_REVIEWS_API },
    actions: {
      GET_PRODUCT_REVIEWS_API_CALL,
      POST_PRODUCT_REVIEWS_API_CALL,
      GET_PRODUCT_REVIEWS_API_CANCEL,
      POST_PRODUCT_REVIEWS_API_CANCEL,
    },
  } = useDashboardHOC();
  const [form] = Form.useForm();
  const [attachments, setAttachments] = useState([]);
  const { errorMessage, successMessage } = useAntdMessage();

  const getProductReviews = () => {
    GET_PRODUCT_REVIEWS_API_CALL({
      request: {
        query: {
          paginate: 1,
          items: LIMIT,
          page: currentPage,
        },
      },
    });
    return () => {
      GET_PRODUCT_REVIEWS_API_CANCEL();
    };
  };

  const uploadImage = (urls) => {
    // Assuming you want to add the new URL to the existing array
    setAttachments(urls);
  };
  const handleSubmit = (values) => {
    let payload = {};
    payload = {
      ...values,
      ...(attachments?.length && { attachments: attachments.map((_i) => _i.url) }),
    };
    POST_PRODUCT_REVIEWS_API_CALL({
      task: { clearData: true },
      request: {
        params: {
          id: product_id,
        },
        payload,
      },
      callback: {
        successCallback: ({ data = {} }) => {
          onSuccess();
          successMessage('Review posted successfully');
        },
        errorCallback: (err) => {
          let { message, status, errors } = err;
          let _errors = errors.errors;
          if (typeOf(message) === 'object' || status === 'ERROR') {
            if (typeOf(_errors) === 'object') {
              Object.keys(_errors).forEach((fieldName) => {
                const errorMessage = _errors[fieldName];
                // Set the error message for the field
                form.setFields([
                  {
                    name: fieldName === 'slug_name' ? 'title' : fieldName,
                    errors: [errorMessage],
                  },
                ]);
              });
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
      POST_PRODUCT_REVIEWS_API_CANCEL();
    };
  };
  const [
    { loader: createReviewLoader },
    { data: { data: reviewsList, loader: reviewsLoader } = {} },
  ] = useQuery(reducerName, [
    {
      key: POST_PRODUCT_REVIEWS_API,
      requiredKey: ['loader', 'data'],
    },

    {
      key: GET_PRODUCT_REVIEWS_API,
      default: {},
      initialLoaderState: false,
    },
  ]);
  const handleClear = () => {
    setAttachments([]);
    form.resetFields();
  };
  return {
    productReviews: {
      getData: getProductReviews,
      loader: reviewsLoader,
      data: reviewsList,
    },
    createReview: {
      handleSubmit: handleSubmit,
      createReviewForm: form,
      loader: createReviewLoader,
      attachments,
      uploadImage,
      handleClear,
    },
  };
};

const getPlatformBasedFieldValue = (e) => (typeof e === 'object' ? e.target.value : e);
