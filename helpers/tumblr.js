const fs = require( 'fs' ),
      helpers = require(__dirname + '/../helpers/helpers.js'),
      tumblr = require( 'tumblr.js' );
      
module.exports = {
  client: function( keys ){
    let tumblrClient = {};
    
    if ( keys && keys.consumer_key && keys.consumer_secret && keys.token && keys.token_secret ){
      tumblrClient = tumblr.createClient( keys );
      tumblrClient.tumblr_name = keys.tumblr_name;
    }
    
    return tumblrClient;
  },
  post: function( tumblrClient, title, body, cb ) {
    if ( tumblrClient ){
      tumblrClient.createTextPost( tumblrClient.tumblr_name, {
        title: title,
        body: body
      }, function( err, data ){
        console.log( 'tumblrd', `https://${ tumblrClient.tumblr_name }.tumblr.com/post/${ data.id_string }` )
        if ( cb ){
          cb( err, data );
        }
      });
    }
  },
  postImage: function( tumblrClient, text, imgData, cb ) {
    if ( tumblrClient ){
      tumblrClient.createPhotoPost( tumblrClient.tumblr_name, {
        caption: text,
        data64: imgData
      }, function( err, data ){
        console.log( 'tumblrd', `https://${ tumblrClient.tumblr_name }.tumblr.com/post/${ data.id_string }` )
        if ( cb ){
          cb( err, data );
        }
      });
    }
  }
};