import React from "react";

const Popup = ({ children, componentStyle, show, setShow, onClose }) => {
  return (
    <div
      className={`absolute z-20 ${componentStyle}`}
      onClick={(e) => {
        onClose ? e.stopPropagation() : setShow(false);
      }}
    >
      {children}
    </div>
  );
};

export default Popup;
