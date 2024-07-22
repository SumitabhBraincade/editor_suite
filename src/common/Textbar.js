import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ReactSVG } from "react-svg";
import {
  updateDrawPrompt,
  updateModifyPrompt,
} from "../redux/slices/sidebarSlice";

const SendIcon = () => {
  return (
    <div className="icon-container w-8 h-full">
      <ReactSVG
        src={require("../assets/icon/send_icon.svg").default}
        className="sendIcon"
      />
    </div>
  );
};

const Textbar = ({ isDraw }) => {
  const [isInputFocused, setInputFocused] = useState(false);
  const [promptValue, setPromptValue] = useState("");

  const dispatch = useDispatch();

  const handleInputFocus = () => {
    setInputFocused(true);
  };

  const handleInputBlur = () => {
    setInputFocused(false);
  };

  const handleSendClick = () => {
    if (isDraw) {
      dispatch(updateDrawPrompt(promptValue));
      setPromptValue("");
    } else {
      dispatch(updateModifyPrompt(promptValue));
      setPromptValue("");
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSendClick();
    }
  };

  return (
    <div className="w-full h-14 mb-4 flex justify-center items-center">
      <div className="flex items-center gap-3 w-1/2 h-12 rounded-lg p-2 bg-[#101010] border-[1px] border-[#1C1C1C]">
        <div className="w-fit p-2 bg-[#2A2A2A] text-[#ffffff7c] rounded-lg text-xs font-medium cursor-pointer">
          {isDraw ? "DRAW" : "MODIFY"}
        </div>
        <div className="grow">
          <input
            className="w-full bg-transparent outline-none text-[#ffffff38] text-sm"
            placeholder={
              isInputFocused
                ? ""
                : isDraw
                ? "/ Prompt to generate on the painted area"
                : "/ Change the Image asset by giving a prompt"
            }
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            value={promptValue}
            onChange={(e) => setPromptValue(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e)}
          ></input>
        </div>
        <div
          className="flex justify-center items-center cursor-pointer"
          onClick={handleSendClick}
        >
          <SendIcon />
        </div>
      </div>
    </div>
  );
};

export default Textbar;
