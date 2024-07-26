import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateDraw, updateErase } from "../../redux/slices/sidebarSlice";
import { generativeBrushIcon, drawIcon, eraseIcon } from "../../assets/index";

const GenerativeBrush = () => {
  const [drawMouseIn, setDrawMouseIn] = useState(false);
  const [eraseMouseIn, setEraseMouseIn] = useState(false);

  const isDraw = useSelector((state) => state.sidebar.draw);
  const isErase = useSelector((state) => state.sidebar.erase);

  const dispatch = useDispatch();

  const handleDrawClick = () => {
    dispatch(updateErase(false));
    dispatch(updateDraw(true));
  };

  const handleEraseClick = () => {
    dispatch(updateErase(true));
  };

  return (
    <div
      className={`border-b border-[#242424] pb-3 pt-6 px-5 flex flex-col items-start justify-between transition-all duration-200 ${
        isDraw || isErase ? "bg-[#171717]" : ""
      }`}
    >
      <div className="flex gap-2 justify-start items-center">
        <img src={generativeBrushIcon}></img>
        <p className="text-xs font-medium text-[#fff]">Generative Brush</p>
      </div>
      <div className="w-full flex mt-4">
        <div
          className={`h-10 w-[48%] m-[1%] text-xs font-light ${
            drawMouseIn ? "text-white" : "text-[#fdfdfd7e]"
          } flex gap-2 justify-center items-center bg-[#2729301f] border-[1px] border-[#242424] rounded cursor-pointer radial_gradient_bg`}
          onClick={handleDrawClick}
          onMouseEnter={() => setDrawMouseIn(true)}
          onMouseLeave={() => setDrawMouseIn(false)}
        >
          <svg
            width="17"
            height="16"
            viewBox="0 0 17 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M14.3067 4.69329C14.5667 4.43329 14.5667 3.99996 14.3067 3.75329L12.7467 2.19329C12.5 1.93329 12.0667 1.93329 11.8067 2.19329L10.58 3.41329L13.08 5.91329M2.5 11.5V14H5L12.3733 6.61996L9.87333 4.11996L2.5 11.5Z"
              fill="#FDFDFD"
              fill-opacity={drawMouseIn ? "1" : "0.5"}
            />
          </svg>
          Draw
        </div>
        <div
          className={`h-10 w-[48%] m-[1%] text-xs font-light ${
            eraseMouseIn ? "text-white" : "text-[#fdfdfd7e]"
          } flex gap-2 justify-center items-center bg-[#2729301f] border-[1px] border-[#242424] rounded cursor-pointer radial_gradient_bg`}
          onClick={handleEraseClick}
          onMouseEnter={() => setEraseMouseIn(true)}
          onMouseLeave={() => setEraseMouseIn(false)}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10.8267 2.3734L14.1267 5.66673C14.6467 6.1934 14.6467 7.0334 14.1267 7.56007L8 13.6867C7.49896 14.1858 6.82055 14.4661 6.11334 14.4661C5.40612 14.4661 4.72772 14.1858 4.22667 13.6867L1.87334 11.3334C1.35334 10.8067 1.35334 9.96673 1.87334 9.44006L8.94 2.3734C9.46667 1.8534 10.3067 1.8534 10.8267 2.3734ZM2.81334 10.3867L5.17334 12.7401C5.69334 13.2667 6.53334 13.2667 7.06 12.7401L9.41334 10.3867L6.11334 7.08673L2.81334 10.3867Z"
              fill="#FDFDFD"
              fill-opacity={eraseMouseIn ? "1" : "0.5"}
            />
          </svg>
          Erase
        </div>
      </div>
    </div>
  );
};

export default GenerativeBrush;
