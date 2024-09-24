//@ts-nocheck
import { instance as axiosInstance } from "../helpers/axios/axiosInstance";
import { getBaseUrl } from "../helpers/config/envConfig";
const url = `${getBaseUrl}/aws/create-aws-upload-files-token`;

const singleFileUploaderInS3 = async (fileData, uploadFile) => {
  console.log("🚀 ~ singleFileUploaderInS3 ~ uploadFile:", uploadFile.type);
  try {
    const response = await axiosInstance({
      url: fileData.pre_url,
      method: "PUT",
      data: uploadFile,
      withCredentials: true,
      headers: {
        "Content-Type": uploadFile.type, // Ensure the correct content type is set
        "x-amz-acl": "public-read", // Optional, depending on your access needs
      },
    });
    // console.log("🚀 ~ singleFileUploaderInS3 ~ response:", response);
    return fileData;
  } catch (error) {
    throw new Error(error?.message || "Error");
  }
};

export const multipleFilesUploader = async (files) => {
  try {
    const filesModifyServerFormate = files.map((file) => {
      return {
        filename: file.name,
        mimetype: file.type,
        uid: file.uid, //!when use ant-d uploader then file.originFileObj in have --> default (uid) . when use custom uploader then add uid custom
      };
    });
    const promises = [];
    const getFilesToken = await axiosInstance({
      url: url,
      method: "POST",
      data: { images: filesModifyServerFormate },
      withCredentials: true,
    });
    const serverResponseObjects = getFilesToken?.data?.images || [];

    files.forEach((file) => {
      const serverObject = serverResponseObjects?.find(
        (image) => image?.uid === file?.uid //!when use ant-d uploader then file.originFileObj in have --> default uid . when use custom uploader then add uid custom
      );
      const fileUpload = singleFileUploaderInS3(serverObject, file);
      promises.push(fileUpload);
    });
    const result = await Promise.all(promises);
    return result;
  } catch (error) {
    console.log("🚀 ~ multipleFilesUploader ~ error:", error);
    throw new Error(error?.message || "Error");
  }
};
