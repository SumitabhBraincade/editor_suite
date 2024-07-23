import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  history: [],
  draw: false,
  erase: false,
  artStyle: "",
  callArtStyle: false,
  callRemoveBackground: false,
  drawPrompt: "",
  modifyPrompt: "",
  canvasDataUrl: "",
  canvasImage: "",
};

const sidebarSlice = createSlice({
  name: "sidebar",
  initialState,
  reducers: {
    updateHistory: (state, action) => {
      state.history = action.payload;
    },
    updateDraw: (state, action) => {
      state.draw = action.payload;
    },
    updateErase: (state, action) => {
      state.erase = action.payload;
    },
    updateArtStyle: (state, action) => {
      state.artStyle = action.payload;
    },
    updateCallArtStyle: (state, action) => {
      state.callArtStyle = action.payload;
    },
    updateCallRemoveBackground: (state, action) => {
      state.callRemoveBackground = action.payload;
    },
    updateDrawPrompt: (state, action) => {
      state.drawPrompt = action.payload;
    },
    updateModifyPrompt: (state, action) => {
      state.modifyPrompt = action.payload;
    },
    updateCanvasDataUrl: (state, action) => {
      state.canvasDataUrl = action.payload;
    },
    updateCanvasImage: (state, action) => {
      state.canvasImage = action.payload;
    },
  },
});

export const {
  updateHistory,
  updateDraw,
  updateErase,
  updateArtStyle,
  updateCallArtStyle,
  updateCallRemoveBackground,
  updateDrawPrompt,
  updateModifyPrompt,
  updateCanvasDataUrl,
  updateCanvasImage,
} = sidebarSlice.actions;
export default sidebarSlice.reducer;
