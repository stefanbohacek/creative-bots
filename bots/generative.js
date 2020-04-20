let helpers = require(__dirname + '/../helpers/helpers.js'),
    generators = {
      rain: require(__dirname + '/../generators/rain.js')
    },    
    twitter = require(__dirname + '/../helpers/twitter.js'),    
    mastodon = require(__dirname + '/../helpers/mastodon.js'),    
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
    console.log( 'debug image', image );

    // twitter.postImage( T, status_text, image.data, function( err, data ){
    //   if ( err ){
    //     console.log( 'oh no...', err )
    //   } else {
    //     console.log( 'tweet posted!' );
    //     console.log( `https://twitter.com/${data.user.screen_name}/status/${data.id_str}` );
    //   }
    // } );

    // mastodon.postImage( M, status_text, image.path, function( err, data ){
    //   if ( err ){
    //     console.log( 'oh no...', err )
    //   } else {
    //     console.log( 'toot posted!' );
    //     console.log( data.url );
    //   }
    // } );      
    } );    
  }
};