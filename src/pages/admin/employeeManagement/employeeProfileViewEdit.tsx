import { useParams } from "react-router-dom";
import Profile from "../../Profile";

export default function EmployeeProfileViewEdit() {
  const { id } = useParams();
  return (
    <div>
      <Profile />
    </div>
  );
}
