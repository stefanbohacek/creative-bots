const helpers = require(__dirname + '/../helpers/helpers.js'),
      generators = {
        rain: require(__dirname + '/../generators/rain.js')
      },    
      TwitterClient = require(__dirname + '/../helpers/twitter.js'),    
      mastodon = require(__dirname + '/../helpers/mastodon.js'), 
      tumblr = require(__dirname + '/../helpers/tumblr.js');

const twitter = new TwitterClient( {
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
    mastodon.postImage( mastodonClient, statusText, image.path );      
    tumblr.postImage( tumblrClient, statusText, image.data );        
  } );
};