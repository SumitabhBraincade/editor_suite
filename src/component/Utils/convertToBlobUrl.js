const convertToBlobUrl = async (url) => {
  let blobURL = url;
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    blobURL = URL.createObjectURL(blob);
  } catch (error) {
    console.error(`Error fetching image for ${url}:`, error);
  }
  return blobURL;
};

export default convertToBlobUrl;
