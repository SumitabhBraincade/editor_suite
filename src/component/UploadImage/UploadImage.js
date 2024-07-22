import React from "react";

const UploadImage = () => {
  return (
    <div
      className="w-[500px] h-[500px] -translate-x-[50%] border-[2px] border-dashed border-[#333333] bg-[#101010] rounded-lg"
      onClick={(e) => {
        e.stopPropagation();
      }}
    ></div>
  );
};

export default UploadImage;
