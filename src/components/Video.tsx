import React, { useRef, useEffect, useState } from "react";

const VideoPlayer = ({ videoSrc }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const videoElement = videoRef.current;

    const handlePlay = () => {
      setIsPlaying(true);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    const handleCanPlay = () => {
      if (!isPlaying) {
        videoElement?.play().catch((error) => {
          console.error("Error playing video:", error);
        });
      }
    };

    // Add event listeners to the video element
    videoElement?.addEventListener("play", handlePlay);
    videoElement?.addEventListener("pause", handlePause);
    videoElement?.addEventListener("canplay", handleCanPlay);

    // Clean up event listeners when component unmounts
    return () => {
      videoElement?.removeEventListener("play", handlePlay);
      videoElement?.removeEventListener("pause", handlePause);
      videoElement?.removeEventListener("canplay", handleCanPlay);
    };
  }, [isPlaying]);

  // Changing video source: pause first, then load and play the new video
  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement) {
      videoElement.pause();
      videoElement.src = videoSrc;
      videoElement.load(); // Reload the video source
      videoElement.play().catch((error) => {
        console.error("Error playing new video:", error);
      });
    }
  }, [videoSrc]);

  return (
    <div>
      <video ref={videoRef} width="600" controls>
        <source src={videoSrc} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default VideoPlayer;
