import React from "react";
import upscalerIcon from "../../assets/icon/upscaler_icon.svg";
import { useDispatch } from "react-redux";
import { updateCallUpscaler } from "../../redux/slices/sidebarSlice";

const ImageUpscaler = () => {
  const dispatch = useDispatch();

  const handleUpscaleClick = () => {
    dispatch(updateCallUpscaler(true));
  };

  return (
    <div className="border-[1px] border-[#242424] pb-3 pt-6 px-5 flex flex-col items-start justify-between transition-all duration-200 hover:bg-[#171717]">
      <div className="flex gap-2 justify-start items-center">
        <img src={upscalerIcon}></img>
        <p className="text-xs font-medium text-[#fff]">Image Upscaler</p>
      </div>
      <p className="text-[10px] font-medium text-[#ffffff5a] py-2">
        Image can be only upscaled once
      </p>
      <div className="w-full flex">
        <div
          className="h-10 w-[98%] m-[1%] text-xs font-light text-[#fdfdfd7e] flex justify-center items-center bg-[#2729301f] border-[1px] border-[#242424] rounded cursor-pointer radial_gradient_bg"
          onClick={handleUpscaleClick}
        >
          Upscale
        </div>
      </div>
    </div>
  );
};

export default ImageUpscaler;
