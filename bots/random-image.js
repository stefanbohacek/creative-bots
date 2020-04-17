let helpers = require(__dirname + '/../helpers/helpers.js'),
    twitter = require(__dirname + '/../helpers/twitter.js'),
    Twit = require( 'twit' ),
    T = new Twit( {
        consumer_key: process.env.TWITTER_CONSUMER_KEY_BOT_2,
        consumer_secret: process.env.TWITTER_CONSUMER_SECRET_BOT_2,
        access_token: process.env.TWITTER_ACCESS_TOKEN_BOT_2,
        access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET_BOT_2
    } );

module.exports = {
  run: function(){
    helpers.loadImageAssets( function( err, assetUrls ){
      if ( err ){
        console.log( err );     
      }
      else{
        helpers.loadRemoteImage( helpers.randomFromArray( assetUrls ), function( err, imgData ){
          if ( err ){
            console.log( err );     
          }
          else{
            const text = helpers.randomFromArray( [
              'Hello!',
              'Hi!',
              'Hi there!'
            ] );
            
            twitter.postImage( T, text, imgData );
          }
        } );
      }
    } );
  } 
};