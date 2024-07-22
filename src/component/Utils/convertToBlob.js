export const convertToBlob = async (asset) => {
  let assetBlob;
  if (asset instanceof Blob) {
    assetBlob = asset;
  } else if (asset instanceof HTMLCanvasElement) {
    assetBlob = await new Promise((resolve) =>
      asset.toBlob(resolve, "image/png")
    );
  } else if (typeof editedAsset === "string") {
    const response = await fetch(asset);
    assetBlob = await response.blob();
  } else {
    assetBlob = new Blob([asset], { type: "image/png" });
  }
  return assetBlob;
};
