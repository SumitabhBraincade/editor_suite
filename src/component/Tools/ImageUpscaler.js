import React from "react";

const ImageUpscaler = () => {
  return (
    <div className="border-[1px] border-[#242424] pb-3 pt-6 px-5 flex flex-col items-start justify-between transition-all duration-200 hover:bg-[#171717]">
      <div className="flex justify-start items-center">
        <p className="text-xs font-medium text-[#fff]">Image Upscaler</p>
      </div>
      <p className="text-[10px] font-medium text-[#ffffff5a] py-2">
        Image can be only upscaled once
      </p>
      <div className="w-full flex">
        <div className="h-10 w-[98%] m-[1%] text-xs font-light text-[#fdfdfd7e] flex justify-center items-center bg-[#2729301f] border-[1px] border-[#242424] rounded cursor-pointer radial_gradient_bg">
          Upscale
        </div>
      </div>
    </div>
  );
};

export default ImageUpscaler;
