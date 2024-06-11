import { useDashboardHOC, useQuery } from "shared/hoc";
import { Form } from "antd";
import { useState } from "react";
import useAntdMessage from "../Common/ToastMessage";
import { typeOf } from "react-boilerplate-redux-saga-hoc/utils";

const LIMIT = 50;

export const useComplaintHook = ({
  id = null,
  onSuccess = () => {},
  onError = () => {},
} = {}) => {
  const { errorMessage } = useAntdMessage();
  const [form] = Form.useForm();
  const [complaintForm, setComplaintForm] = useState();
  const [attachments, setAttachments] = useState([]);
  const [showPrivateInfo, setShowPrivateInfo] = useState(true);
  const {
    reducerName,
    reducerConstants: {
      GET_COMPLAINT_REPLIES_DETAIL_API,
      POST_COMPLAINT_API,
      POST_COMPLAINT_REPLY_API,
    },
    actions: {
      GET_COMPLAINT_REPLIES_DETAIL_API_CALL,
      POST_COMPLAINT_API_CALL,
      GET_COMPLAINT_REPLIES_DETAIL_API_CANCEL,
      POST_COMPLAINT_API_CANCEL,
      POST_COMPLAINT_REPLY_API_CALL,
      POST_COMPLAINT_REPLY_API_CANCEL,
    },
  } = useDashboardHOC();

  const handleFormChange = (e) => {
    setComplaintForm(getPlatformBasedFieldValue(e));
  };

  const getCompliantReplies = () => {
    let query = {
      paginate: 1,
      items: LIMIT,
      page: 1,
      ...(id && { complaint_id: id }),
    };
    GET_COMPLAINT_REPLIES_DETAIL_API_CALL({
      request: {
        query,
      },
    });
    return () => {
      GET_COMPLAINT_REPLIES_DETAIL_API_CANCEL();
    };
  };
  const createComplaint = () => {
    let _form = form.getFieldsValue();
    let payload = {
      ..._form,
      ...((_form.complaint_type_id === 1 || _form.complaint_type_id === 2) && {
        disputed_amount_currency: "INR",
      }),
    };

    if (_form?.is_already_raised) {
      payload.attachments = attachments.map((_i) => _i.url);
    }
    POST_COMPLAINT_API_CALL({
      request: {
        payload,
      },
      callback: {
        successCallback: () => {
          onSuccess();
          form.resetFields();
          setShowPrivateInfo(true);
        },
        errorCallback: (err) => {
          let { message, status, errors } = err;
          let _errors = errors.errors;
          if (typeOf(message) === "object" || status === "ERROR") {
            if (typeOf(_errors) === "object") {
              Object.keys(_errors).forEach((fieldName) => {
                const errorMessage = _errors[fieldName];

                // Set the error message for the field
                form.setFields([
                  {
                    name: fieldName,
                    errors: [errorMessage],
                  },
                ]);
              });
              errorMessage("Something went wrong");
            } else {
              errorMessage(
                (message.non_field_errors && message.non_field_errors[0]) ||
                  "Something went wrong"
              );
            }
            // Trigger onFinishFailed with the updated form
            // setOTPError(message.non_field_errors[0] || 'OTP is incorrect');
          } else errorMessage("Something went wrong");
        },
      },
    });
    return () => {
      POST_COMPLAINT_API_CANCEL();
    };
  };
  const postComplaintReply = () => {
    let _form = form.getFieldsValue();
    let payload = {
      ..._form,
      complaint_id: id,
      is_description_public_visible: true,
    };

    if (payload?.attachments?.length) {
      payload.attachments = attachments.map((_i) => _i.url);
    }
    POST_COMPLAINT_REPLY_API_CALL({
      request: {
        payload,
      },
      callback: {
        successCallback: () => {
          onSuccess();
          form.resetFields();
        },
        errorCallback: (err) => {
          let { message, status, errors } = err;
          let _errors = errors.errors;
          if (typeOf(message) === "object" || status === "ERROR") {
            if (typeOf(_errors) === "object") {
              Object.keys(_errors).forEach((fieldName) => {
                const errorMessage = _errors[fieldName];

                // Set the error message for the field
                form.setFields([
                  {
                    name: fieldName,
                    errors: [errorMessage],
                  },
                ]);
              });
              errorMessage("Something went wrong");
            } else {
              errorMessage(
                (message.non_field_errors && message.non_field_errors[0]) ||
                  "Something went wrong"
              );
            }
            // Trigger onFinishFailed with the updated form
            // setOTPError(message.non_field_errors[0] || 'OTP is incorrect');
          } else errorMessage("Something went wrong");
        },
      },
    });
    return () => {
      POST_COMPLAINT_REPLY_API_CANCEL();
    };
  };
  const uploadImage = (urls) => {
    // Assuming you want to add the new URL to the existing array
    setAttachments(urls);
  };

  const {
    data: { data: complaintReplies = [] },
    loader: repliesLoader,
  } = useQuery(
    // const { data, loader: typeListLoader } = useQuery(
    reducerName,
    GET_COMPLAINT_REPLIES_DETAIL_API,
    {
      requiredKey: ["loader", "data"],
      default: {},
      initialLoaderState: true,
    }
  );
  const { loader: createComplaintLoader } = useQuery(reducerName, {
    key: POST_COMPLAINT_API,
    default: {},
    requiredKey: ["loader"],
  });
  const { loader: createReplyLoader } = useQuery(reducerName, {
    key: POST_COMPLAINT_REPLY_API,
    default: {},
    requiredKey: ["loader"],
  });
  // let { data: complaintTypes = [], loader: typeListLoader } = data;
  return {
    getCompliantReplies,
    complaintReplies,
    repliesLoader,
    createComplaintLoader,
    createComplaint,
    complaintForm,
    handleFormChange,
    form,
    handleSubmit: createComplaint,
    uploadImage,
    attachments,
    postComplaintReply,
    createReplyLoader,
    showPrivateInfo,
    setShowPrivateInfo,
  };
};
const getPlatformBasedFieldValue = (e) =>
  typeof e === "object" ? e.target.value : e;
