module.exports = {
  tweet: function( T, text, cb ){
    T.post( 'statuses/update', { status: text }, function( err, data, response ) {
      cb( err, data, response );
    } );    
  },
  postImage: function( T, text, image_base64, cb ) {
   T.post( 'media/upload', { media_data: image_base64 }, function ( err, data, response ) {
      if ( err ){
        console.log( 'ERROR:\n', err );
        if ( cb ){
          cb( err );
        }
      }
      else{
        console.log( 'tweeting the image...' );
        T.post( 'statuses/update', {
          status: text,
          media_ids: new Array( data.media_id_string )
        },
        function( err, data, response ) {
          if ( err ){
            console.log( 'ERROR:\n', err );
            if ( cb ){
              cb( err );
            }
          }
          else{
            console.log( 'tweeted' );
            if ( cb ){
              cb( null );
            }
          }
        } );
      }
    } );
  },  
  updateProfileImage: function( T, image_base64, cb ) {
    console.log( 'updating profile image...' );
    T.post( 'account/update_profile_image', {
      image: image_base64
    },
    function( err, data, response ) {
      if ( err ){
        console.log( 'ERROR:\n', err );
        if ( cb ){
          cb( err );
        }
      }
      else{
        if ( cb ){
          cb( null );
        }
      }
    } );
  },
  deleteLastTweet: function( T, cb ){
    console.log( 'deleting last tweet...' );
    T.get( 'statuses/user_timeline', function( err, data, response ) {
      if ( err ){
        if ( cb ){
          cb( err, data );
        }
        return false;
      }
      if ( data && data.length > 0 ){
        var last_tweet_id = data[0].id_str;
        T.post( `statuses/destroy/${last_tweet_id}`, { id: last_tweet_id }, function( err, data, response ) {
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
};