/* eslint-disable no-loop-func */
/* eslint-disable no-plusplus */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-nested-ternary */
import { useEffect, useState } from "react";
import axios from "axios";
// import notification from 'components/common/Notification';
// import {
//   NotificationMessage,
//   asyncGetBase64,
// } from 'Shared/utils/utilFunctions';
import { useAuthenticationHOC, useQuery } from "shared/hoc";
import { ON_UNMOUNT } from "react-boilerplate-redux-saga-hoc/constants";
const request = axios.create({});
request.defaults.withCredentials = false;
// eslint-disable-next-line prefer-destructuring
const Buffer = require("buffer").Buffer;
export const useS3UploadHook = ({
  //   onGenerateUploadUrlSuccess = () => {},
  onGenerateUploadUrlError = () => {},
  onUploadFileSuccess = () => {},
  onUploadFileError = () => {},
} = {}) => {
  const {
    reducerName,
    actions: {
      GENERATE_S3_UPLOAD_URL_CALL,
      GENERATE_S3_UPLOAD_URL_CANCEL,
      UPLOAD_FILE_TO_S3_API_CALL,
      UPLOAD_FILE_TO_S3_API_CANCEL,
    },
    reducerConstants: { GENERATE_S3_UPLOAD_URL, UPLOAD_FILE_TO_S3_API },
  } = useAuthenticationHOC();

  const [isLoading, setIsLoading] = useState(false);

  const [
    { data: s3Url = [], loader: s3UrlLoader },
    { data: uploadFile = {}, loader: uploadFileLoader },
  ] = useQuery(reducerName, [
    {
      key: GENERATE_S3_UPLOAD_URL,
      requiredKey: ["loader", "data"],
      initialLoaderState: false,
    },
    {
      key: UPLOAD_FILE_TO_S3_API,
      requiredKey: ["loader", "data"],
      initialLoaderState: false,
    },
  ]);

  useEffect(
    () => () => {
      setTimeout(() => {
        GENERATE_S3_UPLOAD_URL_CANCEL(ON_UNMOUNT);
        UPLOAD_FILE_TO_S3_API_CANCEL(ON_UNMOUNT);
      }, 100);
    },
    []
  );

  const generateS3URL = async (_file, multiple) => {
    const file = Array.isArray(_file) ? [..._file] : _file;
    GENERATE_S3_UPLOAD_URL_CANCEL();
    UPLOAD_FILE_TO_S3_API_CANCEL();
    // const _name = file.filename || file.path.split('/').slice(-1)[0];
    console.log(file);
    if (file) {
      setIsLoading(true);
      //   const formData = new FormData();
      //   formData.append('file', {
      //     ...file,
      //     uri: file.path,
      //     type: file.mime,
      //     name: _name,
      //   });
      if (multiple) {
        const URL = [];
        console.log(file, "file");
        for (let i = 0; i < file.length; i++) {
          file[i].mime = file[i].mime || file[i].type;
          const extension =
            file[i].mime && file[i].mime.split
              ? file[i].mime.split("/")[1]
              : file[i].mime;

          // Convert data to base64
          const base64 = file[i].data || file[i].uri;
          console.log(extension);
          GENERATE_S3_UPLOAD_URL_CALL({
            request: {
              payload: {
                extension: `.${extension}`,
              },
            },
            callback: {
              successCallback: ({ data: { data = {} } = {} } = {}) => {
                // onGenerateUploadUrlSuccess({ data });
                const uploadUrl = data.upload_url;
                const contentType = data.content_type;
                const filePath = data.file_path;
                const buffer = Buffer.from(base64, "base64");
                if (uploadUrl) {
                  UPLOAD_FILE_TO_S3_API_CALL({
                    request: {
                      params: {
                        url: uploadUrl,
                      },
                      payload: buffer,
                      axiosConfig: {
                        // headers: {
                        //   accept: 'application/json',
                        //   'content-type': 'multipart/form-data',
                        // },
                        headers: {
                          "Content-Type": contentType,
                        },
                      },
                      axios: request,
                    },
                    callback: {
                      successCallback: ({
                        data: { data: successData = {} } = {},
                      } = {}) => {
                        console.log(
                          `data:${file[i].mime};base64,${base64}`,
                          "successData"
                        );

                        setIsLoading(false);
                        URL.push({
                          file: file[i],
                          base64: `data:${file[i].mime};base64,${base64}`,
                          uploadUrl,
                          contentType,
                          filePath,
                          successData,
                        });
                        if (URL.length === file.length) {
                          setIsLoading(false);
                          onUploadFileSuccess({ url: URL });
                        }
                      },
                      errorCallback: ({ isNetworkError, message }) => {
                        setIsLoading(false);
                        URL.push({
                          message:
                            isNetworkError || message
                              ? typeof message === "string"
                                ? message
                                : JSON.stringify(message)
                              : "Internal server error",
                        });
                        if (URL.length === file.length) {
                          setIsLoading(false);
                          onUploadFileSuccess({ url: URL });
                        }
                      },
                    },
                  });
                }
              },
              errorCallback: ({ isNetworkError, message }) => {
                URL.push({
                  message:
                    isNetworkError || message
                      ? typeof message === "string"
                        ? message
                        : JSON.stringify(message)
                      : "Internal server error",
                });
                if (URL.length === file.length) {
                  setIsLoading(false);
                  onUploadFileSuccess({ url: URL });
                }
              },
            },
          });
        }
      } else {
        const extension =
          file.type && file.type.split ? file.type.split("/")[1] : file.type;
        const reader = new FileReader();
        const base64 = file.data;
        GENERATE_S3_UPLOAD_URL_CALL({
          request: {
            payload: {
              extension: `.${extension}`,
            },
          },
          callback: {
            successCallback: ({ data: { data = {} } = {} } = {}) => {
              // onGenerateUploadUrlSuccess({ data });
              const uploadUrl = data.upload_url;
              const contentType = data.content_type;
              const filePath = data.file_path;
              const buffer = Buffer.from(file.data, "base64");
              if (uploadUrl) {
                UPLOAD_FILE_TO_S3_API_CALL({
                  request: {
                    params: {
                      url: uploadUrl,
                    },
                    payload: buffer,
                    axiosConfig: {
                      // headers: {
                      //   accept: 'application/json',
                      //   'content-type': 'multipart/form-data',
                      // },
                      headers: { "Content-Type": contentType },
                    },
                    axios: request,
                  },
                  callback: {
                    successCallback: ({
                      data: { data: successData = {} } = {},
                    } = {}) => {
                      setIsLoading(false);

                      onUploadFileSuccess({
                        file,
                        base64: `data:${file.mime};base64,${base64}`,
                        uploadUrl,
                        contentType,
                        filePath,
                        successData,
                      });
                    },
                    errorCallback: ({ isNetworkError, message }) => {
                      setIsLoading(false);
                      onUploadFileError({
                        message:
                          isNetworkError || message
                            ? typeof message === "string"
                              ? message
                              : JSON.stringify(message)
                            : "Internal server error",
                      });
                    },
                  },
                });
              }
            },
            errorCallback: ({ isNetworkError, message }) => {
              setIsLoading(false);
              onGenerateUploadUrlError({
                message:
                  isNetworkError || message
                    ? typeof message === "string"
                      ? message
                      : JSON.stringify(message)
                    : "Internal server error",
              });
            },
          },
        });
      }
    }
  };

  return {
    s3Url,
    s3UrlLoader,
    uploadFile,
    uploadFileLoader,
    generateS3URL,
    uploadLoader: isLoading || s3UrlLoader || uploadFileLoader,
  };
};
