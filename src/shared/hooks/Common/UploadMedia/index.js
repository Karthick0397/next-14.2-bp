/* eslint-disable no-nested-ternary */
/* eslint-disable no-lonely-if */
import { useCallback } from 'react';
import ImagePicker from 'react-native-image-crop-picker';
import DocumentPicker from 'react-native-document-picker';

import RNFetchBlob from 'rn-fetch-blob';
import { useS3UploadHook } from './useUploadS3Hook';
const MAX_IMAGE_SIZE = 50;
export const useUploadMediaHook = ({
  onUploadFileSuccess: _onUploadFileSuccess,
  onUploadFileError: _onUploadFileError,
  size: Size = MAX_IMAGE_SIZE,
  multiple,
}) => {
  const size = Size * 1000000;
  const {
    s3Url,
    s3UrlLoader,
    uploadFile,
    uploadFileLoader,
    generateS3URL,
    uploadLoader,
  } = useS3UploadHook({
    onGenerateUploadUrlSuccess: onUploadFileSuccess,
    onGenerateUploadUrlError: onUploadFileError,
    onUploadFileSuccess,
    onUploadFileError,
  });
  function onUploadFileSuccess(successData) {
    if (successData) {
      // console.log(fileInfo);
      _onUploadFileSuccess(successData);
    } else {
      _onUploadFileError('Something went wrong. Try again');
    }
  }

  function onUploadFileError({ message = null } = {}) {
    _onUploadFileError(message || 'Something went wrong');
  }

  const handleUploadFile = useCallback(
    ({
      mediaType = 'image',
      uploadType = 'gallery',
      options: _options = {},
    } = {}) => {
      console.log(mediaType, uploadType, multiple, options);
      const options = {
        title: 'Crop Image',
        mediaType, // 'photo', 'video', or 'any'
        multiple,
        includeBase64: true,
        cropping: mediaType !== 'video',
        compressImageQuality: 0.8,
        freeStyleCropEnabled: true,
        smartAlbums: [
          'UserLibrary',
          'PhotoStream',
          'Panoramas',
          'Videos',
          'Bursts',
          'Screenshots',
        ],
        ..._options,
      };
      (uploadType === 'docs'
        ? DocumentPicker.pick
        : uploadType === 'gallery'
        ? ImagePicker.openPicker
        : ImagePicker.openCamera)(
        uploadType === 'docs'
          ? {
              allowMultiSelection: true,
              type: ['application/msword', 'application/pdf'],
              ..._options,
            }
          : options,
      )
        .then((fileInfo) => {
          console.log(fileInfo, 'fileInfo', mediaType, multiple);
          if (fileInfo.size <= size || multiple) {
            if (mediaType === 'video') {
              generateS3URL(fileInfo, multiple, 'video');
              // RNFetchBlob.fs
              //   .readFile(fileInfo.path, 'base64')
              //   .then((data) => {
              //     onUploadImage({ ...fileInfo, data });
              //   })
              //   .catch((err) => {
              //     console.log(err);
              //   });
            } else {
              if (uploadType !== 'docs') {
                generateS3URL(fileInfo, multiple, mediaType);
              } else
                RNFetchBlob.fs
                  .readFile(fileInfo[0].uri, 'base64')
                  .then((data) => {
                    console.log(data);
                    generateS3URL(
                      // fileInfo,
                      [{ ...fileInfo[0], data }],
                      multiple,
                      mediaType,
                    );
                    // onUploadImage({ ...fileInfo, data });
                  })
                  .catch((err) => {
                    console.log(err);
                  });
            }
            //   setMediaTypeModal(false);
          } else {
            //   setMediaTypeModal(false);
            if (!multiple) {
              onUploadFileError({
                message: `File size should be less than ${+Size} MB`,
              });
            }
          }
        })
        .catch((err) => {
          if (err && err.message && err.message.includes('permission'))
            onUploadFileError({
              message: `${err.message}.Go to settings -> app -> allow permission`,
            });
          else onUploadFileError({ message: 'User Cancelled' });
        });
    },
    [],
  );
  return {
    handleUploadFile,
    uploadLoader,
    s3Url,
    s3UrlLoader,
    uploadFile,
    uploadFileLoader,
  };
};
