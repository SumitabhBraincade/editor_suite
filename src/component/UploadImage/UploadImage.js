import React, { useEffect, useState } from "react";
import downloadIcon from "../../assets/icon/download_icon.svg";
import linkIcon from "../../assets/icon/link_icon.svg";
import { useDispatch } from "react-redux";
import { updateCanvasImage } from "../../redux/slices/sidebarSlice";

const UploadImage = ({ setShow }) => {
  const [file, setFile] = useState(null);
  const [url, setUrl] = useState("");

  const dispatch = useDispatch();

  useEffect(() => {
    if (file) {
      const blobURL = URL.createObjectURL(file);
      dispatch(updateCanvasImage(blobURL));
      setShow(false);
    }
  }, [file]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUrlChange = (e) => {
    setUrl(e.target.value);
  };

  const handleAddImageUrl = () => {
    if (url != "") {
      dispatch(updateCanvasImage(url));
      setShow(false);
    }
  };

  return (
    <div
      className="w-1/3 h-[500px] flex flex-col justify-center items-center gap-6 border-[2px] border-dashed border-[#333333] bg-[#101010] rounded-lg"
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <div className="flex flex-col items-center relative gap-3 w-full">
        <div>
          <input
            type="file"
            className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
            onChange={handleFileChange}
          />
          <img src={downloadIcon}></img>
        </div>
        <p className="text-white">Drop your Image Here</p>
        <p className="text-xs font-light text-[#ffffff82]">
          Maximum file size: 10MB
        </p>
      </div>
      <p className="text-xs font-light text-[#ffffff82]">OR</p>
      <div className="flex flex-col items-center gap-3 w-full">
        <div className="cursor-pointer">
          <img src={linkIcon}></img>
        </div>
        <p className="text-white">Add an URL</p>
        <p className="text-xs font-light text-[#ffffff82]">
          Paste a link to any image URL
        </p>
        <div className="h-[40px] w-1/2 flex items-center gap-3 border-[1px] border-[#5C5C5C] rounded-lg px-3">
          <input
            className="flex-1 outline-none bg-transparent text-white text-sm font-light"
            placeholder="Add an URL"
            value={url}
            onChange={handleUrlChange}
          ></input>
          <div
            className="text-[#fff] text-sm font-light cursor-pointer"
            onClick={handleAddImageUrl}
          >
            Add
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadImage;
