import React, { useEffect, useRef, useState } from "react";
import {
  editorBgImage,
  redoIcon,
  undoIcon,
  cropIcon,
  rotateIcon,
  zoomInIcon,
  zoomOutIcon,
  horizontalFlipIcon,
  verticalFlipIcon,
  noIcon,
  yesIcon,
  arrowIcon,
} from "../../assets";
import Sidebar from "../Sidebar/Sidebar";
import Popup from "../../common/Popup";
import {
  updateCallArtStyle,
  updateCallRemoveBackground,
  updateCallSaveImage,
  updateCallUpscaler,
  updateCanvasImage,
  updateDraw,
  updateDrawPrompt,
  updateErase,
  updateHistory,
  updateModifyPrompt,
} from "../../redux/slices/sidebarSlice";
import { useDispatch, useSelector } from "react-redux";
import Textbar from "../../common/Textbar";
import { Cropper } from "react-cropper";
import "cropperjs/dist/cropper.css";
import UploadImage from "../UploadImage/UploadImage";
import axiosInstance from "../Utils/axios";
import convertToBlobUrl from "../Utils/convertToBlobUrl";
import { convertToBlob } from "../Utils/convertToBlob";
import HistoryCarousel from "../HistoryCarousel/HistoryCarousel";
import Cookies from "js-cookie";
import { Tooltip } from "@mui/material";

