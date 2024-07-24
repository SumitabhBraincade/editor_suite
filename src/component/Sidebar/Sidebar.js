import React, { useEffect, useState } from "react";
import leftIcon from "../../assets/icon/left_icon.svg";
import rightIcon from "../../assets/icon/right_icon.svg";
import ImageTab from "../ImageTab/ImageTab";
import AnimateTab from "../AnimateTab/AnimateTab";
import GradientButton from "../../common/GradientButton";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import GoogleSingin from "../GoogleSingin/GoogleSingin";
import { checkTokenExpiration } from "../Utils/auth";
import { updateCallSaveImage } from "../../redux/slices/sidebarSlice";

const Sidebar = () => {
  const [tab, setTab] = useState("image");
  const [userToken, setUserToken] = useState(Cookies.get("userToken"));

  const canvasImage = useSelector((state) => state.sidebar.canvasImage);
  const dispatch = useDispatch();

  useEffect(() => {
    const handleUserTokenChange = () => {
      setUserToken(Cookies.get("userToken"));
    };

    window.addEventListener("userTokenChange", handleUserTokenChange);

    return () => {
      window.removeEventListener("userTokenChange", handleUserTokenChange);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (checkTokenExpiration()) {
        Cookies.remove("userToken");
        Cookies.remove("tokenExpiration");
        setUserToken(null);
        window.dispatchEvent(new Event("userTokenChange"));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleImageTabClick = () => {
    setTab("image");
  };

  const handleAnimateTabClick = () => {
    setTab("animate");
  };

  const handleSaveClick = () => {
    dispatch(updateCallSaveImage(true));
  };

  return (
    <div className="w-1/4 min-h-full flex flex-col bg-[#101010] border-[1px] border-[#1C1C1C] rounded-lg">
      {userToken ? (
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
          <div onClick={handleSaveClick}>
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
