import { Outlet } from "react-router-dom";

export default function OutLateLayout({
  option,
}: {
  option?: { shoping: boolean };
}) {
  console.log(option?.shoping);
  return (
    <>
      <Outlet />
    </>
  );
}
