const helpers = require(__dirname + '/../helpers/helpers.js'),
      twitter = require(__dirname + '/../helpers/twitter.js'),    
      mastodon = require(__dirname + '/../helpers/mastodon.js'), 
      tumblr = require(__dirname + '/../helpers/tumblr.js');

const twitterClient = twitter.client( {
  consumer_key: process.env.BOT_1_TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.BOT_1_TWITTER_CONSUMER_SECRET,
  access_token: process.env.BOT_1_TWITTER_ACCESS_TOKEN,
  access_token_secret: process.env.BOT_1_TWITTER_ACCESS_TOKEN_SECRET
} );

const mastodonClient = mastodon.client( {
   access_token: process.env.BOT_1_MASTODON_ACCESS_TOKEN,
   api_url: process.env.BOT_1_MASTODON_API
} );

const tumblrClient = tumblr.client( {
  tumblr_name: process.env.BOT_1_TUMBLR_BLOG_NAME,
  consumer_key: process.env.BOT_1_TUMBLR_CONSUMER_KEY,
  consumer_secret: process.env.BOT_1_TUMBLR_CONSUMER_SECRET,
  token: process.env.BOT_1_TUMBLR_CONSUMER_TOKEN,
  token_secret: process.env.BOT_1_TUMBLR_CONSUMER_TOKEN_SECRET
} );

module.exports = function(){
  const title = 'New post',
        text = helpers.randomFromArray( [
          'Hello!',
          'Hi!',
          'Hi there!'
        ] );

  twitter.tweet( twitterClient, text );
  mastodon.toot( mastodonClient, text );
  tumblr.post( tumblrClient, title, text );
};