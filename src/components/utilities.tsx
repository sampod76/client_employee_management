/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck
import * as faceapi from "face-api.js";
import { useEffect, useRef } from "react";

const FaceRecognition = () => {
  const videoRef = useRef();
  const canvasRef = useRef();

  const loadModels = async () => {
    const MODEL_URL = "/models"; // Ensure models are served from public/models
    await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
    await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
    await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
    await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
  };

  const startVideo = () => {
    navigator.mediaDevices.getUserMedia({ video: {} }).then((stream) => {
      videoRef.current.srcObject = stream;
    });
  };

  const handleVideoOnPlay = () => {
    setInterval(async () => {
      if (videoRef.current && canvasRef.current) {
        const displaySize = {
          width: videoRef.current.width,
          height: videoRef.current.height,
        };
        faceapi.matchDimensions(canvasRef.current, displaySize);

        const detections = await faceapi
          .detectAllFaces(
            videoRef.current,
            new faceapi.TinyFaceDetectorOptions()
          )
          .withFaceLandmarks()
          .withFaceExpressions();

        const resizedDetections = faceapi.resizeResults(
          detections,
          displaySize
        );
        canvasRef.current
          .getContext("2d")
          .clearRect(0, 0, displaySize.width, displaySize.height);
        faceapi.draw.drawDetections(canvasRef.current, resizedDetections);
        faceapi.draw.drawFaceLandmarks(canvasRef.current, resizedDetections);
        faceapi.draw.drawFaceExpressions(canvasRef.current, resizedDetections);
      }
    }, 100);
  };

  useEffect(() => {
    loadModels().then(startVideo);
  }, []);

  return (
    <div>
      <video
        ref={videoRef}
        onPlay={handleVideoOnPlay}
        width="720"
        height="560"
        autoPlay
        muted
      />
      <canvas ref={canvasRef} width="720" height="560" />
    </div>
  );
};

export default FaceRecognition;
