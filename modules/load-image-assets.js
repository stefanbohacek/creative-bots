import fs from 'fs';
import loadAssets from 'load-assets.js';

const loadImageAssets = async () => {
    let assets = await loadAssets();
    assets = assets.split("\n");

    let dataJson = JSON.parse("[" + data.join(",").slice(0, -1) + "]");

    let deletedImages = dataJson.reduce((filtered, image) => {
        if (image.deleted) {
          filtered.push(image.uuid);
        }
        return filtered;
      }, []),
      imageUrls = [];

    for (let i = 0, j = data.length; i < j; i++) {
      if (data[i].length) {
        let imageData = JSON.parse(data[i]),
          imageUrl = imageData.url;

        if (
          imageUrl &&
          deletedImages.indexOf(imageData.uuid) === -1 &&
          extensionCheck(imageUrl)
        ) {
          let fileName = helpers
            .getFilenameFromURL(imageUrl)
            .split("%2F")[1];
          console.log(`- ${fileName}`);
          imageUrls.push(imageUrl);
        }
      }
    }

    if (imageUrls && imageUrls.length === 0) {
      console.log("no images found...");
    }

    return imageUrls;
};

export default loadImageAssets;
