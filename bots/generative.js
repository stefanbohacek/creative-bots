const helpers = require(__dirname + '/../helpers/helpers.js'),
      cronSchedules = require( __dirname + '/../helpers/cron-schedules.js' ),
      generators = {
        pixelate: require(__dirname + '/../generators/pixelate.js'),        
        rain: require(__dirname + '/../generators/rain.js'),
        // TODO: Test the remaining generators.
        // ------------------------------------
        // circlePacking: require(__dirname + '/../generators/circle-packing.js'),
        // cubicDisarray: require(__dirname + '/../generators/cubic-disarray.js'),
        // glitch: require(__dirname + '/../generators/glitch.js'),
        // joyDivision: require(__dirname + '/../generators/joy-division.js'),
        // overlay: require(__dirname + '/../generators/overlay.js'),
        // gradient: require(__dirname + '/../generators/gradient.js'),
        // // pixelSorter: require(__dirname + '/../generators/pixel-sorter.js'),
        // // gif: require(__dirname + '/../generators/gif.js') ,
        // gradient: require(__dirname + '/../generators/gradient.js'),
        // tiledLines: require(__dirname + '/../generators/tiled-lines.js'),
        // triangularMesh: require(__dirname + '/../generators/triangular-mesh.js'),
        // unDeuxTrois: require(__dirname + '/../generators/un-deux-trois.js')
      },    
      TwitterClient = require(__dirname + '/../helpers/twitter.js'),    
      mastodonClient = require(__dirname + '/../helpers/mastodon.js'), 
      tumblrClient = require(__dirname + '/../helpers/tumblr.js');

const twitter = new TwitterClient( {
  consumer_key: process.env.BOT_1_TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.BOT_1_TWITTER_CONSUMER_SECRET,
  access_token: process.env.BOT_1_TWITTER_ACCESS_TOKEN,
  access_token_secret: process.env.BOT_1_TWITTER_ACCESS_TOKEN_SECRET
} );

const mastodon = new mastodonClient( {
   access_token: process.env.BOT_1_MASTODON_ACCESS_TOKEN,
   api_url: process.env.BOT_1_MASTODON_API
} );

const tumblr = new tumblrClient( {
  tumblr_name: process.env.BOT_1_TUMBLR_BLOG_NAME,  
  consumer_key: process.env.BOT_1_TUMBLR_CONSUMER_KEY,
  consumer_secret: process.env.BOT_1_TUMBLR_CONSUMER_SECRET,
  token: process.env.BOT_1_TUMBLR_CONSUMER_TOKEN,
  token_secret: process.env.BOT_1_TUMBLR_CONSUMER_TOKEN_SECRET
} );

module.exports = {
  active: false,
  name: 'Generative art bot',
  description: 'A bot that makes generative art.',
  interval: cronSchedules.EVERY_DAY_AFTERNOON,
  script: function(){
    const statusText = helpers.randomFromArray([
            'Check this out!',
            'New picture!'
          ]),
          options = {
            width: 640,
            height: 480,
          };

    generators.rain( options, function( err, image ){
      twitter.postImage( statusText, image.data );
      mastodon.postImage( statusText, image.path );      
      tumblr.postImage( statusText, image.data );        
    } );    
  }
};