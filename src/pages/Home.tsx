import { Button } from "antd";
import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="container mx-auto p-10 shadow-2xl h-screen">
      <div className="flex flex-wrap gap-2 items-center">
        <Link to={"/screen-recorder"}>
          {" "}
          <Button>Screen Recorder</Button>
        </Link>
        <Link to={"/face-unlock"}>
          {" "}
          <Button>Face unlock</Button>
        </Link>
      </div>
    </div>
  );
}
