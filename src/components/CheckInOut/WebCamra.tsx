/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useCallback, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import CustomImageTag from '../ui/CustomTag/CustomImage';

const videoConstraints = {
  width: 750,
  height: 500,
  facingMode: 'user',
};

const WebcamCapture = ({ setImage }: any) => {
  const webcamRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);

  const capture = useCallback(() => {
    //@ts-ignore
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc); // Save the captured image
    setImage(imageSrc);
  }, [webcamRef]);

  return (
    <div>
      <Webcam
        audio={false}
        height={600}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width={500}
        videoConstraints={videoConstraints}
        className="mx-auto rounded-2xl"
      />
      <button className="hidden" onClick={() => capture()}>
        Capture
      </button>
      {capturedImage && (
        <div>
          <h3>Captured Image:</h3>
          <CustomImageTag
            width={500}
            height={500}
            src={capturedImage}
            alt="Captured"
          />
        </div>
      )}
    </div>
  );
};

export default WebcamCapture;
