const fs = require( 'fs' ),
      request = require('request'),
      helpers = require(__dirname + '/../helpers/helpers.js'),
      Mastodon = require( 'mastodon' );

class MastodonClient {
  constructor( keys ) {
    let mastodonClientInstance = {};

    if ( keys && keys.access_token && keys.api_url ){
      mastodonClientInstance = new Mastodon( keys );
    } else {
      console.log( 'missing Twitter API keys' );
    }

    this.client = mastodonClientInstance;
  }
  toot( text, cb ) {
    if ( this.client ){
      console.log( 'tooting...' );
      this.client.post( 'statuses', { status: text }, function( err, data, response ) {
        if ( err ){
          console.log( 'mastodon.toot error:', err );
        } else {
          console.log( 'tooted', data.url );
        }

        if ( cb ){
          cb( err, data );
        }
      } );
    }
  }
  reply( status, response, cb ) {
    if ( this.client ){
      console.log( 'responding...' );
      this.client.post( 'statuses', { 
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
  }
  poll( text, options, cb ) {
    if ( this.client ){
      console.log( 'posting a poll...' );

      let optionsObj;

      if ( typeof text === 'string' ){
        optionsObj = {
          status: text,
          poll: {
            options: options,
            expires_in: 86400
          }, 
        };
      } else {
        optionsObj = text;
        cb = options;
      }
      
      const req = {
        uri: `${ this.client.config.api_url }/statuses`,
        method: 'POST',
        headers: {
            Authorization: 'Bearer ' + this.client.config.access_token,
        },
        json: optionsObj
      };

      request( req, function callback( error, response, body ) {
        if ( error ){
          console.log( error )
        } else {
          // try{
          //   const resp = JSON.parse( body );
          //   if ( resp.error ){
          //     console.log( 'error', resp.error );
          //   }
          // } catch( err ){ console.log( body, err ) }
          if ( body && body.url ){
            console.log( 'poll posted', body.url );
          }
        }
        if ( cb ){
          cb( error, response, body );
        }
      } );
    }    
  }  
  getNotifications( cb ) {
    if ( this.client ){
      console.log( 'retrieving notifications...' );
      this.client.get( 'notifications', function( err, notifications ){
        if ( cb ){
          cb( err, notifications );
        }
      } );
    }
  }
  dismissNotification( notification, cb ) {
    if ( this.client && notification && notification.id ){
      console.log( 'clearing notifications...' );

      this.client.post( 'notifications/dismiss', {
        id: notification.id
      } ).then( function( err, data, response ){
        if ( cb ){
          cb( err, data );
        }
      } ).catch( function( err ){
        console.log( 'mastodon.dismissNotification error:', err );
      } );
    }
  }
  postImage( text, image_base64, cb ){
    if ( this.client ){
      let client = this.client;
      
      function postImageFn( client, filePath ){
        client.post( 'media', {
          file: fs.createReadStream( filePath )
        }, function ( err, data, response ) {
          if ( err ){
            console.log( 'mastodon.postImage error:', err );
            if ( cb ){
              cb( err, data );
            }
          }
          else{
            console.log( 'tooting the image...' );
            client.post( 'statuses', {
              status: text,
              // media_ids: new Array( data.media_id_string )
              media_ids: new Array( data.id )
            },
            function( err, data, response ) {
              if ( err ){
                console.log( 'mastodon.postImage error:', err );
              } else{
                console.log( 'tooted', data.url );
              }

              helpers.removeFile( filePath );
              
              if ( cb ){
                cb( err, data );
              }

            } );
          }
        } );
      }

      /* Support both image file path and image data */
      if ( fs.existsSync( image_base64 ) ) {
        postImageFn( client, image_base64 );
      } else {
        const imgFilePath = `${__dirname}/../.data/temp-${ Date.now() }-${ helpers.getRandomInt( 1, Number.MAX_SAFE_INTEGER ) }.png`;
        fs.writeFile( imgFilePath, image_base64, 'base64', function(err) {
          if ( !err ){
            postImageFn( client, imgFilePath );
          }
        } );
      }  
    }
  }
}

module.exports = MastodonClient;
