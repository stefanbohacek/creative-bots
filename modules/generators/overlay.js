import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import fs from "fs";
import path from "path";
import Canvas from "canvas";
import GIFEncoder from "gifencoder";

import getFilenameFromURL from "./../get-filename-from-url.js";
import downloadFile from "./../download-file.js";

export default (overlays, options, cb) => {
  console.log("overlaying images...");

  let width = options.width,
    height = options.height;

  let prepareImgFn = async (overlay, index) => {
    console.log(`preparing (${index})...\n`, overlay);
    return new Promise(async (resolve) => {
      if (overlay.url) {
        const overlayUrlClean = overlay.url.split("?")[0];
        const filePath = path.join(
          __dirname,
          "../../temp/",
          getFilenameFromURL(overlayUrlClean)
        );

        await downloadFile(overlay.url, filePath);

        console.log("image downloaded...");
        overlay.buffer = fs.readFileSync(filePath);
        return resolve(overlay, index);
      } else if (overlay.text) {
        return resolve(overlay, index);
      }
    });
  };

  const makeOverlayImage = (data) => {
    console.log({ data });
    let canvas = Canvas.createCanvas(width, height),
      ctx = canvas.getContext("2d"),
      Image = Canvas.Image;

    data.forEach((img) => {
      if (img.text) {
        console.log("overlaying text...");

        img.fontSize = img.fontSize || 14;
        img.fontFamily = img.fontFamily || "serif";

        if (img.fontFileName) {
          console.log(path.join(__dirname, "../../fonts", img.fontFileName));
          Canvas.registerFont(
            path.join(__dirname, "../../fonts", img.fontFileName),
            { family: img.fontFamily }
          );
        }

        ctx.font = `${img.fontSize}px ${img.fontFamily}`;
        ctx.fillStyle = img.style;
        ctx.shadowOffsetX = 3;
        ctx.shadowOffsetY = 3;
        ctx.shadowColor = "rgba(0,0,0,0.3)";
        ctx.shadowBlur = 4;

        if (img.position) {
          console.log(`positioning text: ${img.position} ...`);

          let textWidth = ctx.measureText(img.text).width,
            textHeight = img.fontSize;

          if (img.position === "top left") {
            if (img.strokeStyle) {
              ctx.strokeStyle = img.strokeStyle;
              ctx.lineWidth = 8;
              ctx.strokeText(img.text, 0, textHeight);
            }
            ctx.fillText(img.text, 0, textHeight);
          } else if (img.position === "top center") {
            if (img.strokeStyle) {
              ctx.strokeStyle = img.strokeStyle;
              ctx.lineWidth = 8;
              ctx.strokeText(
                img.text,
                canvas.width / 2 - textWidth / 2,
                textHeight
              );
            }
            ctx.fillText(
              img.text,
              canvas.width / 2 - textWidth / 2,
              textHeight
            );
          } else if (img.position === "top right") {
            if (img.strokeStyle) {
              ctx.strokeStyle = img.strokeStyle;
              ctx.lineWidth = 8;
              ctx.strokeText(img.text, canvas.width - textWidth, textHeight);
            }
            ctx.fillText(img.text, canvas.width - textWidth, textHeight);
          } else if (img.position === "center left") {
            if (img.strokeStyle) {
              ctx.strokeStyle = img.strokeStyle;
              ctx.lineWidth = 8;
              ctx.strokeText(img.text, 0, canvas.height / 2 - textHeight);
            }
            ctx.fillText(img.text, 0, canvas.height / 2 - textHeight);
          } else if (img.position === "center center") {
            if (img.strokeStyle) {
              ctx.strokeStyle = img.strokeStyle;
              ctx.lineWidth = 8;
              ctx.strokeText(
                img.text,
                canvas.width / 2 - textWidth / 2,
                canvas.height / 2 + textHeight / 2
              );
            }
            ctx.fillText(
              img.text,
              canvas.width / 2 - textWidth / 2,
              canvas.height / 2 + textHeight / 2
            );
          } else if (img.position === "center right") {
            if (img.strokeStyle) {
              ctx.strokeStyle = img.strokeStyle;
              ctx.lineWidth = 8;
              ctx.strokeText(
                img.text,
                canvas.width - textWidth,
                canvas.height / 2 + textHeight / 2
              );
            }
            ctx.fillText(
              img.text,
              canvas.width - textWidth,
              canvas.height / 2 + textHeight / 2
            );
          } else if (img.position === "bottom left") {
            if (img.strokeStyle) {
              ctx.strokeStyle = img.strokeStyle;
              ctx.lineWidth = 8;
              ctx.strokeText(img.text, 0, canvas.height);
            }
            ctx.fillText(img.text, 0, canvas.height);
          } else if (img.position === "bottom center") {
            if (img.strokeStyle) {
              ctx.strokeStyle = img.strokeStyle;
              ctx.lineWidth = 8;
              ctx.strokeText(
                img.text,
                canvas.width / 2 - textWidth / 2,
                canvas.height - 1.5 * img.fontSize
              );
            }
            ctx.fillText(
              img.text,
              canvas.width / 2 - textWidth / 2,
              canvas.height - 1.5 * img.fontSize
            );
          } else if (img.position === "bottom right") {
            if (img.strokeStyle) {
              ctx.strokeStyle = img.strokeStyle;
              ctx.lineWidth = 8;
              ctx.strokeText(img.text, canvas.width - textWidth, canvas.height);
            }
            ctx.fillText(img.text, canvas.width - textWidth, canvas.height);
          }
        } else if (img.x && img.y) {
          if (img.strokeStyle) {
            ctx.strokeStyle = img.strokeStyle;
            ctx.lineWidth = 8;
            ctx.strokeText(img.text, img.x, img.y);
          }
          ctx.fillText(img.text, img.x, img.y);
        }
      } else {
        let overlay = new Image();
        (overlay.src = img.buffer),
          (img.globalCompositeOperation =
            img.globalCompositeOperation || "source-over");

        console.log("overlaying image...");
        ctx.globalCompositeOperation = img.globalCompositeOperation;
        // ctx.drawImage(overlay, img.x, img.y, img.width, img.height, 0, 0, canvas.width, canvas.height);
        ctx.drawImage(overlay, img.x, img.y, img.width, img.height);
      }
    });

    cb(null, canvas.toBuffer().toString("base64"));
  };

  let actions = overlays.map(prepareImgFn);
  let results = Promise.all(actions);

  results.then((imgDataArr, index) => {
    return makeOverlayImage(imgDataArr);
  });
};
