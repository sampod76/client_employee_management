import { Avatar, Badge, Button, Dropdown, MenuProps, message } from "antd";

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import CustomImageTag from "../CustomTag/CustomImage";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import {
  logout,
  selectCurrentUser,
} from "../../../redux/features/auth/authSlice";

const UserAvatarUI = () => {
  const user = useAppSelector(selectCurrentUser);
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: <Link to={"/profile"}> Profile</Link>,
    },
    {
      key: "2",
      label: <Link to={`/${user?.role}/dashboard`}>Dashboard</Link>,
    },

    {
      key: "6",
      label: (
        <Button
          onClick={() => {
            dispatch(logout());
            navigate("/login");
          }}
          type="default"
          style={{ color: "black" }}
        >
          Log out
        </Button>
      ),
    },
  ];
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "28px",
        // marginLeft: "24px",
      }}
    >
      <Dropdown
        menu={{ items }}
        overlayStyle={{
          minWidth: "100px",
          // background: "black",
        }}
      >
        <button style={{ opacity: "0px" }} className="">
          <CustomImageTag
            src={user?.profileImage || ""}
            width={550}
            height={550}
            className="w-8 h-8 md:h-12 md:w-12  rounded-full"
            alt=""
          />
        </button>
      </Dropdown>
    </div>
  );
};

export default UserAvatarUI;

// export default dynamic(() => Promise.resolve(UserAvatarUI), {
//   ssr: false,
// });
