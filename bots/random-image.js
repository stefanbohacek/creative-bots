const helpers = require(__dirname + '/../helpers/helpers.js'),
      cronSchedules = require( __dirname + '/../helpers/cron-schedules.js' ),
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
  name: 'Random image bot',
  description: 'A bot that posts random images.',
  interval: cronSchedules.EVERY_SIX_HOURS,
  script: function(){
    helpers.loadImageAssets( function( err, assetUrls ){
      if ( err ){
        console.log( err );     
      }
      else{
        /*
          Glitch doesn't support folders inside the assets folder, so to get around that, if you want to have multiple random image bots, or to keep images in your assets folder that you don't want the bot to post, you can add a prefix to each image and then filter the images using this prefix. 
        */

        const imgPrefix = 'bot1img-';

        const imgUrl = helpers.randomFromArray( assetUrls.filter( function( asset){
          return asset.indexOf( imgPrefix ) !== -1;
        } ) );      
        
        helpers.loadImage( imgUrl, function( err, imgData ){
          if ( err ){
            console.log( err );     
          }
          else{
            
            const text = helpers.randomFromArray( [
              'Hello!',
              'Hi!',
              'Hi there!'
            ] );

            twitter.postImage( text, imgData );
            mastodon.postImage( text, imgData );
            tumblr.postImage( text, imgData );
          }
        } );
      }
    } );
  }
};