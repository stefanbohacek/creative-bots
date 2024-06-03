import mastodonClient from "./../../modules/mastodon/index.js";
import randomFromArray from "./../../modules/random-from-array.js";

const botScript = async () => {

  const status = randomFromArray([
    "Hello!",
    "Hi!",
    "Hey there!"
  ]);

  const mastodon = new mastodonClient({
    access_token: process.env.MASTODON_BOT_TOKEN,
    api_url: process.env.BOTSINSPACE_API_URL,
  });

  mastodon.post({
    status: status
  });

  return true;
};

export default botScript;
