/*

Put all your images into the Assets folder. (See left sidebar.)
Then update the data/images.js file with URLs of your images, description of each image for the alt text, and optionally a short text that will be posted with the image.


You can use the Assets folder (https://help.glitch.com/kb/article/43-adding-assets/) to upload your images, and then use the helpers.loadImageAssets helper function (see example below) to load the image URLs.

Note that Glitch doesn't support folders, so if you want to have multiple random image bots, or to keep images in your assets folder that you don't want the bot to post, you can add a prefix to each image and then filter the images using this prefix.

const imgPrefix = 'bot1img-';

const imgUrl = helpers.randomFromArray(assetUrls.filter((asset) => {
  return asset.indexOf(imgPrefix) !== -1;
}));      

*/

const helpers = require(__dirname + '/../helpers/helpers.js'),
      images = require(__dirname + '/../data/images.js'),
      cronSchedules = require(__dirname + '/../helpers/cron-schedules.js'),
      TwitterClient = require(__dirname + '/../helpers/twitter.js'),    
      mastodonClient = require(__dirname + '/../helpers/mastodon.js'), 
      tumblrClient = require(__dirname + '/../helpers/tumblr.js');

const twitter = new TwitterClient({
  consumer_key: process.env.BOT_1_TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.BOT_1_TWITTER_CONSUMER_SECRET,
  access_token: process.env.BOT_1_TWITTER_ACCESS_TOKEN,
  access_token_secret: process.env.BOT_1_TWITTER_ACCESS_TOKEN_SECRET
});

const mastodon = new mastodonClient({
  access_token: process.env.BOT_1_MASTODON_ACCESS_TOKEN,
  api_url: process.env.BOT_1_MASTODON_API
});

const tumblr = new tumblrClient({
  tumblr_name: process.env.BOT_1_TUMBLR_BLOG_NAME,
  consumer_key: process.env.BOT_1_TUMBLR_CONSUMER_KEY,
  consumer_secret: process.env.BOT_1_TUMBLR_CONSUMER_SECRET,
  token: process.env.BOT_1_TUMBLR_CONSUMER_TOKEN,
  token_secret: process.env.BOT_1_TUMBLR_CONSUMER_TOKEN_SECRET
});

module.exports = {
  active: false,
  name: 'Random image bot',
  description: 'A bot that posts random images.',
  interval: cronSchedules.EVERY_SIX_HOURS,
  script: () => {
    const image = helpers.randomFromArray(images);
    console.log(images, image);

    helpers.loadImage(image.url, (err, imgData) => {
      if (err){
        console.log(err);     
      }
      else{
        twitter.postImage({
          status: `Source: ${image.text}`,
          image: imgData,
          alt_text: image.alt_text,
        });
        
        mastodon.postImage({
          status: `Source: ${image.text} #Tag #AnotherTag`,
          image: imgData,
          alt_text: image.alt_text,
        });
        
        tumblr.postImage(image.text, imgData);
      }
    });
  }
};