import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateDraw, updateErase } from "../../redux/slices/sidebarSlice";

const GenerativeBrush = () => {
  const dispatch = useDispatch();

  const handleDrawClick = () => {
    dispatch(updateDraw(true));
  };

  const handleEraseClick = () => {
    dispatch(updateErase(true));
  };

  return (
    <div className="border-[1px] border-[#242424] pb-3 pt-6 px-5 flex flex-col items-start justify-between transition-all duration-200 hover:bg-[#171717]">
      <div className="flex justify-start items-center">
        <p className="text-xs font-medium text-[#fff]">Generative Brush</p>
      </div>
      <div className="w-full flex mt-4">
        <div
          className="h-10 w-[48%] m-[1%] text-xs font-light text-[#fdfdfd7e] flex justify-center items-center bg-[#2729301f] border-[1px] border-[#242424] rounded cursor-pointer radial_gradient_bg"
          onClick={handleDrawClick}
        >
          Draw
        </div>
        <div
          className="h-10 w-[48%] m-[1%] text-xs font-light text-[#fdfdfd7e] flex justify-center items-center bg-[#2729301f] border-[1px] border-[#242424] rounded cursor-pointer radial_gradient_bg"
          onClick={handleEraseClick}
        >
          Erase
        </div>
      </div>
    </div>
  );
};

export default GenerativeBrush;
