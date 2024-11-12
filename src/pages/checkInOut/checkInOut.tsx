/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Button, message } from 'antd';

import LoadingSkeleton from '@components/ui/Loading/LoadingSkeleton';
import { useRef, useState } from 'react';
//@ts-ignore
import { useScreenshot } from 'use-react-screenshot';
import ClockComponents from '../../components/CheckInOut/clock';
import LocalIPComponent from '../../components/CheckInOut/IpGet';
import WebcamCapture from '../../components/CheckInOut/WebCamra';
import CustomImageTag from '../../components/ui/CustomTag/CustomImage';
import { selectCurrentUser } from '../../redux/features/auth/authSlice';
import {
  useAddCheckInMutation,
  useAddCheckOutMutation,
  useGetAllCheckInOutQuery,
} from '../../redux/features/employee/checkInOutApi';
import { useAppSelector } from '../../redux/hooks';
import { ErrorModal } from '../../utils/modalHook';

export default function CheckInOut() {
  const user = useAppSelector(selectCurrentUser);
  console.log('🚀 ~ CheckInOut ~ user:', user);
  const { data, isLoading: getDateloading } = useGetAllCheckInOutQuery(
    { employeeUserId: user?.userId, toDay: 'yes' },
    { skip: !user?.userId }
  );
  const getData = data?.data || [];
  // console.log("🚀 ~ CheckInOut ~ getData:", getData);
  const ref = useRef(null);
  const [image, setImage] = useState(null);
  const [screenshot, takeScreenshot] = useScreenshot();
  const [addCheckin, { isLoading }] = useAddCheckInMutation();
  const [addCheckOut, { isLoading: checkoutLoading }] =
    useAddCheckOutMutation();
  const getImage = async (submitType: string) => {
    try {
      // Capture the screenshot
      const img = await takeScreenshot(ref.current);

      // Convert Base64 image to a Blob using fetch
      const response = await fetch(img);
      const blob = await response.blob();

      // Prepare form data
      const formData = new FormData();
      formData.append('provide', blob, crypto.randomUUID() + 'screenshot.png'); // Adjust filename as needed

      // Upload the image
      if (submitType === 'check-in') {
        await addCheckin(formData).unwrap();
      } else {
        await addCheckOut(formData).unwrap();
      }

      message.success(`Successfully ${submitType}`);
    } catch (error) {
      ErrorModal(error);
    }
  };

  const LateStatus = (type: string) => {
    // Ensure getData and getData[0] exist to prevent errors
    if (!getData || !getData[0] || !getData[0].checkInTime) {
      return <p>Check-in time not available</p>;
    }

    const checkInTime = new Date(getData[0].checkInTime).getTime();

    const today = new Date();
    const today9AM = new Date(today.setHours(9, 0, 0, 0)).getTime();
    const isOnTime = checkInTime <= today9AM;

    return (
      <p className="text-white">
        {isOnTime ? (
          <span className="rounded-xl bg-green-500 px-5 py-1">On time</span>
        ) : (
          <span className="rounded-xl bg-red-500 px-5 py-1">Late</span>
        )}
      </p>
    );
  };
  if (getDateloading) {
    return <LoadingSkeleton />;
  }
  return (
    <div ref={ref}>
      <p className="text-center text-lg text-red-500">
        (Please check in/out from your office computer)
      </p>
      <div className="flex items-center justify-center gap-4 rounded-lg border-8 p-5">
        <div className="mx-5 text-lg font-bold">
          <CustomImageTag
            src={user?.profileImage}
            width={750}
            height={500}
            preview={true}
            alt={'Screenshot'}
            className="h-52 w-[200px] rounded-2xl border p-2 ring-2"
          />
          <h1>Name: {user?.name?.firstName + ' ' + user?.name?.lastName}</h1>
          <h1>Email: {user?.email}</h1>
        </div>
        <WebcamCapture setImage={setImage} />
        <div className="flex flex-col items-center justify-center gap-4">
          <ClockComponents />
          <LocalIPComponent />
          <div className="space-y-4">
            <h1 className="flex items-center gap-1 text-lg">
              {' '}
              Official check-in time : 9:00 am{' '}
              {getData[0]?.checkInTime && LateStatus('start')}
            </h1>
            <h1 className="text-lg">Official check-out time : 6:00 pm</h1>
          </div>
        </div>
      </div>
      <div className="my-4 flex items-center justify-center gap-4">
        <Button
          type="primary"
          loading={isLoading}
          disabled={getData[0]?.checkInTime && true}
          className="h-full w-40"
          style={{ marginBottom: '10px' }}
          onClick={() => getImage('check-in')}
        >
          Check in
        </Button>
        <Button
          type="default"
          disabled={getData[0]?.checkOutTime && true}
          loading={checkoutLoading}
          className="h-full w-40 bg-indigo-700"
          style={{ marginBottom: '10px' }}
          onClick={() => getImage('check-out')}
        >
          Check out
        </Button>
      </div>
      {/* Conditionally render the Image component only if 'image' is available */}
      {/* {screenshot && (
        <CustomImageTag
          width={750}
          height={500}
          // src={screenshot}
          alt={"Screenshot"}
          className="w-[500px] h-52 rounded-2xl border p-2 ring-2"
        />
      )} */}
      <div className="flex flex-wrap items-center justify-start gap-5">
        {getData.length &&
          getData[0].provide.map((image: any, i: number) => (
            <div key={i} className="text-lg">
              {i == 0 ? (
                <p className="my-1 w-fit rounded-lg border p-2 text-center">
                  Check in provide
                </p>
              ) : (
                <p className="my-1 w-fit rounded-lg border p-2 text-center">
                  check out provide
                </p>
              )}
              <CustomImageTag
                width={750}
                height={500}
                src={image}
                preview={true}
                alt={'Screenshot'}
                className="h-52 w-[500px] rounded-2xl border p-2 ring-2"
              />
            </div>
          ))}
      </div>
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
