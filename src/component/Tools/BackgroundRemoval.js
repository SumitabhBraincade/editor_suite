import React from "react";
import { useDispatch } from "react-redux";
import { updateCallRemoveBackground } from "../../redux/slices/sidebarSlice";
import {
  backgroundRemovalIcon,
  bgRemoveButtonIcon,
  outlineIcon,
} from "../../assets";

const BackgroundRemoval = () => {
  const dispatch = useDispatch();

  const handleRemoveBackgroundClick = () => {
    dispatch(updateCallRemoveBackground(true));
  };

  return (
    <div className="pb-3 pt-6 px-5 flex flex-col items-start justify-between transition-all duration-200 hover:bg-[#171717]">
      <div className="flex gap-2 justify-start items-center">
        <img src={backgroundRemovalIcon}></img>
        <p className="text-xs font-medium text-[#fff]">Generative Brush</p>
      </div>
      <div className="w-full flex mt-4">
        <div
          className="h-10 w-[48%] m-[1%] text-xs font-light text-[#fdfdfd7e] flex gap-2 justify-center items-center bg-[#2729301f] border-[1px] border-[#242424] rounded cursor-pointer radial_gradient_bg"
          onClick={handleRemoveBackgroundClick}
        >
          <img src={bgRemoveButtonIcon}></img>
          Remove BG
        </div>
        <div className="h-10 w-[48%] m-[1%] text-xs font-light text-[#fdfdfd7e] flex gap-2 justify-center items-center bg-[#2729301f] border-[1px] border-[#242424] rounded cursor-pointer radial_gradient_bg">
          <img src={outlineIcon}></img>
          Outline
        </div>
      </div>
    </div>
  );
};

export default BackgroundRemoval;
