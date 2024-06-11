import { useCallback, useEffect, useRef, useState } from "react";
import useAntdMessage from "../Common/ToastMessage";
import { useDashboardHOC, useMutateReducer, useQuery } from "shared/hoc";
import { Form } from "antd";
import { typeOf } from "react-boilerplate-redux-saga-hoc/utils";

const LIMIT = 10;

export const useCreatePostHook = ({
  onSuccess = () => {},
  onError = () => {},
}) => {
  const {
    reducerName,
    reducerConstants: { CREATE_FORUM_POST_API, TAGS_LIST_API },
    actions: { CREATE_FORUM_POST_API_CALL, CREATE_FORUM_POST_API_CANCEL },
  } = useDashboardHOC();
  const { errorMessage, successMessage } = useAntdMessage();
  const [attachments, setAttachments] = useState([]);

  const [{ loader: submitPostLoader }, { data: tagsList }] = useQuery(
    reducerName,
    [
      {
        key: CREATE_FORUM_POST_API,
        requiredKey: ["loader", "data"],
      },

      {
        key: TAGS_LIST_API,
        requiredKey: ["loader", "data"],
        default: {},
      },
    ]
  );
  const [form] = Form.useForm();
  const uploadImage = (urls) => {
    // Assuming you want to add the new URL to the existing array
    setAttachments(urls);
  };
  const handleSubmit = (values) => {
    let payload = {};
    let _tags = [];
    if (values.tags?.length) {
      _tags = values.tags?.map((_t) => {
        // if (typeOf(_t.value) === "string") {
        return {
          tag_name: _t.label,
        };
        // } else {
        //   let _temp = tagsList?.find((_dt) => _dt.id === _t.value);
        //   return {
        //     tag_name: _temp.tag_name,
        //   };
        // }
      });
    }
    payload = {
      ...values,
      forum_category_id:
        typeOf(values.forum_category_id?.value) === "number"
          ? values.forum_category_id?.value
          : null,
      category_name: values.forum_category_id?.label,
      forum_tags: _tags,
      ...(attachments?.length && { images: attachments.map((_i) => _i.url) }),
      ...(values?.video_url?.length && { video_url: values.video_url }),
    };
    if (payload.description === "") {
      delete payload.description;
    }
    delete payload.tags;
    delete payload.attachments;
    CREATE_FORUM_POST_API_CALL({
      task: { clearData: true },
      request: {
        payload,
      },
      callback: {
        successCallback: ({ data = {} }) => {
          onSuccess();
          successMessage("Successfully Posted");
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
                    name: fieldName === "slug_name" ? "title" : fieldName,
                    errors: [errorMessage],
                  },
                ]);
              });
            } else {
              errorMessage("Something Went Wrong!!");
            }
            // Trigger onFinishFailed with the updated form
            // setOTPError(message.non_field_errors[0] || 'OTP is incorrect');
          } else errorMessage("Something Went Wrong!!");
        },
      },
    });
    return () => {
      CREATE_FORUM_POST_API_CANCEL();
    };
  };
  const handleClear = () => {
    setAttachments([]);
    form.resetFields();
  };
  return {
    form,
    handleSubmit,
    uploadImage,
    attachments,
    handleClear,
  };
};

const getPlatformBasedFieldValue = (e) =>
  typeof e === "object" ? e.target.value : e;
