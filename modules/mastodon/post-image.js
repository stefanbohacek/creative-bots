import fs from "fs";
import getRandomInt from "../get-random-int.js";
import truncate from "../truncate.js";

import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const postImageFn = (client, options, cb) => {
  client.post(
    "media",
    {
      // filename: options.image,
      file: fs.createReadStream(options.image),
      description: truncate(options.alt_text, 1000),
    },
    (err, data, response) => {
      if (err) {
        console.log("mastodon.postImage error:", err);
        if (cb) {
          cb(err, data);
        }
      } else {
        const statusObj = {
          status: options.status,
          // media_ids: new Array(data.media_id_string)
          media_ids: new Array(data.id),
        };

        if (options.in_reply_to_id) {
          statusObj.in_reply_to_id = options.in_reply_to_id;
        }
        
        if (options.spoiler_text) {
          statusObj.spoiler_text = options.spoiler_text;
        }        

        client.post("statuses", statusObj, (err, data, response) => {
          if (err) {
            console.log("mastodon.postImage error:", err);
          } else {
            console.log("posted", data.url);
          }

          if (options.image.includes("temp-")) {
            console.log("deleting temp file...");
            fs.unlinkSync(options.image);
          }

          if (cb) {
            cb(err, data);
          }
        });
      }
    }
  );
};

const postImage = async (client, options, cb) => {
  /* Support both image file path and image data */
  if (fs.existsSync(options.image)) {
    console.log("posting image...", options.image);
    postImageFn(client, options, cb);
  } else if (fs.existsSync(`${options.image}.webm`)) {
    options.image = `${options.image}.webm`;
    console.log("posting image...", options.image);
    postImageFn(client, options, cb);
  } else {
    console.log("posting image...");

    const imgFilePath = `${__dirname}/../../temp/temp-${Date.now()}-${getRandomInt(
      1,
      Number.MAX_SAFE_INTEGER
    )}.png`;

    fs.writeFile(imgFilePath, options.image, "base64", (err) => {
      if (!err) {
        options.image = imgFilePath;
        postImageFn(client, options, cb);
      }
    });
  }
};

export default postImage;
