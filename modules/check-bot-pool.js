import fs from "fs";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const poolFilePath = `${__dirname}/../temp/pool.json`;
const poolCheckInterval = 60000;
// const poolCheckInterval = 5000;

const checkBotPoolFn = (app) => {
  let pool = app.get("pool");

  if (pool && pool.length) {
    const botName = pool.shift();
    const bots = app.get("bots");
    try {
      const bot = bots.filter((bot) => bot.about.name === botName)[0];

      // console.log({
      //     pool,
      //     'bot.about': bot.about,
      //     bots: bots.map(bot => bot.about.name)
      // });

      bot.script.default();

      pool = [...new Set(pool)];
      app.set("pool", pool);
      fs.writeFileSync(poolFilePath, JSON.stringify(pool, null, 2), "utf8");
    } catch (err) {
      /* noop */
    }
  }
  console.log(`current pool (${pool.length}):`, pool);
};

const checkBotPool = (app) => {
  let pool = [];

  if (fs.existsSync(poolFilePath)) {
    try {
      pool = JSON.parse(fs.readFileSync(poolFilePath, "utf8"));
    } catch (err) {
      pool = [];
    }
  }

  pool = [...new Set(pool)];
  app.set("pool", pool);

  setInterval(() => {
    checkBotPoolFn(app);
  }, poolCheckInterval);
};

export default checkBotPool;
