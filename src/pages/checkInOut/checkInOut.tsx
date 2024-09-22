import { Button, Input } from "antd";

import React, { useRef, useState } from "react";
//@ts-ignore
import { useScreenshot } from "use-react-screenshot";
import { instance as axiosInstance } from "../../helpers/axios/axiosInstance";
import { getBaseUrl } from "../../helpers/config/envConfig";
import WebcamCapture from "../../components/CheckInOut/WebCamra";
import CustomImageTag from "../../components/ui/CustomTag/CustomImage";
import ClockComponents from "../../components/CheckInOut/clock";
import LocalIPComponent from "../../components/CheckInOut/IpGet";
import { useAppSelector } from "../../redux/hooks";
import { selectCurrentUser } from "../../redux/features/auth/authSlice";

export default function CheckInOut() {
  const user = useAppSelector(selectCurrentUser);
  const ref = useRef(null);
  const [image, setImage] = useState(null);
  const [screenshot, takeScreenshot] = useScreenshot();

  const getImage = async () => {
    try {
      // Capture the screenshot
      const img = await takeScreenshot(ref.current);
      // Extract file type from base64 data
      const fileType = img.split(";")[0].split(":")[1]; // e.g., "image/png"
      const base64Data = img.split(",")[1]; // Base64-encoded image data

      // Convert base64 image to a Blob
      const blob = new Blob([Buffer.from(base64Data, "base64")], {
        type: fileType,
      });

      const getFilesToken = await axiosInstance({
        url: `${getBaseUrl}/aws/create-aws-upload-files-token`,
        method: "POST",
        data: {
          images: [
            {
              mimetype: fileType,
              filename:
                `Screenshot_${crypto.randomUUID()}.` + fileType.split("/")[1],
              uid: crypto.randomUUID(),
            },
          ],
        },
        withCredentials: true,
      });

      const serverResponseObjects = getFilesToken?.data?.images[0];

      const response = await axiosInstance({
        url: serverResponseObjects.pre_url,
        method: "PUT",
        data: blob,
        withCredentials: true,
      });
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  return (
    <div ref={ref}>
      <div className="flex justify-center items-center gap-4">
        <WebcamCapture setImage={setImage} />
        <div className="flex flex-col justify-center items-center gap-4">
          <ClockComponents />
          <LocalIPComponent />
        </div>
      </div>
      <div className="flex justify-center items-center  my-4 gap-4">
        <Button
          type="primary"
          className="w-40 h-full"
          style={{ marginBottom: "10px" }}
          onClick={getImage}
        >
          Check in
        </Button>
        <Button
          type="default"
          className="w-40 h-full bg-indigo-700"
          style={{ marginBottom: "10px" }}
          onClick={getImage}
        >
          Check out
        </Button>
      </div>
      {/* Conditionally render the Image component only if 'image' is available */}
      {screenshot && (
        <CustomImageTag
          width={750}
          height={500}
          src={screenshot}
          alt={"Screenshot"}
          className="h-[50vh] w-[90vw] rounded-2xl border p-2 ring-2"
        />
      )}
    </div>
  );
  //   return <></>;
}
