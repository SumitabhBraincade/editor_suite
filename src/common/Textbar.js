import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  updateDrawPrompt,
  updateModifyPrompt,
} from "../redux/slices/sidebarSlice";

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
      <div
        className={`flex items-center gap-3 w-1/2 max-w-[600px] h-12 rounded-lg p-2 ${
          isInputFocused ? "bg-[#171717]" : "bg-[#101010]"
        } border-[1px] border-[#1C1C1C] hover:border-[#505050] ${
          isDraw ? "border-[#505050] shadow-3xl" : "border-[#1C1C1C]"
        } transition-all duration-200 hover:shadow-3xl`}
      >
        <div className="w-fit p-2 bg-[#2A2A2A] text-[#ffffff7c] rounded-lg text-xs font-medium cursor-pointer">
          {isDraw ? "DRAW" : "MODIFY"}
        </div>
        <div className="grow">
          <input
            className={`w-full h-[40px] bg-transparent outline-none ${
              isInputFocused ? "text-white" : "text-[#ffffff38]"
            } text-sm`}
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
          <div className="w-8 h-full">
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                class="path"
                d="M2.72391 2.05294C2.63778 2.0098 2.54103 1.99246 2.44528 2.003C2.34953 2.01355 2.25887 2.05152 2.18419 2.11236C2.10951 2.17321 2.05399 2.25432 2.02432 2.34597C1.99464 2.43761 1.99207 2.53587 2.01691 2.62894L3.51491 8.24694C3.53966 8.33958 3.59053 8.42315 3.66145 8.48769C3.73237 8.55223 3.82035 8.59501 3.91491 8.61094L10.7699 9.75294C11.0489 9.79994 11.0489 10.1999 10.7699 10.2469L3.91591 11.3889C3.82117 11.4047 3.73297 11.4474 3.66186 11.5119C3.59075 11.5765 3.53973 11.6602 3.51491 11.7529L2.01691 17.3709C1.99207 17.464 1.99464 17.5623 2.02432 17.6539C2.05399 17.7456 2.10951 17.8267 2.18419 17.8875C2.25887 17.9484 2.34953 17.9863 2.44528 17.9969C2.54103 18.0074 2.63778 17.9901 2.72391 17.9469L17.7239 10.4469C17.8069 10.4054 17.8766 10.3415 17.9253 10.2626C17.9741 10.1837 17.9999 10.0927 17.9999 9.99994C17.9999 9.90716 17.9741 9.81622 17.9253 9.73728C17.8766 9.65833 17.8069 9.59451 17.7239 9.55294L2.72391 2.05294Z"
                fill="white"
                fill-opacity={isInputFocused ? "1" : "0.5"}
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Textbar;
