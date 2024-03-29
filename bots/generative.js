const helpers = require(__dirname + '/../helpers/helpers.js'),
      cronSchedules = require(__dirname + '/../helpers/cron-schedules.js'),
      generators = {
        pixelate: require(__dirname + '/../generators/pixelate.js'),        
        rain: require(__dirname + '/../generators/rain.js'),
        circlePacking: require(__dirname + '/../generators/circle-packing.js'),
        cubicDisarray: require(__dirname + '/../generators/cubic-disarray.js'),
        joyDivision: require(__dirname + '/../generators/joy-division.js'),
        tiledLines: require(__dirname + '/../generators/tiled-lines.js'),
        unDeuxTrois: require(__dirname + '/../generators/un-deux-trois.js'),
        triangularMesh: require(__dirname + '/../generators/triangular-mesh.js'),
        gradient: require(__dirname + '/../generators/gradient.js'),
        // TODO: Test the remaining generators.
        // ------------------------------------
        // pixelSorter: require(__dirname + '/../generators/pixel-sorter.js'),
        // overlay: require(__dirname + '/../generators/overlay.js'),
        // gif: require(__dirname + '/../generators/gif.js'),
        // glitch: require(__dirname + '/../generators/glitch.js')
      },
      colorbrewerColors = require(__dirname + '/../data/colorbrewer.js'),
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
  name: 'Generative art bot',
  description: 'A bot that makes generative art.',
  interval: cronSchedules.EVERY_DAY_AFTERNOON,
  script: () => {
    
    const statusText = helpers.randomFromArray([
            'Check this out!',
            'New picture!'
          ]);
    const color = helpers.randomFromArray(colorbrewerColors);
    const options = {
            width: 640,
            height: 480,
            colors: color,
            // animate: true
          };
    
    const altText = 'Joy Division cover album inspired generative art piece';

    generators.joyDivision(options, (err, imageData) => {
      twitter.postImage({
        status: statusText,
        image: imageData,
        alt_text: altText
      });
      
      mastodon.postImage({
        status: statusText + ' #Tag #AnotherTag',
        image: imageData,
        alt_text: altText
      });
      
      mastodon.postImage(statusText, imageData);      
      tumblr.postImage(statusText, imageData);        
    });    
  }
};