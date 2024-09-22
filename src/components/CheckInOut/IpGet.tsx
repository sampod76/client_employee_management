const getLocalIP = (callback: { (ip: any): void; (arg0: string): void }) => {
  const pc = new RTCPeerConnection();
  pc.createDataChannel("");
  pc.onicecandidate = (event) => {
    if (!event || !event.candidate) {
      return;
    }
    const candidate = event.candidate.candidate;
    const parts = candidate.split(" ");
    const ip = parts[4];
    if (ip) {
      callback(ip);
    }
  };
  pc.createOffer()
    .then((offer) => pc.setLocalDescription(offer))
    .catch((err) => console.error("Error creating offer", err));
};

import axios from "axios";
// Example usage in your React component
import React, { useEffect, useState } from "react";

const LocalIPComponent = () => {
  const [localIP, setLocalIP] = useState("");
  const [ipAddress, setIpAddress] = useState("");
  useEffect(() => {
    getLocalIP((ip) => {
      setLocalIP(ip);
    });
  }, []);
  useEffect(() => {
    axios
      .get("https://api.ipify.org?format=json")
      .then((response) => {
        console.log("🚀 ~ .then ~ response:", response);
        setIpAddress(response.data.ip);
      })
      .catch((error) => {
        console.error("Error fetching the IP address:", error);
      });
  }, []);

  return (
    <div className="text-xl border-2 rounded-xl p-5   text-blue-500">
      <p>Your Local IP Address: {localIP ? localIP : "Detecting..."}</p>

      <p>Your Public IP Address:{ipAddress ? ipAddress : "Fetching..."}</p>
    </div>
  );
};

export default LocalIPComponent;
