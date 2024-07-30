import React from "react";

const Alert = ({ message }) => {
  return (
    <div
      className={`absolute ${
        message ? "top-2" : "-top-20"
      } flex left-[20%] min-h-[50px] items-center px-3 h-fit w-[500px] rounded-lg bg-[#171717] hover:bg-[#242424] border-[2px] border-[#f72929] transition-all duration-200 cursor-pointer`}
    >
      <div className="text-[#f72929] font-medium">{message}</div>
    </div>
  );
};

export default Alert;
