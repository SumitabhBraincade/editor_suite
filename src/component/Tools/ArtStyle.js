import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  updateArtStyle,
  updateCallArtStyle,
} from "../../redux/slices/sidebarSlice";
import artStyleIcon from "../../assets/icon/art_style_icon.svg";
import { animeBg } from "../../assets";

const ArtStyle = () => {
  const dispatch = useDispatch();

  const artStyle = useSelector((state) => state.sidebar.artStyle);

  const artStyleArray = [
    {
      id: 1,
      name: "Animated",
      tag: "anime",
      bgImage: animeBg,
    },
    {
      id: 2,
      name: "Pixelated",
      tag: "pixelated",
    },
    {
      id: 3,
      name: "2D",
      tag: "2d-flat",
    },
    {
      id: 4,
      name: "Noir",
      tag: "noir",
    },
    {
      id: 5,
      name: "Poly",
      tag: "poly",
    },
  ];

  const handleApplyStyleClick = () => {
    dispatch(updateCallArtStyle(true));
  };

  const handleArtStyleClick = (each) => {
    if (each.tag === artStyle) {
      dispatch(updateArtStyle(""));
    } else {
      dispatch(updateArtStyle(each.tag));
    }
  };

  return (
    <div
      className={`border-b h-fit border-[#242424] pb-3 pt-6 px-5 flex flex-col items-start justify-between transition-all duration-200 ${artStyle === "" ? "" : "bg-[#171717]"}`}
    >
      <div className="flex gap-2 justify-start items-center">
        <img src={artStyleIcon}></img>
        <p className="text-xs font-medium text-[#fff]">Art Style</p>
      </div>
      <p className="text-[10px] font-medium text-[#ffffff5a] py-2">
        Select any one style
      </p>
      <div className="w-full h-fit flex flex-wrap">
        {artStyleArray.map((each) => (
          <div
            key={each.id}
            className={`h-10 w-[31%] m-[1%] relative border-[1px] rounded cursor-pointer hover:bg-[#444444] overflow-hidden bg-contain bg-center ${
              artStyle === each.tag
                ? "border-[#A1A1A1] text-white"
                : "border-[#242424]"
            }`}
            style={{ backgroundImage: `url(${each.bgImage})` }}
            onClick={() => handleArtStyleClick(each)}
          >
            <div className="h-full w-full text-xs font-light text-[#fdfdfd7e] bg-[#272930a0] hover:bg-[#27293035] hover:text-white hover:scale-x-110 flex justify-center items-center transition-all duration-200">
              {each.name}
            </div>
          </div>
        ))}
      </div>
      <div
        className={`w-full transition-all duration-200 ${
          artStyle === "" ? "h-0" : "h-10 mt-2"
        }`}
      >
        <div
          className={`w-full h-full ${
            artStyle === "" ? "hidden" : "flex"
          } text-[#fdfdfd7e] hover:text-white text-xs font-light justify-center items-center bg-[#2729301f] border-[1px] border-[#242424] rounded cursor-pointer transition-all duration-200 radial_gradient_bg`}
          onClick={handleApplyStyleClick}
        >
          Apply Style
        </div>
      </div>
    </div>
  );
};

export default ArtStyle;
