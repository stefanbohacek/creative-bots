const helpers = require(__dirname + '/../helpers/helpers.js'),
      Twit = require( 'twit' );

class TwitterClient {
  constructor( keys ) {
    let twitterClientInstance = {};

    if ( keys && keys.consumer_key && keys.consumer_secret && keys.access_token && keys.access_token_secret ){
      twitterClientInstance = new Twit( keys );  
    } else {
      console.log( 'missing Twitter API keys' );
    }
    
    this.client = twitterClientInstance;
  }
  tweet( text, cb ) {
      console.log( 'tweeting...' );
      if ( this.client ){
        this.client.post( 'statuses/update', { status: text }, function( err, data, response ) {
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
  }
  postImage( text, image_base64, cb ){
    if ( this.client ){
      let client = this.client;
      
      this.client.post( 'media/upload', { media_data: image_base64 }, function ( err, data, response ) {
        if ( err ){
          console.log( 'error:\n', err );
          if ( cb ){
            cb( err );
          }
        }
        else{
          console.log( 'tweeting the image...' );
          client.post( 'statuses/update', {
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
  }
  updateProfileImage( image_base64, cb ){
    if ( this.client ){
      console.log( 'updating profile image...' );
      this.client.post( 'account/update_profile_image', {
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
  }
  deleteLastTweet( cb ){
    if ( this.client ){
      console.log( 'deleting last tweethis.client...' );
      this.client.get( 'statuses/user_timeline', function( err, data, response ) {
        if ( err ){
          if ( cb ){
            cb( err, data );
          }
          return false;
        }
        if ( data && data.length > 0 ){
          let last_tweet_id = data[0].id_str;
          this.client.post( `statuses/destroy/${last_tweet_id}`, { id: last_tweet_id }, function( err, data, response ) {
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
}

module.exports = TwitterClient;
