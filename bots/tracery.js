/* Based on https://glitch.com/edit/#!/tracery-twitter-bot */

const helpers = require(__dirname + '/../helpers/helpers.js'),
      cronSchedules = require( __dirname + '/../helpers/cron-schedules.js' ),
      tracery = require('tracery-grammar'),
      rawGrammar = require(__dirname + '/../tracery-grammar/directions.json'),    
      processedGrammar = tracery.createGrammar( rawGrammar ),
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
  name: 'Tracery bot',
  description: 'A bot that uses Kate Compton\'s Tracery.',
  interval: cronSchedules.EVERY_FOUR_HOURS,
  script: function(){
    const title = 'New post',
          text = processedGrammar.flatten( '#origin#' );

    twitter.tweet( text );
    mastodon.toot( text );
    tumblr.post( title, text );    
  }
};
