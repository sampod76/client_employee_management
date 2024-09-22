import axios from "axios";
import React, { useState, useEffect } from "react";

export default function ClockComponents() {
  const [time, updateTime] = useState(new Date());
  const [ipAddress, setIpAddress] = useState("");
  console.log("🚀 ~ ClockComponents ~ ipAddress:", ipAddress);

  useEffect(() => {
    // Timer update logic
    const timer = setInterval(() => {
      updateTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Bangladesh TimeZone Conversion
  const bangladeshTime = new Date(
    time.toLocaleString("en-US", { timeZone: "Asia/Dhaka" })
  );

  return (
    <div className="flex items-center justify-center text-white">
      <div className="text-center">
        <h1 className="mb-6 text-3xl text-green-700 font-bold">
          Digital Clock
        </h1>
        <div className="flex items-center justify-center">
          <div className="rounded-lg border-8 border-green-400 p-4">
            <span className="text-6xl text-green-400">
              {bangladeshTime.toLocaleTimeString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
