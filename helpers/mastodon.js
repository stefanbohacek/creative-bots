const fs = require( 'fs' ),
      helpers = require(__dirname + '/../helpers/helpers.js');

module.exports = {
  toot: function( M, status, cb ){
    if ( !M ){
      console.error( 'please update your .env file' )
      return false;
    }
    if ( status.length > 500 ){
      console.error( `status too long: ${status}` );
      return false;
    }

    console.log( 'tooting...' );
    M.post( 'statuses', { status: status }, function( err, data, response ) {
      console.log( `posted status: ${status}` );
      if ( cb ){
        cb( err, data );
      }
    } );
  },
  reply: function( M, status, response, cb ){
    if ( !M ){
      console.error( 'please update your .env file' )
      return false;
    }
    if ( response.length > 500 ){
      console.error( `status too long: ${response}` );
      return false;
    }

    console.log( 'responding...' );

    M.post( 'statuses', { 
      in_reply_to_id: status.id,
      spoiler_text: status.spoiler_text,
      visibility: status.visibility,
      status: response
    }, function( err, data, response ) {
      if ( cb ){
        cb( err, data );
      }
    } );
  },
  getNotifications: function( M, cb ){
    M.get( 'notifications', function( err, notifications ){
      if ( cb ){
        cb( err, notifications );
      }
    } );  
  },
  dismissNotification: function( M, notification, cb ){
    if ( notification && notification.id ){
      M.post( 'notifications/dismiss', {
        id: notification.id
      } ).then( function( err, data, response ){
        if ( cb ){
          cb( err, data );
        }
      } ).catch( function( err ){
        console.log( err );
      } );
    }
  },
  postImage: function( M, text, imgData, cb ) {
    function postImageFn( filePath ){
      M.post( 'media', {
        file: fs.createReadStream( filePath )
      }, function ( err, data, response ) {
        if ( err ){
          console.log( 'ERROR:\n', err );
          if ( cb ){
            cb( err );
          }
        }
        else{
          // console.log( data );
          console.log( 'tooting the image...' );
          M.post( 'statuses', {
            status: text,
            // media_ids: new Array( data.media_id_string )
            media_ids: new Array( data.id )
          },
          function( err, data, response ) {
            if ( err ){
              console.log( 'ERROR:\n', err );
              if ( cb ){
                cb( err );
              }
            }
            else{
              console.log( 'tooted' );
              if ( cb ){
                cb( null, data );
              }
            }
          } );
        }
      } );      
    }

    /* Support both image file path and image data */
    if ( fs.existsSync( imgData ) ) {
      postImageFn( imgData );
    } else {
      const imgFilePath = `${__dirname}/../.data/temp-${ Date.now() }-${ helpers.getRandomInt( 1, Number.MAX_SAFE_INTEGER ) }.png`;
      fs.writeFile( imgFilePath, imgData, 'base64', function(err) {
        if ( !err ){
          postImageFn( imgFilePath );
        }
      } );       
    }
  }  
}
