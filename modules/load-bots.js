import fs from "fs";
import { readFileSync } from "fs";
import { dirname } from "path";
import { fileURLToPath } from "url";
import scheduleBot from "./schedule-bot.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const loadBots = async (app) => {
  const botDirs = fs.readdirSync("bots");
  let bots = [];
  let botCount = 0;

  for (const bot of botDirs) {
    if (fs.lstatSync(`bots/${bot}`).isDirectory()) {
      let aboutJSON = `${__dirname}/../bots/${bot}/about.json`;
      if (fs.existsSync(aboutJSON)) {
        const data = await readFileSync(aboutJSON);
        const about = JSON.parse(data);
        const scriptPath = `${__dirname}/../bots/${bot}/bot.js`;
        let botScript = false;
        if (fs.existsSync(scriptPath)) {
          botScript = await import(scriptPath);
        }

        // console.log({ about });

        let botInfo = {
          about,
          script_path: scriptPath,
          script: botScript,
        };
        
        if (!botInfo.about.source_url && botInfo.about.source_url !== null){
          if (process.env.PROJECT_NAME) {
            botInfo.about.source_url = `https://glitch.com/edit/#!/${process.env.PROJECT_NAME}?path=bots/${bot}/bot.js`;
          } else if (process.env.SOURCE_URL_BASE) {
            botInfo.about.source_url = `${process.env.SOURCE_URL_BASE}/${bot}/bot.js`;
          }
        }

        if (about.active && botScript) {
          botCount++;
          const job = await scheduleBot(botInfo, app);
          botInfo.cronjob = job;
        }

        if (!about.hide) {
          bots.push(botInfo);
        }
      }
    }
  }

  console.log(`🤖 scheduled ${botCount.toLocaleString()} bot(s)`);
  // console.log("reading bots...", bots.map(bot => bot.about.name));

  return bots;
};

export default loadBots;