const Editor = () => {
  const cropperRef = useRef(null);
  const canvasRef = useRef(null);

  const [undoHistory, setUndoHistory] = useState([]);
  const [redoHistory, setRedoHistory] = useState([]);

  const [showBackPopup, setShowBackPopup] = useState(false);
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPromptBar, setShowPromptBar] = useState(false);
  const [promptValue, setPromptValue] = useState("");
  const [isCropEnabled, setIsCropEnabled] = useState(false);
  const [flipHorizontal, setFlipHorizontal] = useState(false);
  const [flipVertical, setFlipVertical] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isErasing, setIsErasing] = useState(false);
  const [isUpload, setIsUpload] = useState(false);
  const [context, setContext] = useState(null);
  const [downloadMouseIn, setDownloadMouseIn] = useState(false);

  const isDraw = useSelector((state) => state.sidebar.draw);
  const isErase = useSelector((state) => state.sidebar.erase);
  const artStyle = useSelector((state) => state.sidebar.artStyle);
  const callArtStyle = useSelector((state) => state.sidebar.callArtStyle);
  const callRemoveBackground = useSelector(
    (state) => state.sidebar.callRemoveBackground
  );
  const callSaveImage = useSelector((state) => state.sidebar.callSaveImage);
  const callUpscaler = useSelector((state) => state.sidebar.callUpscaler);
  const drawPrompt = useSelector((state) => state.sidebar.drawPrompt);
  const modifyPrompt = useSelector((state) => state.sidebar.modifyPrompt);
  const canvasImage = useSelector((state) => state.sidebar.canvasImage);

  const dispatch = useDispatch();

  const userToken = Cookies.get("userToken");

  const imageSuiteUrl = "/imageSuite";

  useEffect(() => {
    const fetchImageAsBlob = async () => {
      const imageUrl =
        "https://aicade-ui-assets.s3.amazonaws.com/default/88905d60-8075-4ab4-b8a4-1abd0b136f31/image_4_enemy_enemy_.png";
      try {
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        dispatch(updateCanvasImage(url));
      } catch (error) {
        console.error("Error fetching image:", error);
      }
    };

    fetchImageAsBlob();

    return () => {
      if (canvasImage) {
        URL.revokeObjectURL(canvasImage);
      }
    };
  }, []);

  const handleBackToEditorClick = () => {
    setShowBackPopup(!showBackPopup);
  };

  const handleDrawNoClick = () => {
    dispatch(updateDraw(false));
  };

  const handleDrawYesClick = () => {};

  useEffect(() => {
    if (isDrawingMode && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      const image = new Image();
      image.src = canvasImage;
      image.onload = () => {
        canvas.width = image.width;
        canvas.height = image.height;
        setContext(ctx);
      };
    }
  }, [isDrawingMode, canvasImage]);

  const getScaleFactors = () => {
    const canvas = canvasRef.current;
    const scaleX = canvas.width / canvas.offsetWidth;
    const scaleY = canvas.height / canvas.offsetHeight;
    return { scaleX, scaleY };
  };

  const startDrawing = (e) => {
    if (!context) return;
    const { scaleX, scaleY } = getScaleFactors();
    context.strokeStyle = "#000000";
    context.lineWidth = 100; // Directly set the line width

    setIsErasing(false);
    context.beginPath();
    context.moveTo(
      e.nativeEvent.offsetX * scaleX,
      e.nativeEvent.offsetY * scaleY
    );
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing || !context) return;
    const { scaleX, scaleY } = getScaleFactors();
    context.lineTo(
      e.nativeEvent.offsetX * scaleX,
      e.nativeEvent.offsetY * scaleY
    );
    context.stroke();
  };

  const stopDrawing = () => {
    if (isDrawing) {
      context.closePath();
      setIsDrawing(false);
      setShowPromptBar(true);
    }
  };

  const handleFill = () => {
    setIsDrawingMode(true);
    setIsErasing(false);
    if (context) {
      // context.strokeStyle = "rgba(0,0,0,1)";
      // context.lineWidth = 100; // Directly set the line width
      context.globalCompositeOperation = "source-over";
      // setIsErasing(true);
      // setIsDrawingMode(true);
    }
  };

  useEffect(() => {
    if (isDraw) {
      if (isErase) {
        handleErase();
      } else {
        handleFill();
      }
    } else {
      exitCanvas();
      dispatch(updateErase(false));
    }
  }, [isDraw, isErase]);

  const handleErase = () => {
    setIsDrawing(false);
    if (context) {
      context.strokeStyle = "rgba(0,0,0,1)";
      context.lineWidth = 100; // Directly set the line width
      context.globalCompositeOperation = "destination-out";
      setIsErasing(true);
      setIsDrawingMode(true);
    }
  };

  const exitCanvas = () => {
    setIsDrawingMode(false);
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    setShowPromptBar(false);
    setPromptValue("");
  };

  const saveToHistory = () => {
    const cropper = cropperRef.current.cropper;
    const imageData = cropper.getData();
    const history = { canvasImage, imageData };

    setUndoHistory((prevHistory) => {
      const newHistory = [...prevHistory, history];
      return newHistory;
    });

    setRedoHistory([]);
  };

  const handleUndo = () => {
    if (undoHistory.length > 0) {
      const prevState = undoHistory[undoHistory.length - 1];

      setUndoHistory((prevHistory) => prevHistory.slice(0, -1));
      setRedoHistory((prevHistory) => [...prevHistory, prevState]);

      const cropper = cropperRef.current.cropper;
      dispatch(updateCanvasImage(prevState.canvasImage));
      cropper.setData(prevState.imageData);
    }
  };

  const handleRedo = () => {
    if (redoHistory.length > 0) {
      const nextState = redoHistory[redoHistory.length - 1];

      const cropper = cropperRef.current.cropper;
      dispatch(updateCanvasImage(nextState.canvasImage));
      cropper.setData(nextState.imageData);

      setRedoHistory((prevHistory) => prevHistory.slice(0, -1));
      setUndoHistory((prevHistory) => [...prevHistory, nextState]);
    }
  };

  const createEditedAsset = () => {
    if (cropperRef.current) {
      const dataUrl = cropperRef.current.cropper
        .getCroppedCanvas()
        .toDataURL("image/png");
      dispatch(updateCanvasImage(dataUrl));
    }
  };

  const handleCropOkay = () => {
    saveToHistory();
    createEditedAsset();
  };

  const handleZoomIn = () => {
    exitCanvas();
    cropperRef.current.cropper.zoom(0.1);
  };

  const handleZoomOut = () => {
    exitCanvas();
    cropperRef.current.cropper.zoom(-0.1);
  };

  const handleRotateRight = () => {
    exitCanvas();
    saveToHistory();
    cropperRef.current.cropper.rotate(90);
    createEditedAsset();
  };

  const handleFlipHorizontal = () => {
    exitCanvas();
    saveToHistory();
    const scaleX = flipHorizontal ? 1 : -1;
    cropperRef.current.cropper.scaleX(scaleX);
    setFlipHorizontal(!flipHorizontal);
    createEditedAsset();
  };

  const handleFlipVertical = () => {
    exitCanvas();
    saveToHistory();
    const scaleY = flipVertical ? 1 : -1;
    cropperRef.current.cropper.scaleY(scaleY);
    setFlipVertical(!flipVertical);
    createEditedAsset();
  };

  const disableCrop = () => {
    const cropper = cropperRef.current.cropper;
    setIsCropEnabled(false);
    cropper.clear();
    cropper.setDragMode("move");
  };

  const enableCrop = () => {
    exitCanvas();
    const cropper = cropperRef.current.cropper;
    if (isCropEnabled) {
      disableCrop();
      return;
    }

    setIsCropEnabled(true);
    cropper.crop();
    cropper.setDragMode("crop");
    cropper.setCropBoxData({
      left: 15, // Set the left position
      top: 15, // Set the top position
      width: 200, // Set the width
      height: 200, // Set the height
    });
  };

  const handleUploadImageClick = () => {
    setIsUpload(true);
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = canvasImage;
    link.download = "downloaded_image.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleArtStyle = async (style) => {
    saveToHistory();
    if (cropperRef.current) {
      setIsLoading(true);
      const canvas = cropperRef.current.cropper.getCroppedCanvas();
      canvas.toBlob(async (blob) => {
        const formData = new FormData();
        formData.append("image_file", blob, "canvas_image.png");
        formData.append("image_name", "canvas_image.png");
        formData.append("art_type", style);

        try {
          const response = await axiosInstance.post(
            imageSuiteUrl + "/art_style",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
                accept: "application/json",
                Authorization: `Bearer ${userToken}`,
              },
            }
          );
          const blobURL = await convertToBlobUrl(response.data.data.url);
          dispatch(updateCanvasImage(blobURL));
          setIsLoading(false);
        } catch (error) {
          console.error("Error uploading file:", error);
          setIsLoading(false);
        }
      }, "image/png");
    }
  };

  const handleRemoveBackground = async () => {
    saveToHistory();
    setIsLoading(true);
    if (cropperRef.current) {
      const canvas = cropperRef.current.cropper.getCroppedCanvas();
      canvas.toBlob(async (blob) => {
        const formData = new FormData();
        formData.append("image_file", blob, "canvas_image.png");
        formData.append("image_name", "canvas_image.png");

        try {
          const response = await axiosInstance.post(
            imageSuiteUrl + "/bg-remove",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
                accept: "application/json",
                Authorization: `Bearer ${userToken}`,
              },
              responseType: "arraybuffer",
            }
          );

          const arrayBufferView = new Uint8Array(response.data);
          const blob = new Blob([arrayBufferView], { type: "image/png" });
          const url = URL.createObjectURL(blob);
          dispatch(updateCanvasImage(url));
        } catch (error) {
          console.error("Error uploading file:", error);
        }
        dispatch(updateCallRemoveBackground(false));
        setIsLoading(false);
      }, "image/png");
    }
  };

  const convertCanvasToBlobURL = (canvasRef) => {
    if (canvasRef.current) {
      const tempCanvas = document.createElement("canvas");
      const tempCtx = tempCanvas.getContext("2d");

      tempCanvas.width = canvasRef.current.width;
      tempCanvas.height = canvasRef.current.height;

      tempCtx.fillStyle = "#FFFFFF";
      tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

      tempCtx.drawImage(canvasRef.current, 0, 0);

      const dataUrl = tempCanvas.toDataURL("image/png");
      return dataUrl;
    }
  };

  const base64ToBlob = async (base64) => {
    const response = await fetch(base64);
    const blob = await response.blob();
    return blob;
  };

  const callGenerativeFillAPI = async () => {
    saveToHistory();
    setIsLoading(true);

    let originalAsset = canvasImage;
    let invertedImage = convertCanvasToBlobURL(canvasRef);

    const formData = new FormData();

    const originalAssetBlob = await base64ToBlob(originalAsset);
    const invertedImageBlob = await base64ToBlob(invertedImage);

    formData.append("image_file", originalAssetBlob, "originalAsset.png");
    formData.append("image_name", "originalAsset.png");
    formData.append("mask_image_file", invertedImageBlob, "invertedImage.png");
    formData.append("mask_image_name", "invertedImage.png");
    formData.append("prompt", drawPrompt);

    try {
      setShowPromptBar(false);
      setPromptValue("");
      const response = await axiosInstance.post(
        imageSuiteUrl + "/generative_art",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            accept: "application/json",
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      const url = response.data.data.url;
      const blobURL = await convertToBlobUrl(url);
      dispatch(updateCanvasImage(blobURL));
    } catch (error) {
      console.error("Error uploading file:", error);
    }
    setIsLoading(false);
  };

  const handleUpScalerClick = async () => {
    saveToHistory();
    setIsLoading(true);
    if (cropperRef.current) {
      const canvas = cropperRef.current.cropper.getCroppedCanvas();
      canvas.toBlob(async (blob) => {
        const formData = new FormData();
        formData.append("image_file", blob, "canvas_image.png");
        formData.append("image_name", "canvas_image.png");

        try {
          const response = await axiosInstance.post(
            imageSuiteUrl + "/upscaler",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
                accept: "application/json",
              },
              responseType: "arraybuffer",
            }
          );

          const url = response.data.data.url;
          const blobURL = await convertToBlobUrl(url);
          dispatch(updateCanvasImage(blobURL));
        } catch (error) {
          console.error("Error uploading file:", error);
        }
        dispatch(updateCallUpscaler(false));
        setIsLoading(false);
      }, "image/png");
    }
  };

  const callOutlineAPI = async () => {
    saveToHistory();
    setIsLoading(true);

    let originalAsset = canvasImage;
    let invertedImage = convertCanvasToBlobURL(canvasRef);
    originalAsset = await convertToBlob(originalAsset);
    invertedImage = await convertToBlob(invertedImage);

    const formData = new FormData();
    formData.append("image_file", originalAsset, "originalAsset.png");
    formData.append("image_name", "originalAsset.png");

    try {
      const response = await axiosInstance.post(
        imageSuiteUrl + "/outline",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            accept: "application/json",
            Authorization: `Bearer ${userToken}`,
          },
          responseType: "arraybuffer",
        }
      );

      const url = response.data.data.url;
      const blobURL = await convertToBlobUrl(url);
      dispatch(updateCanvasImage(blobURL));
    } catch (error) {
      console.error("Error uploading file:", error);
    }
    setIsLoading(false);
  };

  const saveAsset = async () => {
    setIsLoading(true);

    let originalAsset = canvasImage;
    originalAsset = await convertToBlob(originalAsset);

    const formData = new FormData();
    formData.append("image_file", originalAsset, "originalAsset.png");
    formData.append("image_name", "originalAsset.png");

    try {
      const response = await axiosInstance.post(
        imageSuiteUrl + "/save",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            accept: "application/json",
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      setIsLoading(false);
    } catch (error) {
      console.error("Error during API call:", error);
      setIsLoading(false);
    }
  };

  const getHistory = async () => {
    try {
      const response = await axiosInstance.get(imageSuiteUrl + "/history", {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${userToken}`,
        },
      });

      dispatch(updateHistory(response.data.data));
    } catch (error) {
      console.error("Error during API call:", error);
    }
  };

  useEffect(() => {
    if (callSaveImage) {
      saveAsset();
      dispatch(updateCallSaveImage(false));
    }
    getHistory();
  }, [callSaveImage]);

  const iterateAsset = async () => {
    saveToHistory();
    setIsLoading(true);

    let originalAsset = canvasImage;
    let invertedImage = convertCanvasToBlobURL(canvasRef);
    originalAsset = await convertToBlob(originalAsset);
    invertedImage = await convertToBlob(invertedImage);

    const formData = new FormData();
    formData.append("image_file", originalAsset, "originalAsset.png");
    formData.append("image_name", "originalAsset.png");
    formData.append("iteration_type", "modify");
    formData.append("prompt", modifyPrompt);
    formData.append("old_prompt", " ");

    try {
      const response = await axiosInstance.post(
        imageSuiteUrl + "/iterate/image",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            accept: "application/json",
          },
        }
      );

      const url = response.data.data.url;
      const blobURL = await convertToBlobUrl(url);
      dispatch(updateCanvasImage(blobURL));
      setIsLoading(false);
    } catch (error) {
      console.error("Error during API call:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (callArtStyle) {
      handleArtStyle(artStyle);
      dispatch(updateCallArtStyle(false));
    }
    if (callRemoveBackground) {
      handleRemoveBackground();
    }
    if (drawPrompt.length != 0) {
      callGenerativeFillAPI();
      dispatch(updateDraw(false));
      dispatch(updateDrawPrompt(""));
    }
    if (modifyPrompt) {
      iterateAsset();
      dispatch(updateModifyPrompt(""));
    }
    if (callUpscaler) {
      handleUpScalerClick();
    }
  }, [
    callArtStyle,
    callRemoveBackground,
    drawPrompt,
    modifyPrompt,
    callUpscaler,
  ]);

  return (
    <div
      className={`w-screen h-screen relative flex bg-[#0D0D0D] p-3 ${
        isDraw ? "draw_cursor" : ""
      } ${isErase ? "erase_cursor " : ""}`}
    >
      <div
        className="w-3/4 h-full bg-cover bg-center bg-no-repeat flex flex-col"
        style={{
          backgroundImage: `url(${editorBgImage})`,
        }}
      >
        <div className="flex justify-between items-center pr-4 backdrop-blur-sm">
          <div className="flex gap-2 items-center">
            <p className="text-white font-semibold">aicade</p>
            <div className="w-1 h-1 bg-[#ffffff78] rounded-full"></div>
            <p className="uppercase text-sm font-extralight text-[#ffffff78]">
              Image Editor
            </p>
          </div>
          {/* <div
            className="relative p-2 flex gap-2 bg-[#101010] border-[1px] border-[#1C1C1C] text-[#ffffff7c] rounded-lg text-xs font-medium cursor-pointer hover:bg-[#444444] transition-all duration-200"
            onClick={handleBackToEditorClick}
          >
            <img src={arrowIcon}></img>
            Back to Editor
            <Popup
              componentStyle={`${
                showBackPopup
                  ? "w-[350px] h-fit top-[40px]  left-5 bg-[#101010] border-[1px] border-[#1C1C1C] rounded-lg"
                  : "w-0 h-0"
              }`}
              onClose={true}
            >
              <div
                className={`${
                  showBackPopup ? "flex flex-col items-start" : "hidden"
                } p-4 gap-2`}
              >
                <p className="font-medium text-white">
                  Changes made will be lost!
                </p>
                <p className="font-light text-sm text-[#ffffff7e]">
                  Are you sure you want to discard and go back?
                </p>
                <div className="flex w-full gap-2">
                  <div
                    className="h-10 w-1/2 text-xs font-medium text-[#FDFDFD] flex justify-center items-center bg-[#2729301f] border-[1px] border-[#515151] rounded cursor-pointer transition-all duration-200 hover:bg-[#333333]"
                    onClick={() => {
                      setShowBackPopup(false);
                    }}
                  >
                    No, stay
                  </div>
                  <div className="h-10 w-1/2 text-xs font-medium text-[#878787] flex justify-center items-center bg-[#2729301f] border-[1px] border-[#1C1C1C] rounded cursor-pointer transition-all duration-200 hover:bg-[#333333]">
                    Yes, discard
                  </div>
                </div>
              </div>
            </Popup>
          </div> */}
          <div
            className="relative p-2 bg-[#101010] flex items-center gap-1 border-[1px] border-[#1C1C1C] text-[#ffffff7c] hover:text-white rounded-lg text-xs font-medium cursor-pointer hover:bg-[#444444]"
            onClick={handleDownload}
            onMouseEnter={() => setDownloadMouseIn(true)}
            onMouseLeave={() => setDownloadMouseIn(false)}
          >
            <svg
              width="20"
              height="16"
              viewBox="0 0 61 61"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18 30.5L30.5 43M30.5 43L43 30.5M30.5 43V10.5M15.5 50.5H45.5"
                stroke={downloadMouseIn ? "#fff" : "#ffffff7c"}
                stroke-width="6"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            Download
          </div>
        </div>
        <div className="flex justify-center items-center flex-col flex-1 backdrop-blur-sm">
          <div className="">
            <div className="h-8 mb-8 relative">
              <Popup
                componentStyle={
                  isCropEnabled
                    ? `w-full top-0 left-0 transition-all duration-500 rounded-lg`
                    : `w-0 h-40px`
                }
                onClose={true}
              >
                <div
                  className={`${
                    isCropEnabled ? "flex" : "hidden"
                  } items-center justify-between overflow-hidden`}
                >
                  <div className="text-[#ffffff85] font-light text-sm">
                    Crop Image
                  </div>
                  <div className="flex">
                    <Tooltip title="Apply" placement="top">
                      <div
                        className="flex justify-center items-center h-9 w-9 bg-[#101010] border-[1px] rounded-l-lg border-[#1C1C1C] cursor-pointer hover:bg-[#444444] transition-all duration-200"
                        onClick={handleCropOkay}
                      >
                        <img src={yesIcon} width="15px"></img>
                      </div>
                    </Tooltip>
                    <Tooltip title="Close Crop" placement="top">
                      <div
                        className="flex justify-center items-center h-9 w-9 bg-[#101010] border-[1px] rounded-r-lg border-[#1C1C1C] cursor-pointer hover:bg-[#444444] transition-all duration-200"
                        onClick={enableCrop}
                      >
                        <img src={noIcon} width="12px"></img>
                      </div>
                    </Tooltip>
                  </div>
                </div>
              </Popup>
              <Popup
                componentStyle={
                  isDraw
                    ? `w-full top-0 left-0 transition-all duration-500 rounded-lg`
                    : `w-0 h-40px`
                }
                onClose={true}
              >
                <div
                  className={`${
                    isDraw ? "flex" : "hidden"
                  } items-center justify-between overflow-hidden`}
                >
                  <div className={`${isDraw ? "flex" : "hidden"}`}>
                    <div className="text-[#ffffff85] font-light text-left text-sm">
                      Draw on the Image and prompt below to generate art
                    </div>
                    <div className="flex">
                      <Tooltip title="Apply" placement="top">
                        <div
                          className="flex justify-center items-center h-9 w-9 bg-[#101010] border-[1px] rounded-l-lg border-[#1C1C1C] cursor-pointer hover:bg-[#444444] transition-all duration-200"
                          onClick={handleDrawYesClick}
                        >
                          <img src={yesIcon} width="15px"></img>
                        </div>
                      </Tooltip>
                      <Tooltip title="Close Draw" placement="top">
                        <div
                          className="flex justify-center items-center h-9 w-9 bg-[#101010] border-[1px] rounded-r-lg border-[#1C1C1C] cursor-pointer hover:bg-[#444444] transition-all duration-200"
                          onClick={handleDrawNoClick}
                        >
                          <img src={noIcon} width="12px"></img>
                        </div>
                      </Tooltip>
                    </div>
                  </div>
                </div>
              </Popup>
              {!isCropEnabled && !isDraw && (
                <div className="flex justify-between items-center">
                  <div className="flex">
                    <Tooltip title="Undo" placement="top">
                      <div
                        className="flex justify-center items-center h-8 w-8 bg-[#101010] border-[1px] rounded-l-md border-[#333333] cursor-pointer hover:bg-[#444444] transition-all duration-200"
                        onClick={handleUndo}
                      >
                        <img src={undoIcon} width="12px"></img>
                      </div>
                    </Tooltip>
                    <Tooltip title="Redo" placement="top">
                      <div
                        className="flex justify-center items-center h-8 w-8 bg-[#101010] border-[1px] rounded-r-md border-[#333333] cursor-pointer hover:bg-[#444444] transition-all duration-200"
                        onClick={handleRedo}
                      >
                        <img src={redoIcon} width="12px"></img>
                      </div>
                    </Tooltip>
                  </div>
                  <div className="flex">
                    <Tooltip title="Crop" placement="top">
                      <div
                        className="flex justify-center items-center h-8 w-8 bg-[#101010] border-[1px] rounded-l-md border-[#333333] cursor-pointer hover:bg-[#444444] transition-all duration-200"
                        onClick={enableCrop}
                      >
                        <img src={cropIcon} width="12px"></img>
                      </div>
                    </Tooltip>
                    <Tooltip title="Rotate" placement="top">
                      <div
                        className="flex justify-center items-center h-8 w-8 bg-[#101010] border-[1px] border-[#333333] cursor-pointer hover:bg-[#444444] transition-all duration-200"
                        onClick={handleRotateRight}
                      >
                        <img src={rotateIcon} width="12px"></img>
                      </div>
                    </Tooltip>
                    <Tooltip title="Zoom In" placement="top">
                      <div
                        className="flex justify-center items-center h-8 w-8 bg-[#101010] border-[1px] border-[#333333] cursor-pointer hover:bg-[#444444] transition-all duration-200"
                        onClick={handleZoomIn}
                      >
                        <img src={zoomInIcon} width="12px"></img>
                      </div>
                    </Tooltip>
                    <Tooltip title="Zoom Out" placement="top">
                      <div
                        className="flex justify-center items-center h-8 w-8 bg-[#101010] border-[1px] border-[#333333] cursor-pointer hover:bg-[#444444] transition-all duration-200"
                        onClick={handleZoomOut}
                      >
                        <img src={zoomOutIcon} width="12px"></img>
                      </div>
                    </Tooltip>
                    <Tooltip title="Flip Horizontal" placement="top">
                      <div
                        className="flex justify-center items-center h-8 w-8 bg-[#101010] border-[1px] border-[#333333] cursor-pointer hover:bg-[#444444] transition-all duration-200"
                        onClick={handleFlipHorizontal}
                      >
                        <img src={horizontalFlipIcon} width="12px"></img>
                      </div>
                    </Tooltip>
                    <Tooltip title="Flip Vertical" placement="top">
                      <div
                        className="flex justify-center items-center h-8 w-8 bg-[#101010] border-[1px] rounded-r-md border-[#333333] cursor-pointer hover:bg-[#444444] transition-all duration-200"
                        onClick={handleFlipVertical}
                      >
                        <img src={verticalFlipIcon} width="12px"></img>
                      </div>
                    </Tooltip>
                  </div>
                </div>
              )}
            </div>
            <div
              className={`w-[350px] h-[350px]`}
              style={{ position: "relative" }}
            >
              <Cropper
                ref={cropperRef}
                src={canvasImage}
                style={{ height: "350px", width: "350px" }}
                aspectRatio={1}
                guides={true}
                ready={() => disableCrop()}
              />
              <div
                className={`z-10 flex justify-center items-center transition-all absolute top-0 backdrop-blur-sm left-0 duration-200 ${
                  isLoading
                    ? "h-full w-full bg-[#121212c7] opacity-100"
                    : "h-full w-0 opacity-0"
                }`}
              >
                <div
                  className={`flex flex-col gap-3 justify-center items-center ${
                    !isLoading ? "hidden" : "flex"
                  }`}
                >
                  <div
                    className="w-10 h-10 rounded-full animate-spin"
                    style={{
                      border: "4px solid #616161",
                      borderBottomColor: "transparent",
                    }}
                  ></div>
                  <div className="text-white">Wait while we cook</div>
                </div>
              </div>
              <div className={`${isDrawingMode ? "block" : "hidden"}`}>
                <canvas
                  ref={canvasRef}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    zIndex: 1,
                  }}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                />
              </div>
            </div>
          </div>
        </div>
        <Textbar isDraw={isDraw} />
      </div>
      <Sidebar />
      <Popup
        componentStyle={`transition-all duration-200 ${
          isUpload ? "w-screen h-screen opacity-100" : "w-0 h-screen opacity-0"
        } flex justify-center items-center top-0 left-0 bg-[#0e0e0eba] backdrop-blur-sm`}
        setShow={setIsUpload}
      >
        {isUpload && <UploadImage setShow={setIsUpload} />}
      </Popup>
      <HistoryCarousel handleUploadImageClick={handleUploadImageClick} />
    </div>
  );
};

export default Editor;
