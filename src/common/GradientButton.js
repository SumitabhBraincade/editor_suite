import React from "react";

const GradientButton = ({
  containerStyle,
  titleStyle,
  titleInlineStyle,
  title,
  handleOnClick,
}) => {
  return (
    <div
      className={`relative bg-white rounded cursor-pointer ${containerStyle}`}
      style={{
        backgroundImage: `
  linear-gradient(
    to right,
    #FA699C 0%,
    #E365E8 22%,
    #5086F9 49%,
    #96E489 75%,
    #F8C047 99%
  )
`,
      }}
      onClick={handleOnClick}
    >
      <div
        className={`absolute flex justify-center items-center top-[2px] left-[2px] rounded bg-white text-sm font-medium ${titleStyle}`}
        style={titleInlineStyle}
      >
        {title}
      </div>
    </div>
  );
};

export default GradientButton;
