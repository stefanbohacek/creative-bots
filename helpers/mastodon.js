const fs = require( 'fs' ),
      helpers = require(__dirname + '/../helpers/helpers.js'),
      Mastodon = require( 'mastodon' );

module.exports = {
  client: function( keys ){
    let mastodonClient = {};
    
    if ( keys && keys.access_token && keys.api_url ){
      mastodonClient = new Mastodon( keys );
    }
    
    return mastodonClient;
  },
  toot: function( mastodonClient, status, cb ){
    if ( mastodonClient ){
      console.log( 'tooting...' );
      mastodonClient.post( 'statuses', { status: status }, function( err, data, response ) {
        console.log( 'tooted', data.url );
        if ( cb ){
          cb( err, data );
        }
      } );
    }
  },
  reply: function( mastodonClient, status, response, cb ){
    if ( mastodonClient ){
      console.log( 'responding...' );
      mastodonClient.post( 'statuses', { 
        in_reply_to_id: status.id,
        spoiler_text: status.spoiler_text,
        visibility: status.visibility,
        status: response
      }, function( err, data, response ) {
        if ( cb ){
          cb( err, data );
        }
      } );      
    }
  },
  getNotifications: function( mastodonClient, cb ){
    if ( mastodonClient ){
      mastodonClient.get( 'notifications', function( err, notifications ){
        if ( cb ){
          cb( err, notifications );
        }
      } );
    }
  },
  dismissNotification: function( mastodonClient, notification, cb ){
    if ( mastodonClient && notification && notification.id ){
      mastodonClient.post( 'notifications/dismiss', {
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
  postImage: function( mastodonClient, text, imgData, cb ) {
    if ( mastodonClient ){
      function postImageFn( filePath ){
        mastodonClient.post( 'media', {
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
            mastodonClient.post( 'statuses', {
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
}
