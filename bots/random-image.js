let helpers = require(__dirname + '/../helpers.js'),
    twitterConfig = {
        consumer_key: process.env.TWITTER_CONSUMER_KEY_BOT_2,
        consumer_secret: process.env.TWITTER_CONSUMER_SECRET_BOT_2,
        access_token: process.env.TWITTER_ACCESS_TOKEN_BOT_2,
        access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET_BOT_2
    },
    Twit = require( 'twit' ),
    T = new Twit( twitterConfig );

module.exports = {
  postImage: function(){
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
            T.post( 'media/upload', { media_data: imgData }, function ( err, data, response ) {
              if ( err ){
                console.log( err );
              }
              else{
                const text = helpers.randomFromArray( [
                  'Hello!',
                  'Hi!',
                  'Hi there!'
                ] );
                
                T.post( 'statuses/update', {
                  status: text,
                  media_ids: new Array( data.media_id_string )
                },
                function( err, data, response ) {
                  if ( err ){
                    console.log( err );     
                  }
                  else{
                    if ( data && data.id_str && data.user && data.user.screen_name ){
                      console.log( 'tweeted', `https://twitter.com/${ data.user.screen_name }/status/${ data.id_str }` );
                    }
                  }
                } );
              }
            } );
          }
        } );
      }
    } );
  } 
};