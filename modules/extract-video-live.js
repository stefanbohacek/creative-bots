import {exec} from "node:child_process";
import util from "node:util";

import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const execPromise = util.promisify(exec);

const extractVideo = async (url, filename, seconds) => {
  console.log('downloading video...', url)
  let response = {};
  try {
    const cmd = `yt-dlp`;
    const args = [
      '--downloader', 'ffmpeg',
      '--downloader-args', `"ffmpeg:-t ${seconds}"`,
      `"${url}"`,
      '-o', `${__dirname}/../temp/${filename}`,
      '--force-overwrites'
    ];
    response = await execPromise(`${cmd} ${args.join(' ')}`);
    // console.log(response.stdout, response.stderr);
  } catch (error) {
    console.log(error);
  }

  return response;
};

export default extractVideo;
