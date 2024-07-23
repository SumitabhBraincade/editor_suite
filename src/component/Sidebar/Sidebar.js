import React, { useEffect, useState } from "react";
import leftIcon from "../../assets/icon/left_icon.svg";
import rightIcon from "../../assets/icon/right_icon.svg";
import ImageTab from "../ImageTab/ImageTab";
import AnimateTab from "../AnimateTab/AnimateTab";
import GradientButton from "../../common/GradientButton";
import { useDispatch } from "react-redux";
import { updateShowSignIn } from "../../redux/slices/sidebarSlice";
import Cookies from "js-cookie";
import GoogleSingin from "../GoogleSingin/GoogleSingin";

const Sidebar = () => {
  const [tab, setTab] = useState("image");
  const [userSignedIn, setUserSignedIn] = useState(false);

  const dispatch = useDispatch();

  const userToken = Cookies.get("userToken");

  useEffect(() => {
    if (userToken) {
      setUserSignedIn(true);
    } else {
      setUserSignedIn(false);
    }
  }, [userToken]);

  const handleImageTabClick = () => {
    setTab("image");
  };

  const handleAnimateTabClick = () => {
    setTab("animate");
  };

  return (
    <div className="w-1/4 min-h-full flex flex-col bg-[#101010] border-[1px] border-[#1C1C1C] rounded-lg">
      {!userSignedIn ? (
        <div className="h-fit w-full flex flex-col justify-between items-start p-4 bg-[#171717] border-[1px] border-[#1C1C1C] rounded-t-lg">
          <p className="font-medium text-white text-sm">
            Get started by signing into aicade
          </p>
          <div className="mt-4 w-full">
            <GoogleSingin />
          </div>
        </div>
      ) : (
        <div className="h-[60px] w-full flex justify-between items-center p-4 bg-[#171717] border-[1px] border-[#1C1C1C] rounded-t-lg">
          <div className="flex items-center justify-around w-fit">
            <div className="h-7 w-7 flex justify-center items-center rounded-lg border-[1px] border-[#303236] cursor-pointer hover:bg-[#444444] transition-all duration-200">
              <img src={leftIcon} width="8px"></img>
            </div>
            <p className="text-white text-sm font-medium px-2">
              Name of the asset
            </p>
            <div className="h-7 w-7 flex justify-center items-center rounded-lg border-[1px] border-[#303236] cursor-pointer hover:bg-[#444444] transition-all duration-200">
              <img src={rightIcon} width="8px"></img>
            </div>
          </div>
          <div>
            <GradientButton
              containerStyle={"h-[32px] w-[80px]"}
              titleStyle={"h-[28px] w-[76px]"}
              title={"Save"}
            />
          </div>
        </div>
      )}
      <div className="min-h-12 w-full flex items-end px-5 border-b-[1px] border-[#242424]">
        <div
          className={`h-full flex justify-center items-center px-2 text-sm font-medium transition-all duration-150 cursor-pointer ${
            tab === "image"
              ? "border-b-[2px] border-[#fff] text-white"
              : "text-[#ffffff3f]"
          }`}
          onClick={handleImageTabClick}
        >
          Image
        </div>
        <div
          className={`h-full flex justify-center items-center ml-2 px-2 text-sm font-medium transition-all duration-150 cursor-pointer ${
            tab === "animate"
              ? "border-b-[2px] border-[#fff] text-white"
              : "text-[#ffffff3f]"
          }`}
          onClick={handleAnimateTabClick}
        >
          Animate
        </div>
      </div>
      {tab === "image" ? <ImageTab /> : <AnimateTab />}
    </div>
  );
};

export default Sidebar;
