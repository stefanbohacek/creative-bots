const fs = require( 'fs' ),
      helpers = require(__dirname + '/../helpers/helpers.js'),
      tumblr = require( 'tumblr.js' );
      
module.exports = {
  client: function( keys ){
    let tumblrClient = {};
    
    if ( keys && keys.consumer_key && keys.consumer_secret && keys.token && keys.token_secret ){
      tumblrClient = tumblr.createClient( keys );
    }
    
    return tumblrClient;
  },
  createTextPost: function( tumblrClient, tumblrName, text, imgData, cb ) {
    if ( tumblrClient ){
      tumblrClient.createPhotoPost( tumblrName, {
        caption: text,
        data64: imgData
      }, function( err, data ){
        console.log( 'tumblrd', `https://${ tumblrName }.tumblr.com/post/${ data.id_string }` )
        if ( cb ){
          cb( err, data );
        }
      });
    }
  },
  postImage: function( tumblrClient, tumblrName, text, imgData, cb ) {
    if ( tumblrClient ){
      tumblrClient.createPhotoPost( tumblrName, {
        caption: text,
        data64: imgData
      }, function( err, data ){
        console.log( 'tumblrd', `https://${ tumblrName }.tumblr.com/post/${ data.id_string }` )
        if ( cb ){
          cb( err, data );
        }
      });
    }
  }
};