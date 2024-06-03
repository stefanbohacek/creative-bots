import {exec} from "node:child_process";
import util from "node:util";
import getRandomInt from "./get-random-int.js";
import TimeFormat from "hh-mm-ss";
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const execPromise = util.promisify(exec);

const extractVideo = async (url, filename, startSeconds, endSeconds, seconds) => {

  let videoStart = getRandomInt(startSeconds, endSeconds);
  let videoEnd = videoStart + seconds;

  videoStart = TimeFormat.fromS(videoStart, 'hh:mm:ss');
  videoEnd = TimeFormat.fromS(videoEnd, 'hh:mm:ss');
  
  console.log('downloading video...', url);

  let cmd, args, response = {};

  try {
    cmd = `yt-dlp`;
    args = [
      '-f', '18',
      '--external-downloader', 'ffmpeg',
      '--external-downloader-args', `'ffmpeg_i:-ss ${videoStart} -t ${seconds}'`,
      `"${url}"`,
      '-o', `${__dirname}/../temp/${filename}.tmp`,
      '--force-overwrites'
    ];
    console.log("cmd+args", [cmd, ...args].join(" "));
    response = await execPromise(`${cmd} ${args.join(' ')}`);

    cmd = `ffmpeg`;
    args = [
      '-ss', `${videoStart}`,
      '-to', `${videoEnd}`,
      '-i', `${__dirname}/../temp/${filename}.tmp`,
      '-o', `${__dirname}/../temp/${filename}`,
      '--force-overwrites'
    ];
    console.log("cmd+args", [cmd, ...args].join(" "));
    response = await execPromise(`${cmd} ${args.join(' ')}`);

    // console.log(response.stdout, response.stderr);
  } catch (error) {
    console.log(error);
  }

  return response;
};

export default extractVideo;
