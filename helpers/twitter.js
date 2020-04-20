const helpers = require(__dirname + '/../helpers/helpers.js'),
      Twit = require( 'twit' );

module.exports = {
  client: function( keys ){
    let twitterClient = {};
    
    if ( keys && keys.consumer_key && keys.consumer_secret && keys.access_token && keys.access_token_secret ){
      twitterClient = new Twit( keys );  
    }
    
    return twitterClient;
  },
  tweet: function( twitterClient, text, cb ){
    if ( twitterClient ){
      console.log( 'tweeting...' );
      twitterClient.post( 'statuses/update', { status: text }, function( err, data, response ) {
        if ( data && data.id_str && data.user && data.user.screen_name ){
          console.log( 'tweeted', `https://twitter.com/${ data.user.screen_name }/status/${ data.id_str }` );
        }
        if ( err ){
          console.log( 'Twitter API error', err );
        }
        if ( cb ){
          cb( err, data );
        }
      } );        
    }
  },
  postImage: function( twitterClient, text, image_base64, cb ) {
    if ( twitterClient ){
      twitterClient.post( 'media/upload', { media_data: image_base64 }, function ( err, data, response ) {
        if ( err ){
          console.log( 'error:\n', err );
          if ( cb ){
            cb( err );
          }
        }
        else{
          console.log( 'tweeting the image...' );
          twitterClient.post( 'statuses/update', {
            status: text,
            media_ids: new Array( data.media_id_string )
          },
          function( err, data, response ) {
            if ( data && data.id_str && data.user && data.user.screen_name ){
              console.log( 'tweeted', `https://twitter.com/${ data.user.screen_name }/status/${ data.id_str }` );
            }
            if ( err ){
              console.log( 'Twitter API error', err );
            }
            if ( cb ){
              cb( err, data );
            }
          } );
        }
      } );      
    }
  },  
  updateProfileImage: function( twitterClient, image_base64, cb ) {
    if ( twitterClient ){
      console.log( 'updating profile image...' );
      twitterClient.post( 'account/update_profile_image', {
        image: image_base64
      }, function( err, data, response ) {
        if ( err ){
          console.log( 'Twitter API error', err );
        }
        if ( cb ){
          cb( err, data );
        }
      } );      
    }
  },
  deleteLastTweet: function( twitterClient, cb ){
    if ( twitterClient ){
      console.log( 'deleting last tweetwitterClient...' );
      twitterClient.get( 'statuses/user_timeline', function( err, data, response ) {
        if ( err ){
          if ( cb ){
            cb( err, data );
          }
          return false;
        }
        if ( data && data.length > 0 ){
          let last_tweet_id = data[0].id_str;
          twitterClient.post( `statuses/destroy/${last_tweet_id}`, { id: last_tweet_id }, function( err, data, response ) {
            if ( cb ){
              cb( err, data );
            }
          } );
        } else {
          if ( cb ){
            cb( err, data );
          }
        }
      } );      
    }
  }  
};