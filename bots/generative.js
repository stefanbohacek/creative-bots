let helpers = require(__dirname + '/../helpers/helpers.js'),
    generators = {
      rain: require(__dirname + '/../generators/rain.js')
    },    
    twitter = require(__dirname + '/../helpers/twitter.js'),    
    mastodon = require(__dirname + '/../helpers/mastodon.js'), 
    tumblr = require( 'tumblr.js' ),
    tumblrClient = null,    
    Twit = require( 'twit' ),
    twitterClient = null,
    Mastodon = require( 'mastodon' ),
    mastodonClient = null;

if ( process.env.BOT_1_TWITTER_CONSUMER_KEY && process.env.BOT_1_TWITTER_CONSUMER_SECRET && process.env.BOT_1_TWITTER_ACCESS_TOKEN && process.env.BOT_1_TWITTER_ACCESS_TOKEN_SECRET ){
  twitterClient = new Twit( {
    consumer_key: process.env.BOT_1_TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.BOT_1_TWITTER_CONSUMER_SECRET,
    access_token: process.env.BOT_1_TWITTER_ACCESS_TOKEN,
    access_token_secret: process.env.BOT_1_TWITTER_ACCESS_TOKEN_SECRET
  } );  
}

if ( process.env.BOT_1_MASTODON_ACCESS_TOKEN && process.env.BOT_1_MASTODON_API ){
  mastodonClient = new Mastodon( {
   'access_token': process.env.BOT_1_MASTODON_ACCESS_TOKEN,
   'api_url': process.env.BOT_1_MASTODON_API
  } );
}

if ( process.env.BOT_1_TUMBLR_CONSUMER_KEY && process.env.BOT_1_TUMBLR_CONSUMER_SECRET && process.env.BOT_1_TUMBLR_CONSUMER_TOKEN && process.env.BOT_1_TUMBLR_CONSUMER_TOKEN_SECRET ){
  tumblrClient = tumblr.createClient({
    consumer_key: process.env.BOT_1_TUMBLR_CONSUMER_KEY,
    consumer_secret: process.env.BOT_1_TUMBLR_CONSUMER_SECRET,
    token: process.env.BOT_1_TUMBLR_CONSUMER_TOKEN,
    token_secret: process.env.BOT_1_TUMBLR_CONSUMER_TOKEN_SECRET
  });
}

module.exports = {
  run: function(){
    const statusText = helpers.randomFromArray([
            'Check this out!',
            'New picture!'
          ]),
          options = {
            width: 640,
            height: 480,
          };

    generators.rain( options, function( err, image ){
      if ( twitterClient ){
        twitter.postImage( twitterClient, statusText, image.data );
      }

      if ( mastodonClient ){
        mastodon.postImage( mastodonClient, statusText, image.path );      
      }

      if ( tumblrClient ){
        tumblrClient.createPhotoPost( process.env.BOT_1_TUMBLR_BLOG_NAME, {
          caption: statusText,
          data64: image.data
        }, function( err, data ){
          console.log( 'tumblrd', data );
          console.log( 'tumblrd', `https://${ process.env.BOT_1_TUMBLR_BLOG_NAME }.tumblr.com/post/${ data.id_string }` )
        });  
      }
    } );
  }
};