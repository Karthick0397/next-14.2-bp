import { useState } from "react";
import { useAntdMessage } from ".";
import { UPLOAD_MEDIA } from "shared/hoc/Dashboard/apiEndPoints";
import { axios } from "shared/hoc";

export const useFileUploadHook = () => {
  const [loading, setLoading] = useState(false);
  const [fileData, setFileData] = useState(null);
  const { errorMessage, successMessage } = useAntdMessage();

  const uploadFile = (file, name) => {
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    return new Promise((resolve, reject) => {
      axios
        .post(UPLOAD_MEDIA, formData, {
          headers: {
            "Content-Type": "multipart/form-data", // Use 'multipart/form-data' for file uploads
          },
        })
        .then((res) => {
          handleUpload(res.data);
          // setLoading(false);
          // setFileData({
          //   image_id: res.data.id,
          //   image_url: res.data.document,
          //   content_type: res.data.content_type,
          // });
          resolve(res.data); // Resolve with the response data
        })
        .catch(function (error) {
          console.log(error);
          // setLoading(false);
          reject(error); // Reject with the error for the calling component to handle
        });
    });
  };

  const handleUpload = (data) => {
    // Add your upload success logic here if needed
    // alert.success('Uploaded Successfully')
    successMessage("File uploaded successfully");
  };

  return { uploadFile, loading, fileData };
};
