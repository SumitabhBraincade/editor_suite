"use client";

import React, { useRef } from "react";
import { arrowIcon, addIcon } from "../../assets";
import { useDispatch, useSelector } from "react-redux";
import { updateCanvasImage } from "../../redux/slices/sidebarSlice";

const HistoryCarousel = ({ handleUploadImageClick }) => {
  const scrollableContainerRef = useRef(null);

  const dispatch = useDispatch();

  const history = useSelector((state) => state.sidebar.history);

  const handleDownArrow = () => {
    if (scrollableContainerRef.current) {
      scrollableContainerRef.current.scrollBy({
        top: 336,
        behavior: "smooth",
      });
    }
  };

  const handleUpArrow = () => {
    if (scrollableContainerRef.current) {
      scrollableContainerRef.current.scrollBy({
        top: -336,
        behavior: "smooth",
      });
    }
  };

  const handleImageClick = (each) => {
    dispatch(updateCanvasImage(each.url));
  };

  return (
    <div className="absolute flex flex-col gap-2 top-[50%] -translate-y-[50%] left-2 max-h-[360px] w-fit">
      <div
        className="flex items-center justify-center w-full h-[30px] rounded-lg bg-[#171717] hover:bg-[#242424] border-[1px] border-[#1C1C1C] cursor-pointer"
        onClick={handleUpArrow}
      >
        <img className="rotate-90" src={arrowIcon}></img>
      </div>
      <div
        className="h-full w-full flex flex-col gap-3 overflow-hidden"
        ref={scrollableContainerRef}
      >
        <div
          className="size-[100px] min-h-[100px] flex justify-center items-center transition-all duration-200 bg-[#171717] hover:bg-[#242424] border-[1px] border-[#1C1C1C] rounded-lg cursor-pointer"
          onClick={handleUploadImageClick}
        >
          <img src={addIcon}></img>
        </div>
        {history.map((each, index) => (
          <div
            key={index}
            className="size-[100px] min-h-[100px] transition-all duration-200 bg-[#171717] hover:bg-[#242424] border-[1px] border-[#1C1C1C] rounded-lg cursor-pointer bg-cover bg-no-repeat"
            style={{ backgroundImage: `url(${each.url})` }}
            onClick={() => handleImageClick(each)}
          ></div>
        ))}
      </div>
      <div
        className="flex items-center justify-center w-full h-[30px] rounded-lg bg-[#171717] hover:bg-[#242424] border-[1px] border-[#1C1C1C] cursor-pointer"
        onClick={handleDownArrow}
      >
        <img className="-rotate-90" src={arrowIcon}></img>
      </div>
    </div>
  );
};

export default HistoryCarousel;
