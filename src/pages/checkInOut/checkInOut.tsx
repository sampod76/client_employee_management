import { Button, Input, message } from "antd";

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
import { SuccessModal } from "../../utils/modalHook";
import { useAddCheckInMutation } from "../../redux/features/employee/checkInOutApi";

export default function CheckInOut() {
  const user = useAppSelector(selectCurrentUser);
  const ref = useRef(null);
  const [image, setImage] = useState(null);
  const [screenshot, takeScreenshot] = useScreenshot();
  const [addCheckin, { isLoading }] = useAddCheckInMutation();
  const getImage = async (submitType: string) => {
    try {
      // Capture the screenshot
      const img = await takeScreenshot(ref.current);

      // Convert Base64 image to a Blob using fetch
      const response = await fetch(img);
      const blob = await response.blob();

      // Prepare form data
      const formData = new FormData();
      formData.append("provide", blob, crypto.randomUUID() + "screenshot.png"); // Adjust filename as needed

      // Upload the image
      const res = await addCheckin(formData).unwrap();
      console.log("🚀 ~ getImage ~ res:", res);
      message.success(`Successfully ${submitType}`);
    } catch (error) {
      console.error("Error uploading image:", error);
      message.error(`Failed to ${submitType}`);
    }
  };

  return (
    <div ref={ref}>
      <div className="flex justify-center items-center gap-4 border-8 p-5 rounded-lg">
        <div className="text-lg mx-5 font-bold">
          <h1>Name:{user?.name?.firstName + " " + user?.name?.lastName}</h1>
          <h1>Email:{user?.email}</h1>
        </div>
        <WebcamCapture setImage={setImage} />
        <div className="flex flex-col justify-center items-center gap-4">
          <ClockComponents />
          <LocalIPComponent />
          <div>
            <h1 className="text-lg"> Official check-in time : 9:00 am</h1>
            <h1 className="text-lg">Official check-out time : 6:00 pm</h1>
          </div>
        </div>
      </div>
      <div className="flex justify-center items-center  my-4 gap-4">
        <Button
          type="primary"
          loading={isLoading}
          className="w-40 h-full"
          style={{ marginBottom: "10px" }}
          onClick={() => getImage("check-in")}
        >
          Check in
        </Button>
        <Button
          type="default"
          className="w-40 h-full bg-indigo-700"
          style={{ marginBottom: "10px" }}
          onClick={() => getImage("check-out")}
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
          className="w-[500px] h-52 rounded-2xl border p-2 ring-2"
        />
      )}
    </div>
  );
  //   return <></>;
}

/* 

   // const getFilesToken = await axiosInstance({
      //   url: `${getBaseUrl}/aws/create-aws-upload-files-token`,
      //   method: "POST",
      //   data: {
      //     images: [
      //       {
      //         mimetype: fileType,
      //         filename:
      //           `Screenshot_${crypto.randomUUID()}.` + fileType.split("/")[1],
      //         uid: crypto.randomUUID(),
      //       },
      //     ],
      //   },
      //   withCredentials: true,
      // });

      // const serverResponseObjects = getFilesToken?.data?.images[0];
      // console.log(
      //   "🚀 ~ getImage ~ serverResponseObjects:",
      //   serverResponseObjects
      // );

      // const response = await axiosInstance({
      //   url: serverResponseObjects.pre_url,
      //   method: "PUT",
      //   data: blob,
      //   withCredentials: true,
      // });

*/