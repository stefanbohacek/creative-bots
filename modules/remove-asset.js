import * as child from 'child_process';
import loadAssets from "load-assets.js";

const removeAsset = (url) => {
    console.log("removing asset...", url);

    loadAssets((err, data) => {
      let dataArray = data.split("\n"),
        imageData;
      dataArray.forEach((d) => {
        if (d.indexOf(url) > -1) {
          imageData = JSON.parse(d);
          return;
        }
      });

      data += `{"uuid":"${imageData.uuid}","deleted":true}\n`;
      fs.writeFile("./.glitch-assets", data);
      child.exec("refresh");
    });    
};

export default removeAsset;
