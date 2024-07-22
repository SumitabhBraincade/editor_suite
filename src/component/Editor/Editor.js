import React, { useEffect, useRef, useState } from "react";
import editorBgImage from "../../assets/image/editor_bg_image.png";
import demoImage from "../../assets/image/demo_image.png";
import redoIcon from "../../assets/icon/redo_icon.svg";
import undoIcon from "../../assets/icon/undo_icon.svg";
import cropIcon from "../../assets/icon/crop_icon.svg";
import rotateIcon from "../../assets/icon/rotate_icon.svg";
import zoomInIcon from "../../assets/icon/zoom_in_icon.svg";
import zoomOutIcon from "../../assets/icon/zoom_out_icon.svg";
import horizontalFlipIcon from "../../assets/icon/horizontal_flip_icon.svg";
import verticalFlipIcon from "../../assets/icon/vertical_flip_icon.svg";
import noIcon from "../../assets/icon/no_icon.svg";
import yesIcon from "../../assets/icon/yes_icon.svg";
import Sidebar from "../Sidebar/Sidebar";
import Popup from "../../common/Popup";
import sidebar, {
  updateCallArtStyle,
  updateCallRemoveBackground,
  updateDraw,
  updateDrawPrompt,
  updateErase,
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

const Editor = () => {
  const cropperRef = useRef(null);
  const canvasRef = useRef(null);

  const [undoHistory, setUndoHistory] = useState([]);
  const [redoHistory, setRedoHistory] = useState([]);

  const [showBackPopup, setShowBackPopup] = useState(false);
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [canvasImage, setCanvasImage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPromptBar, setShowPromptBar] = useState(false);
  const [promptValue, setPromptValue] = useState("");
  const [isCropEnabled, setIsCropEnabled] = useState(false);
  const [flipHorizontal, setFlipHorizontal] = useState(false);
  const [flipVertical, setFlipVertical] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isErasing, setIsErasing] = useState(false);
  const [upScallerbuttonClicked, setUpScallerButtonClicked] = useState(false);
  const [isUpload, setIsUpload] = useState(false);
  const [context, setContext] = useState(null);

  const isDraw = useSelector((state) => state.sidebar.draw);
  const isErase = useSelector((state) => state.sidebar.erase);
  const artStyle = useSelector((state) => state.sidebar.artStyle);
  const callArtStyle = useSelector((state) => state.sidebar.callArtStyle);
  const callRemoveBackground = useSelector(
    (state) => state.sidebar.callRemoveBackground
  );
  const drawPrompt = useSelector((state) => state.sidebar.drawPrompt);
  const modifyPrompt = useSelector((state) => state.sidebar.modifyPrompt);

  const dispatch = useDispatch();

  const imageSuiteUrl = "/imageSuite";

  useEffect(() => {
    const fetchImageAsBlob = async () => {
      const imageUrl =
        "https://aicade-ui-assets.s3.amazonaws.com/default/88905d60-8075-4ab4-b8a4-1abd0b136f31/image_4_enemy_enemy_.png";
      try {
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setCanvasImage(url);
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
      setCanvasImage(prevState.canvasImage);
      cropper.setData(prevState.imageData);
    }
  };

  const handleRedo = () => {
    if (redoHistory.length > 0) {
      const nextState = redoHistory[redoHistory.length - 1];

      const cropper = cropperRef.current.cropper;
      setCanvasImage(nextState.canvasImage);
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
      setCanvasImage(dataUrl);
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
              },
            }
          );
          const blobURL = await convertToBlobUrl(response.data.data.url);
          setCanvasImage(blobURL);
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
              },
              responseType: "arraybuffer",
            }
          );

          const arrayBufferView = new Uint8Array(response.data);
          const blob = new Blob([arrayBufferView], { type: "image/png" });
          const url = URL.createObjectURL(blob);
          setCanvasImage(url);
        } catch (error) {
          console.error("Error uploading file:", error);
        }
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
          },
        }
      );
      const url = response.data.data.url;
      const blobURL = await convertToBlobUrl(url);
      setCanvasImage(blobURL);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
    setIsLoading(false);
  };

  const callOutlineAPI = async () => {
    saveToHistory();
    setIsLoading(true);

    let originalAsset = canvasImage;
    let invertedImage = convertCanvasToBlobURL(canvasRef);
    originalAsset = await convertToBlob(originalAsset);
    invertedImage = await convertToBlob(invertedImage);
    // console.log({ originalAsset });
    // console.log({ invertedImage });

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
          },
          responseType: "arraybuffer",
        }
      );

      const arrayBufferView = new Uint8Array(response.data);
      const blob = new Blob([arrayBufferView], { type: "image/png" });
      const url = URL.createObjectURL(blob);
      setCanvasImage(url);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
    setIsLoading(false);
  };

  const iterateAsset = async () => {
    saveToHistory();
    setIsLoading(true);
    const payload = {
      iteration_type: "modify",
      asset_url: canvasImage,
      prompt: modifyPrompt,
    };

    try {
      const response = await axiosInstance.post(
        imageSuiteUrl + "/editor/image",
        payload
      );
      const blobURL = await convertToBlobUrl(response.data.data.ai_resp.url);
      setCanvasImage(blobURL);
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
      dispatch(updateCallRemoveBackground(false));
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
  }, [callArtStyle, callRemoveBackground, drawPrompt, modifyPrompt]);

  return (
    <div className="w-screen h-screen relative flex bg-[#0D0D0D] p-3">
      <div
        className="w-3/4 h-full bg-cover bg-no-repeat flex flex-col"
        style={{ backgroundImage: `url(${editorBgImage})` }}
      >
        <div className="flex justify-between items-center pr-4">
          <div
            className="relative p-2 bg-[#101010] border-[1px] border-[#1C1C1C] text-[#ffffff7c] rounded-lg text-xs font-medium cursor-pointer hover:bg-[#444444] transition-all duration-200"
            onClick={handleBackToEditorClick}
          >
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
          </div>
          <div
            className="relative p-2 bg-[#101010] border-[1px] border-[#1C1C1C] text-[#ffffff7c] rounded-lg text-xs font-medium cursor-pointer hover:bg-[#444444]"
            onClick={handleUploadImageClick}
          >
            Upload Image
          </div>
        </div>
        <div className="flex justify-center items-center flex-col flex-1">
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
                    <div
                      className="flex justify-center items-center h-9 w-9 bg-[#101010] border-[1px] rounded-l-lg border-[#1C1C1C] cursor-pointer hover:bg-[#444444] transition-all duration-200"
                      onClick={handleCropOkay}
                    >
                      <img src={yesIcon} width="15px"></img>
                    </div>
                    <div
                      className="flex justify-center items-center h-9 w-9 bg-[#101010] border-[1px] rounded-r-lg border-[#1C1C1C] cursor-pointer hover:bg-[#444444] transition-all duration-200"
                      onClick={enableCrop}
                    >
                      <img src={noIcon} width="12px"></img>
                    </div>
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
                  <div className="text-[#ffffff85] font-light text-sm">
                    Draw on the Image and prompt below to generate art
                  </div>
                  <div className="flex">
                    <div className="flex justify-center items-center h-9 w-9 bg-[#101010] border-[1px] rounded-l-lg border-[#1C1C1C] cursor-pointer hover:bg-[#444444] transition-all duration-200">
                      <img src={yesIcon} width="15px"></img>
                    </div>
                    <div
                      className="flex justify-center items-center h-9 w-9 bg-[#101010] border-[1px] rounded-r-lg border-[#1C1C1C] cursor-pointer hover:bg-[#444444] transition-all duration-200"
                      onClick={handleDrawNoClick}
                    >
                      <img src={noIcon} width="12px"></img>
                    </div>
                  </div>
                </div>
              </Popup>
              {!isCropEnabled && !isDraw && (
                <div className="flex justify-between items-center">
                  <div className="flex">
                    <div
                      className="flex justify-center items-center h-9 w-9 bg-[#101010] border-[1px] rounded-l-lg border-[#1C1C1C] cursor-pointer hover:bg-[#444444] transition-all duration-200"
                      onClick={handleUndo}
                    >
                      <img src={undoIcon} width="15px"></img>
                    </div>
                    <div
                      className="flex justify-center items-center h-9 w-9 bg-[#101010] border-[1px] rounded-r-lg border-[#1C1C1C] cursor-pointer hover:bg-[#444444] transition-all duration-200"
                      onClick={handleRedo}
                    >
                      <img src={redoIcon} width="15px"></img>
                    </div>
                  </div>
                  <div className="flex">
                    <div
                      className="flex justify-center items-center h-9 w-9 bg-[#101010] border-[1px] rounded-l-lg border-[#1C1C1C] cursor-pointer hover:bg-[#444444] transition-all duration-200"
                      onClick={enableCrop}
                    >
                      <img src={cropIcon} width="15px"></img>
                    </div>
                    <div
                      className="flex justify-center items-center h-9 w-9 bg-[#101010] border-[1px] border-[#1C1C1C] cursor-pointer hover:bg-[#444444] transition-all duration-200"
                      onClick={handleRotateRight}
                    >
                      <img src={rotateIcon} width="15px"></img>
                    </div>
                    <div
                      className="flex justify-center items-center h-9 w-9 bg-[#101010] border-[1px] border-[#1C1C1C] cursor-pointer hover:bg-[#444444] transition-all duration-200"
                      onClick={handleZoomIn}
                    >
                      <img src={zoomInIcon} width="15px"></img>
                    </div>
                    <div
                      className="flex justify-center items-center h-9 w-9 bg-[#101010] border-[1px] border-[#1C1C1C] cursor-pointer hover:bg-[#444444] transition-all duration-200"
                      onClick={handleZoomOut}
                    >
                      <img src={zoomOutIcon} width="15px"></img>
                    </div>
                    <div
                      className="flex justify-center items-center h-9 w-9 bg-[#101010] border-[1px] border-[#1C1C1C] cursor-pointer hover:bg-[#444444] transition-all duration-200"
                      onClick={handleFlipHorizontal}
                    >
                      <img src={horizontalFlipIcon} width="15px"></img>
                    </div>
                    <div
                      className="flex justify-center items-center h-9 w-9 bg-[#101010] border-[1px] rounded-r-lg border-[#1C1C1C] cursor-pointer hover:bg-[#444444] transition-all duration-200"
                      onClick={handleFlipVertical}
                    >
                      <img src={verticalFlipIcon} width="15px"></img>
                    </div>
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
      {isUpload && (
        <Popup
          componentStyle={`w-screen h-screen flex justify-center items-center top-0 left-0 bg-[#0e0e0eba] backdrop-blur-sm`}
          setShow={setIsUpload}
        >
          <UploadImage setShow={setIsUpload} setCurrImage={setCanvasImage} />
        </Popup>
      )}
    </div>
  );
};

export default Editor;
