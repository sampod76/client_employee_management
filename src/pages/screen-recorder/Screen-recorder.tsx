import axios from "axios";
import dayjs from "dayjs";
import { saveAs } from "file-saver";
import React, { useEffect, useRef, useState } from "react";
import {
  FaDownload,
  FaMicrophone,
  FaMicrophoneSlash,
  FaPause,
  FaPlay,
  FaStop,
  FaVideo,
  FaVideoSlash,
} from "react-icons/fa";
import { MdCallEnd, MdCancel, MdScreenShare } from "react-icons/md";
import ReactPlayer from "react-player";
import { useStopwatch } from "react-timer-hook";
import RecordRTC from "recordrtc";

type MediaType = "video" | "audio";

const RecordRTCApp: React.FC = () => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [mediaBlobUrl, setMediaBlobUrl] = useState<string | null>(null);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [mediaType, setMediaType] = useState<MediaType | null>(null);
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(false);
  const [isCameraOn, setIsCameraOn] = useState<boolean>(true);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isScreenSharing, setIsScreenSharing] = useState<boolean>(false);
  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
  const [microphones, setMicrophones] = useState<MediaDeviceInfo[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<string | null>(null);
  const [selectedMicrophone, setSelectedMicrophone] = useState<string | null>(
    null
  );
  const recorderRef = useRef<RecordRTC | null>(null);
  const liveVideoRef = useRef<HTMLVideoElement | null>(null);
  const cameraVideoRef = useRef<HTMLVideoElement | null>(null);

  const { seconds, minutes, hours, start, pause, reset } = useStopwatch({
    autoStart: false,
  });

  const formatTime = (): string => {
    return dayjs()
      .hour(hours)
      .minute(minutes)
      .second(seconds)
      .format("HH:mm:ss");
  };

  const getAvailableDevices = async () => {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoDevices = devices.filter(
      (device) => device.kind === "videoinput"
    );
    const audioDevices = devices.filter(
      (device) => device.kind === "audioinput"
    );
    setCameras(videoDevices);
    setMicrophones(audioDevices);
    if (videoDevices.length > 0) setSelectedCamera(videoDevices[0].deviceId);
    if (audioDevices.length > 0)
      setSelectedMicrophone(audioDevices[0].deviceId);
  };

  useEffect(() => {
    getAvailableDevices();
  }, []);

  useEffect(() => {
    if (liveVideoRef.current && mediaStream) {
      liveVideoRef.current.srcObject = mediaStream;
    }
    if (cameraVideoRef.current && cameraStream) {
      cameraVideoRef.current.srcObject = cameraStream;
    }
  }, [mediaStream, cameraStream]);

  const startCameraStream = async () => {
    try {
      const constraints = {
        video: {
          deviceId: selectedCamera ? { exact: selectedCamera } : undefined,
        },
        audio: {
          deviceId: selectedMicrophone
            ? { exact: selectedMicrophone }
            : undefined,
        },
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      setCameraStream(stream);
    } catch (error) {
      console.error("Error starting camera stream:", error);
    }
  };

  const startScreenRecording = async (recordAudio: boolean) => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });
      if (recordAudio) {
        const audioStream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        const combinedStream = new MediaStream([
          ...screenStream.getTracks(),
          ...audioStream.getTracks(),
        ]);
        setMediaStream(combinedStream);
        recorderRef.current = new RecordRTC(combinedStream, { type: "video" });
      } else {
        setMediaStream(screenStream);
        recorderRef.current = new RecordRTC(screenStream, { type: "video" });
      }
      recorderRef.current.startRecording();
      setMediaType("video");
      setIsRecording(true);
      setIsScreenSharing(true);
      startCameraStream();
      start();
    } catch (error) {
      console.error("Error starting screen recording:", error);
    }
  };

  const stopScreenShare = () => {
    if (mediaStream) {
      const videoTrack = mediaStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.stop();
        mediaStream.removeTrack(videoTrack);
        setIsScreenSharing(false);
      }
    }
  };

  const restartScreenSharing = async () => {
    try {
      const newScreenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });
      const newScreenTrack = newScreenStream.getVideoTracks()[0];
      if (mediaStream && recorderRef.current) {
        mediaStream.addTrack(newScreenTrack);
        //@ts-ignore
        recorderRef.current.stream = mediaStream;
        setIsScreenSharing(true);
      }
    } catch (error) {
      console.error("Error restarting screen sharing:", error);
    }
  };

  const stopRecording = async () => {
    setIsRecording(false);
    pause();
    await recorderRef.current?.stopRecording(() => {
      const blob = recorderRef.current?.getBlob();
      if (blob) {
        setMediaBlobUrl(URL.createObjectURL(blob));
      }
    });
    mediaStream?.getTracks().forEach((track) => track.stop());
    cameraStream?.getTracks().forEach((track) => track.stop());
    setMediaStream(null);
    setCameraStream(null);
    reset();
  };

  const downloadRecording = () => {
    if (recorderRef.current) {
      const blob = recorderRef.current.getBlob();
      saveAs(blob, `recording.${mediaType === "audio" ? "webm" : "webm"}`);
    }
  };

  //------------------------------------------------------------

  const uploadToS3 = async (blob: Blob) => {
    try {
      const response = await axios.get("/generate-presigned-url");
      const { url } = response.data;

      await axios.put(url, blob, {
        headers: {
          "Content-Type": "video/webm",
        },
      });

      console.log("Successfully uploaded to S3");
    } catch (error) {
      console.error("Error uploading to S3:", error);
    }
  };
  const UploadRecording = () => {
    if (recorderRef.current) {
      const blob = recorderRef.current.getBlob();

      if (blob) {
        setMediaBlobUrl(URL.createObjectURL(blob));
        // Upload the blob to S3
        uploadToS3(blob);
      }
    }
  };
  //-------------------------------------------------------------

  const toggleMuteAudio = () => {
    if (mediaStream) {
      mediaStream.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsAudioMuted(!isAudioMuted);
    }
  };

  const toggleCamera = () => {
    if (cameraStream) {
      cameraStream.getVideoTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsCameraOn(!isCameraOn);
    }
  };

  const togglePauseResumeRecording = () => {
    if (recorderRef.current) {
      if (recorderRef.current.getState() === "paused") {
        recorderRef.current.resumeRecording();
        setIsPaused(false);
        start();
      } else {
        recorderRef.current.pauseRecording();
        setIsPaused(true);
        pause();
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white">
      <div className="my-4 flex space-x-4 ">
        <div className="flex flex-col">
          <label
            htmlFor="cameraSelect"
            className="text-sm font-medium text-gray-400 mb-1"
          >
            Camera
          </label>
          <select
            id="cameraSelect"
            value={selectedCamera || ""}
            onChange={(e) => setSelectedCamera(e.target.value)}
            className="px-2 py-1 bg-gray-700 text-white rounded-md"
          >
            {cameras.map((camera) => (
              <option key={camera.deviceId} value={camera.deviceId}>
                {camera.label || `Camera ${camera.deviceId}`}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="microphoneSelect"
            className="text-sm font-medium text-gray-400 mb-1"
          >
            Microphone
          </label>
          <select
            id="microphoneSelect"
            value={selectedMicrophone || ""}
            onChange={(e) => setSelectedMicrophone(e.target.value)}
            className="px-2 py-1 bg-gray-700 text-white rounded-md"
          >
            {microphones.map((microphone) => (
              <option key={microphone.deviceId} value={microphone.deviceId}>
                {microphone.label || `Microphone ${microphone.deviceId}`}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="bg-gray-800 p-6 shadow-lg rounded-lg w-full max-w-4xl relative">
        <div className="video-container flex justify-center">
          {isRecording && mediaType === "video" ? (
            <video
              ref={liveVideoRef}
              autoPlay
              muted
              className="w-full h-96 bg-black rounded-md"
            />
          ) : (
            <div className="w-full h-96 bg-black flex items-center justify-center text-lg text-gray-500 rounded-md">
              No video stream
            </div>
          )}

          {isRecording && cameraStream && (
            <video
              ref={cameraVideoRef}
              autoPlay
              muted
              className="w-40 h-30 bg-black rounded-md absolute bottom-4 right-4 border-2 border-gray-500"
            />
          )}

          {isRecording && (
            <div className="absolute top-4 left-4 bg-gray-800 text-white p-2 rounded">
              Time Elapsed: {formatTime()}
            </div>
          )}

          {isRecording && !isPaused && (
            <div className="absolute top-4 right-4">
              <div className=" animate-pulse">
                <p className="text-3xl rounded-full text-red-700 font-extrabold mr-2">
                  O
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="control-bar mt-4 flex justify-center space-x-6 py-3 bg-gray-700 rounded-md">
          <button onClick={toggleMuteAudio} className="control-button">
            {isAudioMuted ? (
              <FaMicrophoneSlash size={24} />
            ) : (
              <FaMicrophone size={24} />
            )}
          </button>

          <button onClick={toggleCamera} className="control-button">
            {isCameraOn ? <FaVideo size={24} /> : <FaVideoSlash size={24} />}
          </button>

          <button
            onClick={togglePauseResumeRecording}
            className="control-button"
          >
            {isPaused ? <FaPlay size={24} /> : <FaPause size={24} />}
          </button>

          <button onClick={stopRecording} className="control-button">
            <FaStop size={24} />
          </button>

          {!isRecording && (
            <button
              onClick={() => startScreenRecording(true)}
              className="control-button"
            >
              <MdScreenShare size={24} />
              <p>Start</p>
            </button>
          )}

          {isScreenSharing && (
            <button
              onClick={stopScreenShare}
              className="control-button bg-red-600"
            >
              <MdCancel size={24} />
            </button>
          )}

          {!isScreenSharing && isRecording && (
            <button
              onClick={restartScreenSharing}
              className="control-button bg-green-600"
            >
              <MdScreenShare size={24} />
            </button>
          )}

          {!isRecording && mediaBlobUrl && (
            <button onClick={downloadRecording} className="control-button">
              <FaDownload size={24} />
            </button>
          )}

          <button
            onClick={stopRecording}
            className="control-button bg-red-600 hover:bg-red-700 rounded-full p-2"
          >
            <MdCallEnd size={24} />
          </button>
        </div>
      </div>

      {!isRecording && mediaBlobUrl && (
        <div className="mt-4 bg-gray-800 p-4 rounded-md w-full max-w-4xl">
          <ReactPlayer
            url={mediaBlobUrl}
            controls
            className="w-full h-64 bg-black rounded-md"
          />
        </div>
      )}
    </div>
  );
};

export default RecordRTCApp;
