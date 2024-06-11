import { useState } from "react";
import { message } from "antd";
import { UPLOAD_MEDIA } from "shared/hoc/Common/apiEndPoints";
import { axios } from "shared/hoc";
export const useFileUploadHook = () => {
  // State variables to handle loading state and file data
  const [loading, setLoading] = useState(false);
  const [fileData, setFileData] = useState(null);

  // Function to upload a file
  const uploadFile = (file, showToast = true) => {
    setLoading(true); // Set loading state to true during file upload

    const formData = new FormData();
    formData.append("file", file); // Append the file to the form data

    return new Promise((resolve, reject) => {
      axios
        .post(UPLOAD_MEDIA, formData, {
          headers: {
            "Content-Type": "multipart/form-data", // Specify content type for file uploads
          },
        })
        .then((res) => {
          handleUpload(res.data, showToast); // Handle the uploaded file data
          resolve(res.data); // Resolve with the response data after successful upload
        })
        .catch(function (error) {
          message.error(
            error?.response?.data?.errors || "File uploaded failed"
          );
          reject(error); // Reject with the error for the calling component to handle
        })
        .finally(() => {
          setLoading(false);
        });
    });
  };

  // Function to handle file upload success
  const handleUpload = (data, showToast) => {
    // Add your logic here for handling successful file upload if needed
    // For example, display a success message using Ant Design message component

    if (showToast) {
      message.destroy();
      message.success("File uploaded successfully");
    }
  };

  // Return the file upload function, loading state, and file data
  return { uploadFile, loading, fileData, message };
};
