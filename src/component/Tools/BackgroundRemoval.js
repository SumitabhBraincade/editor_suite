import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { updateCallRemoveBackground } from "../../redux/slices/sidebarSlice";
import {
  backgroundRemovalIcon,
  bgRemoveButtonIcon,
  outlineIcon,
} from "../../assets";

const BackgroundRemoval = () => {
  const [bgRemoveMouseIn, setBgRemoveMouseIn] = useState(false);

  const dispatch = useDispatch();

  const handleRemoveBackgroundClick = () => {
    dispatch(updateCallRemoveBackground(true));
  };

  return (
    <div className="pb-3 pt-6 px-5 flex flex-col items-start justify-between transition-all duration-200 hover:bg-[#171717]">
      <div className="flex gap-2 justify-start items-center">
        <img src={backgroundRemovalIcon}></img>
        <p className="text-xs font-medium text-[#fff]">Background Removal</p>
      </div>
      <div className="w-full flex mt-4">
        <div
          className={`h-10 w-[48%] m-[1%] text-xs font-light ${
            bgRemoveMouseIn ? "text-white" : "text-[#fdfdfd7e]"
          } flex gap-2 justify-center items-center bg-[#2729301f] border-[1px] border-[#242424] rounded cursor-pointer radial_gradient_bg`}
          onClick={handleRemoveBackgroundClick}
          onMouseEnter={() => setBgRemoveMouseIn(true)}
          onMouseLeave={() => setBgRemoveMouseIn(false)}
        >
          <svg
            width="17"
            height="16"
            viewBox="0 0 17 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clip-path="url(#clip0_1510_671)">
              <path
                d="M14.3353 2.89467C14.4515 3.02777 14.51 3.20152 14.4982 3.37777C14.4863 3.55401 14.4049 3.71834 14.272 3.83467L3.60534 13.168C3.53992 13.2285 3.46303 13.2753 3.37922 13.3056C3.29541 13.3359 3.20638 13.349 3.11739 13.3443C3.0284 13.3396 2.94126 13.3171 2.86111 13.2781C2.78097 13.2392 2.70946 13.1845 2.6508 13.1174C2.59214 13.0503 2.54752 12.9722 2.51959 12.8876C2.49166 12.8029 2.48097 12.7136 2.48817 12.6247C2.49537 12.5359 2.5203 12.4494 2.5615 12.3704C2.60269 12.2914 2.65931 12.2214 2.72801 12.1647L13.3947 2.83133C13.5278 2.7152 13.7015 2.65664 13.8778 2.66852C14.054 2.68039 14.219 2.76173 14.3353 2.89467ZM14.3353 7.14467C14.4515 7.27777 14.51 7.45152 14.4982 7.62777C14.4863 7.80401 14.4049 7.96834 14.272 8.08467L8.46267 13.1687C8.39675 13.2263 8.32012 13.2704 8.23715 13.2985C8.15418 13.3265 8.0665 13.3379 7.97913 13.3321C7.89175 13.3262 7.80637 13.3032 7.72788 13.2644C7.64939 13.2255 7.57932 13.1716 7.52167 13.1057C7.46402 13.0397 7.41992 12.9631 7.39189 12.8801C7.36385 12.7972 7.35244 12.7095 7.35829 12.6221C7.36414 12.5347 7.38714 12.4494 7.42598 12.3709C7.46483 12.2924 7.51875 12.2223 7.58467 12.1647L13.394 7.08133C13.4599 7.02362 13.5366 6.97948 13.6196 6.95143C13.7026 6.92338 13.7904 6.91197 13.8778 6.91785C13.9652 6.92373 14.0506 6.94679 14.1291 6.98571C14.2077 7.02463 14.2777 7.07865 14.3353 7.14467ZM13.394 10.998C13.5214 10.8849 13.6873 10.8249 13.8576 10.8302C14.0279 10.8356 14.1896 10.9059 14.3097 11.0268C14.4297 11.1477 14.4989 11.31 14.5031 11.4803C14.5072 11.6506 14.446 11.8161 14.332 11.9427L14.272 12.002L12.9387 13.1687C12.8111 13.2805 12.6456 13.3395 12.476 13.3336C12.3065 13.3277 12.1455 13.2573 12.026 13.1369C11.9065 13.0164 11.8374 12.8549 11.8328 12.6853C11.8282 12.5157 11.8885 12.3507 12.0013 12.224L12.0613 12.1647L13.394 10.998ZM9.47867 2.89467C9.59489 3.02769 9.65356 3.20139 9.64181 3.37763C9.63006 3.55387 9.54885 3.71825 9.41601 3.83467L3.60667 8.91867C3.54075 8.97632 3.46412 9.02042 3.38115 9.04845C3.29818 9.07649 3.21051 9.0879 3.12313 9.08205C3.03575 9.0762 2.95037 9.0532 2.87188 9.01436C2.79339 8.97551 2.72332 8.92159 2.66567 8.85567C2.60802 8.78974 2.56392 8.71311 2.53589 8.63014C2.50785 8.54717 2.49644 8.4595 2.50229 8.37212C2.50814 8.28474 2.53114 8.19937 2.56998 8.12088C2.60883 8.04239 2.66275 7.97232 2.72867 7.91467L8.53801 2.83133C8.67111 2.7152 8.84486 2.65664 9.02111 2.66852C9.19735 2.68039 9.36168 2.76173 9.47801 2.89467H9.47867ZM4.34667 2.83133C4.47428 2.71949 4.63972 2.66051 4.8093 2.66642C4.97888 2.67233 5.13982 2.74267 5.25933 2.86312C5.37885 2.98357 5.44793 3.14505 5.45252 3.31467C5.4571 3.48429 5.39684 3.64927 5.28401 3.776L5.22467 3.83533L3.60667 5.252C3.47969 5.36808 3.31274 5.43058 3.14074 5.42642C2.96875 5.42226 2.80502 5.35177 2.68379 5.22968C2.56257 5.10759 2.49324 4.94337 2.49029 4.77135C2.48735 4.59932 2.55103 4.43283 2.66801 4.30667L2.72801 4.24733L4.34667 2.83133Z"
                fill={bgRemoveMouseIn ? "#fff" : "#868686"}
              />
            </g>
            <defs>
              <clipPath id="clip0_1510_671">
                <rect
                  width="16"
                  height="16"
                  fill="white"
                  transform="translate(0.5)"
                />
              </clipPath>
            </defs>
          </svg>
          Remove BG
        </div>
        {/* <div className="h-10 w-[48%] m-[1%] text-xs font-light text-[#fdfdfd7e] flex gap-2 justify-center items-center bg-[#2729301f] border-[1px] border-[#242424] rounded cursor-pointer radial_gradient_bg">
          <img src={outlineIcon}></img>
          Outline
        </div> */}
      </div>
    </div>
  );
};

export default BackgroundRemoval;
