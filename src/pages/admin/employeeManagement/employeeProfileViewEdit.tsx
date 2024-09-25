import React from "react";
import Profile from "../../Profile";
import { useParams } from "react-router-dom";

export default function EmployeeProfileViewEdit() {
  const { id } = useParams();
  return (
    <div>
      <Profile id={id} />
    </div>
  );
}
