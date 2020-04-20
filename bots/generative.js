let helpers = require(__dirname + '/../helpers/helpers.js'),
    generators = {
      rain: require(__dirname + '/../generators/rain.js')
    },    
    twitter = require(__dirname + '/../helpers/twitter.js'),    
    mastodon = require(__dirname + '/../helpers/mastodon.js'), 
    tumblr = require( 'tumblr.js' ),
    tumblrClient = null,    
    Twit = require( 'twit' ),
    T = new Twit( {
        consumer_key: process.env.TWITTER_CONSUMER_KEY_BOT_1,
        consumer_secret: process.env.TWITTER_CONSUMER_SECRET_BOT_1,
        access_token: process.env.TWITTER_ACCESS_TOKEN_BOT_1,
        access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET_BOT_1
    } ),
    Mastodon = require( 'mastodon' ),
    M = new Mastodon( {
     'access_token': process.env.MASTODON_ACCESS_TOKEN_BOT_1,
     'api_url': process.env.MASTODON_API_BOT_1
    } );

if ( 1 === 2 ){
  tumblrClient = tumblr.createClient({
    consumer_key: process.env.TUMBLR_CONSUMER_KEY_BOT_1,
    consumer_secret: process.env.TUMBLR_CONSUMER_SECRET_BOT_1,
    token: process.env.TUMBLR_CONSUMER_TOKEN_BOT_1,
    token_secret: process.env.TUMBLR_CONSUMER_TOKEN_SECRET_BOT_1
  });
}


module.exports = {
  run: function(){

  var status_text = helpers.randomFromArray([
        'Check this out!',
        'New picture!'
      ]),
      options = {
        width: 640,
        height: 480,
      };
  
  generators.rain( options, function( err, image ){

    twitter.postImage( T, status_text, image.data );

    mastodon.postImage( M, status_text, image.path );      
    } );    
  }
};