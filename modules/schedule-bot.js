import { CronJob } from "cron";
import { convert } from "html-to-text";
import moment from "moment";
import cronSchedules from "./cron-schedules.js";
import capitalizeFirstLetter from "./capitalize-first-letter.js";

const scheduleBot = async (bot, app) => {
  const intervalBots = [];

  if (bot.about.reply) {
    const { reply, clients } = await import(bot.script_path);

    if (clients.mastodon) {
      const mastodonStream = clients.mastodon.client.stream("streaming/user");

      mastodonStream.on("message", (message) => {
        console.log("received message...", message.event, message.data.type);
        if (
          message.event === "notification" &&
          message.data.type === "mention"
        ) {
          const from = message.data.account.acct;
          const statusID = message.data.status.id;
          const text = convert(message.data.status.content);
          reply(statusID, from, text, message);
        }
      });
    }
  }

  if (bot.about.interval) {
    if (bot.about.interval === "EVERY_SECOND"){
      console.log(bot)
      
      const botScript = await import(bot.script_path);
      console.log(botScript)
      
      setInterval(async () => {
        bot.script.default();
      }, 1000);
    } else {
      for (const schedule in cronSchedules) {
        if (schedule === bot.about.interval) {
          bot.about.interval_cron = cronSchedules[schedule];
        }
      }
  
      bot.about.interval_human = capitalizeFirstLetter(
        bot.about.interval.replace(/_/g, " ")
      );
  
      console.log(`⌛ scheduling ${bot.about.name}: ${bot.about.interval}`);
  
      const job = new CronJob(bot.about.interval_cron, async () => {
        console.log(`adding ${bot.about.name} to the pool...`);
        let pool = app.get("pool");
        if (pool) {
          pool.push(bot.about.name);
          pool = [...new Set(pool)];
          app.set("pool", pool);
        }
      });
  
      job.start();
      const nextRun = moment(job.nextDates().ts).fromNow();
      // console.log(bot.about);
      console.log("📅 next run:", nextRun);
      return job;
    }
  }
};

export default scheduleBot;
