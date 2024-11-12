import React, { useRef, useEffect, useState } from 'react';
import * as faceapi from 'face-api.js';
import { message } from 'antd';

const FaceRecognition = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authenticatedUser, setAuthenticatedUser] = useState<string | null>(
    null
  );

  // List of stored images for multiple users
  const storedImages = [
    { label: 'myImage', src: '/my.jpg' },
    { label: 'anotherPerson', src: '/4.jpg' },
  ];

  // Load models for face detection, face landmarks, and recognition
  const loadModels = async (): Promise<void> => {
    const MODEL_URL = '/models'; // specify where you store models (like in public/models)
    await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL); // tiny face detector
    await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL); // face landmarks
    await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL); // face recognition
    await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL); // load SsdMobilenetv1
  };

  // Start video from webcam
  const startVideo = (): void => {
    navigator.mediaDevices.getUserMedia({ video: {} }).then((stream) => {
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    });
  };

  // Load and detect face descriptors from stored images
  const loadStoredImageDescriptors = async (): Promise<
    faceapi.LabeledFaceDescriptors[]
  > => {
    const labeledFaceDescriptors: faceapi.LabeledFaceDescriptors[] = [];

    for (const image of storedImages) {
      const img = await faceapi.fetchImage(image.src); // Load each stored image
      const detection = await faceapi
        .detectSingleFace(img)
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (detection) {
        const descriptors = [detection.descriptor];
        labeledFaceDescriptors.push(
          new faceapi.LabeledFaceDescriptors(image.label, descriptors)
        );
      }
    }

    return labeledFaceDescriptors;
  };

  // Handle video playback and perform live face recognition
  const handleVideoOnPlay = async (): Promise<void> => {
    const labeledDescriptors = await loadStoredImageDescriptors();
    if (labeledDescriptors.length === 0) {
      console.error('No stored images detected!');
      return;
    }

    const faceMatcher = new faceapi.FaceMatcher(labeledDescriptors, 0.6); // 0.6 is the matching threshold

    setInterval(async () => {
      if (videoRef.current && canvasRef.current) {
        const displaySize = {
          width: videoRef.current.width,
          height: videoRef.current.height,
        };
        faceapi.matchDimensions(canvasRef.current, displaySize);

        const detections = await faceapi
          .detectAllFaces(videoRef.current, new faceapi.SsdMobilenetv1Options())
          .withFaceLandmarks()
          .withFaceDescriptors();

        const resizedDetections = faceapi.resizeResults(
          detections,
          displaySize
        );
        canvasRef.current
          .getContext('2d')
          ?.clearRect(0, 0, displaySize.width, displaySize.height);

        faceapi.draw.drawDetections(canvasRef.current, resizedDetections);
        faceapi.draw.drawFaceLandmarks(canvasRef.current, resizedDetections);

        // Compare each detected face with all stored face descriptors
        resizedDetections.forEach((detection) => {
          const bestMatch = faceMatcher.findBestMatch(detection.descriptor);
          if (bestMatch.label !== 'unknown' && bestMatch.distance < 0.6) {
            console.log(`Face matched with: ${bestMatch.label}`);
            setIsAuthenticated(true); // Set state to true for authentication
            setAuthenticatedUser(bestMatch.label); // Save the authenticated user
          }
        });
      }
    }, 100);
  };

  useEffect(() => {
    if (isAuthenticated && authenticatedUser) {
      message.success(`Authenticated as ${authenticatedUser}`);
    }
  }, [isAuthenticated, authenticatedUser]);

  useEffect(() => {
    loadModels().then(startVideo);
  }, []);

  return (
    <div>
      <div className="flex items-center justify-start gap-3">
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

      <div>
        <h3>Stored Images</h3>
        <div className="stored-images">
          {storedImages.map((image, idx) => (
            <img
              key={idx}
              src={image.src}
              alt={image.label}
              width="150"
              height="150"
              style={{ marginRight: '10px' }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FaceRecognition;
