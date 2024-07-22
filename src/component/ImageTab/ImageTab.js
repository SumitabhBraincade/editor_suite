import React from "react";
import ArtStyle from "../Tools/ArtStyle";
import GenerativeBrush from "../Tools/GenerativeBrush";
import ImageUpscaler from "../Tools/ImageUpscaler";
import BackgroundRemoval from "../Tools/BackgroundRemoval";

const ImageTab = () => {
  return (
    <div className="w-full overflow-y-scroll no_scroll">
      <ArtStyle />
      <GenerativeBrush />
      <ImageUpscaler />
      <BackgroundRemoval />
    </div>
  );
};

export default ImageTab;
